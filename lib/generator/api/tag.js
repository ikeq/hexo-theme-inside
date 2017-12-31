let { pick } = require('../../utils');

module.exports = function (locals) {
  let tags = locals.tags,
    tagPostsProps = ['title', 'date', 'author', 'thumbnail', 'slug', 'excerpt'];

  if (!tags.length) return [];

  return [
    {
      index: '_',
      type: 'tag',
      data: tags.map(i => i.name)
    },

    ...tags.map(tag => {
      return {
        index: tag.name,
        type: 'tag',
        data: {
          name: tag.name,
          posts: tag.posts.map(p => pick(p, tagPostsProps))
        }
      }
    })
  ]
};