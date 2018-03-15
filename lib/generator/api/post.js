const { pick, apiPagination } = require('../../utils');
const { post: postProps, postList: postListProps } = require('./properties');

module.exports = function (locals) {
  const posts = locals.posts.sort('-date');

  return [
    ...posts.map(post => {
      return {
        index: post.slug,
        type: 'post',
        data: pick(post, postProps)
      };
    }),

    ...apiPagination(posts.filter(post => post.published).map(post => pick(post, postListProps)), { pageSize: this.config.per_page, type: 'post' })
  ]
}