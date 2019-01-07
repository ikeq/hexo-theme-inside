const { flattenDeep } = require('lodash');
const { pick, parseToc, isObject } = require('../../utils');
const { post: postProps, postList: postListProps } = require('./properties');

module.exports = function ({ theme, site, locals, helpers, hasComments }) {
  const posts = locals.posts.sort('-date').toArray();
  const len = posts.length;
  const config = theme.post;
  const copyright = config.copyright;

  return flattenDeep([
    posts.map((post, i) => {
      post.link = site.url + '/post/' + post.slug + '/';

      // comments
      if (!hasComments || !post.comments) delete post.comments;
      // comments is default to true
      // else post.comments = true

      // copyright
      if (copyright) {
        let cr = Object.assign({}, copyright);
        let postCr = post.copyright;
        if (isObject(postCr)) {
          cr = Object.assign(cr, postCr);
          postCr = true;
        }

        if (cr.custom) cr = { global: cr.global, custom: cr.custom };
        else {
          if (cr.author) cr.author = post.author || site.author;
          else delete cr.author;
          if (cr.link) cr.link = `<a href="${post.link}" title="${post.title}">${post.link}</a>`;
          else delete cr.link;
          if (cr.published) cr.published = helpers.date(post.date, 'LL');
          else delete cr.published;
          if (cr.updated) cr.updated = helpers.date(post.updated, 'LL');
          else delete cr.updated;
        }

        if (cr.global || postCr === true) {
          delete cr.global;
          postCr = postCr !== false ? true : false;
          if (postCr) post.copyright = cr;
        }
      }

      // reward
      if (theme.reward && config.reward && post.reward !== false) post.reward = true;

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
