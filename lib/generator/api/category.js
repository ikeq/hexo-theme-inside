const { pick, apiPagination } = require('../../utils');
const { categoryPosts: categoryPostsProps } = require('./properties');

module.exports = function (locals) {
  const categories = locals.categories.sort('name');

  if (!categories.length) return [];

  let out = [];

  categories.forEach(category => {
    const pagedPosts = apiPagination(category.posts.sort('-date').map(p => pick(p, categoryPostsProps)), {
      type: 'category',
      indexFn: i => `${category.name}/${i + 1}`,
      pageSize: this.theme.config.category && this.theme.config.category.per_page,
      extend: { name: category.name }
    });

    out = out.concat(pagedPosts);
  });

  return [
    {
      type: 'category',
      data: categories.map(i => ({ name: i.name, count: i.posts.length }))
    },

    ...out
  ]
};
