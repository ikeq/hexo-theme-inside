const { pick, visible } = require('../../utils');
const { post: postProps, postList: postListProps } = require('./properties');

module.exports = function ({ theme, locals: { posts, indexRouteDetected }, helpers }) {
  const len = posts.length;
  const config = theme.post;
  const getPageId = indexRouteDetected
    ? index => `page/${index}`
    : index => index === 1 ? '' : `page/${index}`;

  return [
    posts.map((post, i) => {
      if (i) post.prev = posts[i - 1];
      if (i < len - 1) post.next = posts[i + 1];

      return [
        helpers.generateJson({
          path: post.link || 'index',
          data: pick(post, postProps)
        }),
        helpers.generateHtml({
          path: `/${post.link}`,
          data: post
        })
      ];
    }),

    helpers.pagination.apply(posts.filter(visible).sort((a, b) => {
      const ai = typeof a.sticky === 'number' ? a.sticky : 0;
      const bi = typeof b.sticky === 'number' ? b.sticky : 0;

      if (ai !== bi) return bi - ai;
      if (a.date === b.date) return 0;
      return a.date > b.date ? -1 : 1;
    }).map(pick(postListProps)), { perPage: config.per_page }, [
        { type: 'json', id: 'page' },
        { type: 'html', id: getPageId, extend: { type: 'posts' } },
      ])
  ].flat(Infinity);
}
