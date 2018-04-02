const { classifyPage, pick } = require('../../utils');
const { page: pageProps } = require('./properties');

module.exports = function (locals) {
  const pages = locals.pages.sort('title');
  const root = this.config.url;

  return pages.map(page => {
    const slug = classifyPage(page, true);
    page.link = root + '/' + page.title;

    return {
      index: slug,
      type: 'page',
      data: pick(page, pageProps)
    };
  });
}