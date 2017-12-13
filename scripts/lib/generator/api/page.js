let { classifyPage, pick } = require('../../utils');

module.exports = function (locals) {
  let hexo = this,
    siteUrl = hexo.config.url.replace(/\/*$/, '') + '/',
    pages = locals.pages,
    pageProps = ['title', 'url', 'date', 'updated', 'comments', 'content', 'thumbnail', 'toc'];

  return pages.map(page => {
    let slug = classifyPage(page, true);

    // set url
    page.url = siteUrl + slug;

    return {
      path: `api/page/${slug}.json`,
      data: JSON.stringify(pick(page, pageProps))
    };
  });
}