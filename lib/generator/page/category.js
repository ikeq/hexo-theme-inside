const utils = require('../../utils');

module.exports = function (locals, { i18n }) {
  let categories = locals.categories.toArray(),
    pageSize = this.theme.config.category && this.theme.config.category.per_page !== undefined ? this.theme.config.category.per_page : 10,
    title = i18n('title.category'),
    out = [];

  if (!categories.length) return [];

  out.push({
    path: '/categories/index.html',
    layout: 'index',
    data: { title: title }
  });

  categories.forEach(category => {
    let pageCount = pageSize === 0 ? 0 : Math.ceil(category.posts.length / pageSize);

    out.push({
      path: `/categories/${category.name}/index.html`,
      layout: 'index',
      data: { title: title + ' : ' + category.name }
    });

    for (let i = 1; i < pageCount; i++) {
      out.push({
        path: `/categories/${category.name}/${i + 1}/index.html`,
        layout: 'index',
        data: { title: title + ' : ' + category.name }
      })
    }

  });

  return out;
}