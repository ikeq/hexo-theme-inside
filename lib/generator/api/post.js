let { pick } = require('../../utils');

const postProps = ['title', 'slug', 'url', 'author', 'date', 'updated', 'comments', 'excerpt', 'content', 'thumbnail', 'tags', 'prev', 'next'],
  postListProps = ['title', 'slug', 'url', 'author', 'date', 'updated', 'comments', 'excerpt', 'thumbnail', 'tags'];

module.exports = function (locals) {
  let siteUrl = this.config.url.replace(/\/*$/, '') + '/',
    posts = locals.posts.sort('-date').map(post => {
      // set url
      post.url = siteUrl + post.slug;

      return post;
    }),
    publishedPostList = posts.filter(post => post.published).map(post => pick(post, postListProps)),
    publishedPostListLen = publishedPostList.length,
    pageSize = this.config.per_page || 5,
    pageCount = Math.ceil(publishedPostListLen / pageSize),
    pagePosts = '.'.repeat(pageCount).split('').map((a, i) => {
      return {
        path: `api/posts/${i + 1}.json`,
        data: JSON.stringify({
          total: publishedPostListLen,
          pageSize: pageSize,
          pageCount: pageCount,
          current: i + 1,
          data: publishedPostList.slice(i * pageSize, (i + 1) * pageSize)
        })
      }
    });

  return [
    ...posts.map(post => {
      return {
        path: `api/articles/${post.slug}.json`,
        data: JSON.stringify(pick(post, postProps))
      };
    }),

    ...pagePosts
  ]
}