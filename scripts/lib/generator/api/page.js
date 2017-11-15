let { classifyPage, pick } = require('../../utils');

module.exports = function (locals) {
  let pages = locals.pages,
    pageProps = ['title', 'date', 'updated', 'comments', 'content', 'thumbnail', 'toc'];

  return pages.map(page => {
    return {
      path: `api/page/${classifyPage(page, true)}.json`,
      data: JSON.stringify(pick(page, pageProps))
    };
  });
}