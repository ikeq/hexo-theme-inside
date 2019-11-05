const cheerio = require('cheerio');
const { date } = require('hexo/lib/plugins/helper/date');
const { snippet, parseToc, isObject, isEmptyObject, localeId, pick, trimHtml } = require('../utils');
const bounded = '<div class="article-bounded"></div>';
const table = '<div class="article-table"></div>';
const date_formats = [
  'll', // Sep 4, 1986
  'L', // 09/04/1986
  'MM-DD' // 06-17
];

// cache
let hasComments, hasReward, hasToc, copyright, dateHelper, uriReplacer;

module.exports = function (data) {
  if (data.layout !== 'page' && data.layout !== 'post') return;

  const config = this.config;
  const theme = this.theme.config;
  const isPage = data.layout === 'page';

  if (hasComments === undefined)
    hasComments = !!(theme.comments || theme.plugins && theme.plugins.comments);
  if (hasReward === undefined)
    hasReward = !!theme.reward;
  if (hasToc === undefined)
    hasToc = !!theme.toc;
  if (copyright === undefined)
    copyright = theme.copyright;
  if (dateHelper === undefined)
    dateHelper = date.bind({ page: { lang: localeId(config.language, true) }, config })
  if (uriReplacer === undefined) {
    uriReplacer = (() => {
      let assetsFn = src => src;
      if (theme.assets) {
        const prefix = theme.assets.prefix ? theme.assets.prefix + '/' : ''
        const suffix = theme.assets.suffix || ''
        assetsFn = src => prefix + `${src}${suffix}`.replace(/\/{2,}/g, '/')
      }

      return (src, assetPath) => {
        assetPath = assetPath ? assetPath + '/' : ''

        // skip both external and absolute path
        return /^(\/\/?|http|data\:image)/.test(src) ? src : assetsFn(`${assetPath}${src}`);
      }
    })();
  }

  // pre format date for i18n
  data.date_formatted = date_formats.reduce((ret, format) => {
    ret[format] = dateHelper(data.date, format)
    return ret
  }, {})

  // relative link
  data.link = trimHtml(data.path);
  // permalink link
  data.plink = `${config.url}/${data.link}/`;
  // type
  data.type = isPage ? 'page' : 'post';

  // comments
  data.comments = hasComments && data.comments !== false;

  // asset path (for post_asset_folder)
  const assetPath = config.post_asset_folder
    ? (isPage ? trimHtml(data.path, true) : data.link)
    : undefined;

  // Make sure articles without titles are also accessible
  if (!data.title) data.title = data.slug

  // post thumbnail
  if (!isPage && data.thumbnail) {
    const particals = data.thumbnail.split(' ');
    data.thumbnail = uriReplacer(particals[0], assetPath);
    if (particals[1] && !data.color)
      data.color = particals[1];
  }

  // reward
  if (hasReward && theme[data.type].reward && data.reward !== false) data.reward = true;

  // copyright
  let cr;
  if (
    (copyright && theme[data.type].copyright && data.copyright === undefined) ||
    (copyright && data.copyright === true)
  ) {
    cr = Object.assign({}, copyright);
  }
  // override page/post.copyright with front matter
  else if (isObject(data.copyright)) {
    cr = Object.assign({}, data.copyright);
  }
  if (cr) {
    if (cr.custom) cr = { custom: cr.custom };
    else {
      if (cr.author) cr.author = data.author || config.author;
      else delete cr.author;
      if (cr.link) cr.link = `<a href="${data.plink}" title="${data.title}">${data.plink}</a>`;
      else delete cr.link;
      if (cr.published) cr.published = dateHelper(data.date, 'LL');
      else delete cr.published;
      if (cr.updated) cr.updated = dateHelper(data.updated, 'LL');
      else delete cr.updated;
    }

    if (!isEmptyObject(cr)) data.copyright = cr;
    else delete data.copyright;
  } else delete data.copyright;

  const processData = pick(data, ['link'])
  processData.assetPath = assetPath
  data.content = processHtml(data.content, processData);
  data.excerpt = processHtml(data.excerpt, processData);

  // toc
  if (hasToc && theme[data.type].toc && data.toc !== false) {
    const toc = parseToc(data.content, theme.toc.depth);
    if (toc.length) data.toc = toc;
    else delete data.toc;
  } else delete data.toc;

  function processHtml(html, { link, assetPath }) {
    const $ = cheerio.load(html, { decodeEntities: false });
    const $$ = $.root();

    $('img').each(function () {
      const $img = $(this);
      const src = $img.attr('src');

      if (src) {
        // assets & post_asset_folder
        $img.attr('src', uriReplacer(src, assetPath));

        // native lazyload
        // $img.attr('loading', 'lazy')
      }

      if (
        this.root // {% img %}
        || (this.parent.tagName === 'p' && !$(this.parent).text().trim()) // \n![]()\n
        || (this.parent.tagName === 'figure') // <figure><img></figure>
      ) {
        // mark as zoomable
        $img.addClass('article-img');
      }
    });

    // optimize table display
    $$.children('table')
      // remove empty thead
      .each(function () {
        const $thead = $(this).children('thead');
        if (!$thead.find('th').map((_, el) => $(el).html()).get().join('').replace(/\&nbsp;/g, '').trim()) $thead.remove();
      })
      .wrap(bounded).wrap(table);

    // optimize code block
    $('.highlight')
      // remove unused language class
      .each(function () {
        $(this).attr('class', 'highlight')
      })
      .children('table').wrap('<div></div>');

    // wrap <script> with <div class="is-snippet">
    $$.children('script').each(function () {
      const $script = $(this),
        // src = $script.attr('src'),
        html = $script.html();

      if (html) $script.replaceWith(snippet(html));
      // inline <script src=""> is not allowed
      // else if (src) $script.wrap(snippet(null, i => ''));
    });

    // headings
    $$.children('h1,h2,h3,h4,h5,h6').each(function () {
      const $el = $(this);

      // Note this affects parseToc()
      $el.find('a.headerlink').remove().end().append(`<a href="${link}#${$el.attr('id')}"></a>`);
    });

    // append `link` for hash link
    $('a').each(function () {
      const $anchor = $(this),
        href = $anchor.attr('href')

      if (href && href.startsWith('#')) $anchor.attr('href', link + href)
    });

    return $.html();
  }
};
