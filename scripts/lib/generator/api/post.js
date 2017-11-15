let { pick } = require('../../utils');

const postProps = ['title', 'slug', 'author', 'date', 'updated', 'comments', 'excerpt', 'content', 'thumbnail', 'tags', 'prev', 'next'],
  postPageProps = ['title', 'slug', 'author', 'date', 'updated', 'comments', 'excerpt', 'thumbnail', 'tags'];

module.exports = function (locals) {
  let postList = locals.posts.sort('date', -1).filter(post => post.published).map(post => pick(post, postPageProps)),
    len = postList.length,
    pageSize = 4,
    pageCount = Math.ceil(len / pageSize),
    pagePosts = '.'.repeat(pageCount).split('').map((a, i) => {
      return {
        path: `api/posts/${i + 1}.json`,
        data: JSON.stringify({
          total: len,
          pageSize: pageSize,
          pageCount: pageCount,
          current: i + 1,
          data: postList.slice(i * pageSize, (i + 1) * pageSize)
        })
      }
    });

  return [
    ...locals.posts.map(post => {
      return {
        path: `api/articles/${post.slug}.json`,
        data: JSON.stringify(pick(post, postProps))
      };
    }),

    ...pagePosts
  ]
}