const utils = require('../../utils');

module.exports = function (locals) {
  let posts = locals.posts.sort('-date').toArray(),
    pages = locals.pages,
    customs = [];

  posts = posts.map((post) => {
    return {
      path: `/post/${post.slug}/index.html`,
      layout: 'index',
      data: { title: post.title }
    };
  });

  pages = pages.map((page) => {
    return {
      path: utils.classifyPage(page) + '.html',
      layout: 'index',
      data: { title: page.title }
    };
  })

  customs.push({
    path: '/404/index.html',
    layout: 'index',
    data: { title: '404' }
  });

  return [...posts, ...pages, ...customs];
}