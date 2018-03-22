const utils = require('../../utils');

module.exports = function (locals, { i18n }) {
  let tags = locals.tags.toArray(),
    pageSize = this.theme.config.tag && this.theme.config.tag.per_page !== undefined ? this.theme.config.tag.per_page : 10,
    title = i18n('title.tag'),
    out = [];

  if (!tags.length) return [];

  out.push({
    path: '/tags/index.html',
    layout: 'index',
    data: { title: title }
  });

  tags.forEach(tag => {
    let pageCount = pageSize === 0 ? 0 : Math.ceil(tag.posts.length / pageSize);

    out.push({
      path: `/tags/${tag.name}/index.html`,
      layout: 'index',
      data: { title: title + ' : ' + tag.name }
    });

    for (let i = 1; i < pageCount; i++) {
      out.push({
        path: `/tags/${tag.name}/${i + 1}/index.html`,
        layout: 'index',
        data: { title: title + ' : ' + tag.name }
      })
    }

  });

  return out;
}