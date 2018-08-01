const path = require('path');
const { flattenDeep } = require('lodash');
const { pick, parseToc } = require('../../utils');
const { post: postProps, postList: postListProps } = require('./properties');

module.exports = function ({ theme, locals, helpers }) {
  const posts = locals.posts.sort('-date').toArray();
  const len = posts.length;
  const config = theme.post;

  return flattenDeep([
    posts.map((post, i) => {
      post.link = helpers.urlFor(path.dirname(post.path));
      post.comments = theme.comments.disqus && post.comments;
      post.type = 'post';

      if (i) post.prev = posts[i - 1];
      if (i < len - 1) post.next = posts[i + 1];

      if (post.toc === undefined || post.toc) {
        const toc = parseToc(post.content, config.toc.depth);
        if (toc.length) post.toc = toc;
        else delete post.toc;
      } else delete post.toc;

      return [
        helpers.generateJson({
          path: `post/${post.slug}`,
          data: pick(post, postProps)
        }),
        helpers.generateHtml({
          path: `/post/${post.slug}`,
          data: post
        })
      ];
    }),

    helpers.pagination.apply(posts.filter(post => post.published).map(pick(postListProps)), { perPage: config.per_page }, [
      { type: 'json', id: 'posts' },
      { type: 'html', id: index => index === 1 ? '' : `page/${index}`, extend: { type: 'posts' } },
    ])
  ]);
}
