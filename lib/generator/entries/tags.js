const { flattenDeep } = require('lodash');
const { pick, published } = require('../../utils');
const { tagPosts: tagPostsProps } = require('./properties');

module.exports = function ({ theme, locals, helpers }) {
  const tags = locals.tags.filter(tag => tag.posts.filter(published).length).sort('name');
  const config = theme.tag;

  if (!tags.length) return [];

  return flattenDeep([
    helpers.generateJson({
      path: 'tags',
      data: tags.map(tag => ({ name: tag.name, count: tag.posts.length }))
    }),
    helpers.generateHtml({
      path: 'tags',
      data: { type: 'tags' }
    }),

    tags.map(tag => [
      helpers.pagination.apply(
        tag.posts.sort('-date').map(pick(tagPostsProps)),
        { perPage: config.per_page, id: `tags/${tag.name}`, extend: { name: tag.name } },
        [
          { type: 'json' },
          { type: 'html', extend: { type: 'tags' } },
        ]
      )
    ])
  ]);
};
