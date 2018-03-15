const utils = require('../../utils');

module.exports = function (locals) {
  let tags = locals.tags.toArray(),
    pageSize = this.theme.config.tag && this.theme.config.tag.per_page !== undefined ? this.theme.config.tag.per_page : 10,
    out = [];

  if (!tags.length) return [];

  out.push({
    path: '/tags/index.html',
    layout: 'index',
    data: { tag: true }
  });

  tags.forEach(tag => {
    let pageCount = pageSize === 0 ? 0 : Math.ceil(tag.posts.length / pageSize);

    out.push({
      path: `/tags/${tag.name}/index.html`,
      layout: 'index',
      data: { tag: tag.name }
    });

    for (let i = 1; i < pageCount; i++) {
      out.push({
        path: `/tags/${tag.name}/${i + 1}/index.html`,
        layout: 'index',
        data: { tag: tag.name }
      })
    }

  });

  return out;
}