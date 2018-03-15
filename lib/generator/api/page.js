const { classifyPage, pick } = require('../../utils');
const { page: pageProps } = require('./properties');

module.exports = function (locals) {
  const pages = locals.pages.sort('title');

  return pages.map(page => {
    const slug = classifyPage(page, true);

    return {
      index: slug,
      type: 'page',
      data: pick(page, pageProps)
    };
  });
}