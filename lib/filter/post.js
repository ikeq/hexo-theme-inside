const { parseToc, isObject, isEmptyObject, trimHtml } = require('../utils');
const date_formats = [
  'll', // Sep 4, 1986
  'L', // 09/04/1986
  'MM-DD' // 06-17
];

module.exports = function (data) {
  if (data.layout !== 'page' && data.layout !== 'post') return;

  const { config, theme: { config: theme } } = this;
  const { hasComments, hasReward, hasToc, copyright, dateHelper, uriReplacer, renderReadingTime } = theme.runtime;
  const isPage = data.layout === 'page';

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

  // toc
  if (hasToc && theme[data.type].toc && data.toc !== false) {
    const toc = parseToc(data.content, theme.toc.depth);
    if (toc.length) data.toc = toc;
    else delete data.toc;
  } else delete data.toc;

  // reading time
  if (renderReadingTime) {
    data.reading_time = renderReadingTime(data.content);
  }
};
