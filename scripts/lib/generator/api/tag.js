let { pick } = require('../../utils');

module.exports = function (locals) {
  let tags = locals.tags,
    tagPostsProps = ['title', 'date', 'author', 'thumbnail', 'slug', 'excerpt'];

  if (!tags.length) return [];

  return [
    {
      path: 'api/tags.json',
      data: JSON.stringify(tags.map(i => i.name))
    },

    ...tags.map(tag => {
      return {
        path: `api/tags/${tag.name}.json`,
        data: JSON.stringify({
          name: tag.name,
          posts: tag.posts.map(p => pick(p, tagPostsProps))
        })
      }
    })
  ]
};