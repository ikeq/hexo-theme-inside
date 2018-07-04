const { pick, apiPagination, parseToc } = require('../../utils');
const { post: postProps, postList: postListProps } = require('./properties');
const urlFor = require('hexo/lib/plugins/helper/url_for');

module.exports = function (locals) {
  const posts = locals.posts.sort('-date');
  const config = this.theme.config.post || {};

  return [
    ...posts.map(post => {
      post.link = urlFor.call(this, post.slug);

      if (post.toc === undefined || post.toc) {
        const toc = parseToc(post.content, config.toc && config.toc.depth);
        if (toc.length) post.toc = toc;
        else delete post.toc;
      } else delete post.toc;

      return {
        index: post.slug,
        type: 'post',
        data: pick(post, postProps)
      };
    }),

    ...apiPagination(posts.filter(post => post.published).map(post => pick(post, postListProps)), { pageSize: this.config.per_page, type: 'post' })
  ]
}
