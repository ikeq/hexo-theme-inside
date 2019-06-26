const { flattenDeep } = require('lodash');
const { pick } = require('../../utils');
const { categoryPosts: categoryPostsProps } = require('./properties');

module.exports = function ({ theme, locals: { categories }, helpers }) {
  const config = theme.category;

  if (!categories.length) return [];

  return flattenDeep([
    helpers.generateJson({
      path: 'categories',
      data: categories.map(i => ({ name: i.name, count: i.posts.length }))
    }),
    helpers.generateHtml({
      path: 'categories',
      data: { type: 'categories' }
    }),
    categories.map(category =>
      helpers.pagination.apply(
        category.posts.map(pick(categoryPostsProps)),
        { perPage: config.per_page, id: `categories/${category.name}`, extend: { name: category.name } },
        [
          { type: 'json' },
          { type: 'html', extend: { type: 'categories' } },
        ]
      )
    )
  ]);
};
