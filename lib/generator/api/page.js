const { classifyPage, pick } = require('../../utils');
const { page: pageProps } = require('./properties');
const urlFor = require('hexo/lib/plugins/helper/url_for');

module.exports = function (locals) {
  const pages = locals.pages.sort('title');
  const comments = this.theme.config.disqus && this.theme.config.disqus.shortname;

  return pages.map(page => {
    page.link = urlFor.call(this, page.slug);
    page.slug = classifyPage(page, true);
    page.comments = comments && page.comments;

    return {
      index: page.slug,
      type: 'page',
      data: pick(page, pageProps)
    };
  });
}
