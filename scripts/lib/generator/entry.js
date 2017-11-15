const utils = require('../utils');

module.exports = function (locals) {
  let result = [],
    postNameList = locals.posts.sort('-date')/*.filter(post => post.published)*/.map(post => post.slug);

  postNameList.forEach((post) => {
    result.push({
      path: `/post/${post}/index.html`,
      layout: 'index',
      data: {}
    });
  })
  locals.pages.forEach((page) => {
    result.push({
      path: utils.classifyPage(page) + '.html',
      layout: 'index',
      data: {}
    });
  })

  result.push({
    path: '/search/index.html',
    layout: 'index',
    data: {}
  });

  return result;
}