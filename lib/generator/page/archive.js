const utils = require('../../utils');

module.exports = function (locals, { i18n }) {
  let posts = locals.posts.toArray(),
    pageSize = this.theme.config.archive && this.theme.config.archive.per_page !== undefined ? this.theme.config.archive.per_page : 10,
    title = i18n('title.archive'),
    out = [];

  if (!posts.length) return [];

  // page one
  out.push({
    path: '/archives/index.html',
    layout: 'index',
    data: { title: title }
  });

  let pageCount = pageSize === 0 ? 0 : Math.ceil(posts.length / pageSize);

  for (let i = 1; i < pageCount; i++) {
    out.push({
      path: `/archives/${i + 1}/index.html`,
      layout: 'index',
      data: { title: title }
    })
  }

  return out;
}