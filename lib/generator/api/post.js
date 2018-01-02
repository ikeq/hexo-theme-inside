let { pick } = require('../../utils');

const postProps = ['title', 'slug', 'url', 'author', 'date', 'updated', 'comments', 'excerpt', 'thumbnail', 'dropcap', 'tags', 'content', 'prev', 'next', 'color'],
  postListProps = ['title', 'slug', 'url', 'author', 'date', 'updated', 'comments', 'excerpt', 'thumbnail', 'dropcap', 'tags'];

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
        index: `_/${i + 1}`,
        type: 'post',
        data: {
          total: publishedPostListLen,
          pageSize: pageSize,
          pageCount: pageCount,
          current: i + 1,
          data: publishedPostList.slice(i * pageSize, (i + 1) * pageSize)
        }
      }
    });

  return [
    ...posts.map(post => {
      return {
        index: post.slug,
        type: 'post',
        data: pick(post, postProps)
      };
    }),

    ...pagePosts
  ]
}