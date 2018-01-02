let { classifyPage, pick } = require('../../utils');

module.exports = function (locals) {
  let siteUrl = this.config.url.replace(/\/*$/, '') + '/',
    pages = locals.pages,
    pageProps = ['title', 'url', 'date', 'updated', 'comments', 'content', 'thumbnail', 'toc', 'color'];

  return pages.map(page => {
    let slug = classifyPage(page, true);

    // set url
    page.url = siteUrl + slug;

    return {
      index: slug,
      type: 'page',
      data: pick(page, pageProps)
    };
  });
}