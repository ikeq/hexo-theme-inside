const cheerio = require('cheerio');
const { date } = require('hexo/lib/plugins/helper/date');
const bounded = '<div class="article-bounded"></div>';
const table = '<div class="article-table"></div>';
const img = '<div class="article-img"></div>';
const { snippet, getPagePath, parseToc, isObject, isEmptyObject, localeId, pick } = require('../utils');

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
    dateHelper = date.bind({ page: { lang: localeId(config.language) }, config })
  if (uriReplacer === undefined)
    uriReplacer = theme.assets ?
      (() => {
        const { prefix, suffix } = theme.assets;
        return s => s.match(/^(http|data\:image)/) ?
          s :
          s.replace(/^\/*(.*[^\/])\/*$/, prefix + '/$1' + suffix)
      })() :
      s => s;

  // Make sure articles without titles are also accessible
  if (!data.title) data.title = data.slug

  // post thumbnail
  if (!isPage && data.thumbnail) {
    const particals = data.thumbnail.split(' ');
    data.thumbnail = uriReplacer(particals[0]);
    if (particals[1] && !data.color)
      data.color = particals[1];
  }

  // relative link
  data.link = isPage ? getPagePath(data.source) : `post/${data.slug}`;

  // permalink link
  data.plink = `${config.url}/${data.link}/`;

  // type
  data.type = isPage ? 'page' : 'post';

  // comments
  data.comments = hasComments && data.comments !== false;

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
  data.content = processHtml(data.content, processData);
  data.excerpt = processHtml(data.excerpt, processData);

  // toc
  if (hasToc && theme[data.type].toc && data.toc !== false) {
    const toc = parseToc(data.content, theme.toc.depth);
    if (toc.length) data.toc = toc;
    else delete data.toc;
  } else delete data.toc;

  function processHtml(html, { link }) {
    const $ = cheerio.load(html, { decodeEntities: false });
    const $$ = $.root();

    // assets
    $('img').each(function () {
      const img$ = $(this), src = img$.attr('src');
      src && img$.attr('src', uriReplacer(src))
    });

    // optimize table display
    $$.children('table')
      // remove empty thead
      .each(function () {
        const $thead = $(this).children('thead');
        if (!$thead.find('th').map((_, el) => $(el).html()).get().join('').replace(/\&nbsp;/g, '').trim()) $thead.remove();
      })
      .wrap(bounded).wrap(table);

    // wrap <script> with <div class="is-snippet">
    $$.children('script').each(function () {
      const $script = $(this),
        // src = $script.attr('src'),
        html = $script.html();

      if (html) $script.replaceWith(snippet(html));
      // inline <script src=""> is not allowed
      // else if (src) $script.wrap(snippet(null, i => ''));
    });

    // wrap block images to behave as a block
    $$.children('p').each(function () {
      const $el = $(this), $imgs = $el.children('img');

      if ($imgs.length > 0 && !$el.text().trim()) {
        // mark as zoomable
        $imgs.attr('data-zoomable', '');
        $el.wrap(img);
      }
    });

    // headings
    $$.children('h1,h2,h3,h4,h5,h6').each(function () {
      const $el = $(this);

      // Note this affects parseToc()
      $el.find('a.headerlink').remove().end().append(`<a href="${link}#${$el.attr('id')}"></a>`);
    });

    return $.html();
  }
};
