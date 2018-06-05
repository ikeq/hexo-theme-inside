const { pick, apiPagination } = require('../../utils');
const { tagPosts: tagPostsProps } = require('./properties');

module.exports = function (locals) {
  const tags = locals.tags.sort('name');

  if (!tags.length) return [];

  let out = [];

  tags.forEach(tag => {
    const pagedPosts = apiPagination(tag.posts.sort('-date').map(p => pick(p, tagPostsProps)), {
      type: 'tag',
      indexFn: i => `${tag.name}/${i + 1}`,
      pageSize: this.theme.config.tag && this.theme.config.tag.per_page,
      extend: { name: tag.name }
    });

    out = out.concat(pagedPosts);
  });

  return [
    {
      type: 'tag',
      data: tags.map(i => ({ name: i.name, count: i.posts.length }))
    },

    ...out
  ]
};
