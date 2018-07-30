const { flattenDeep } = require('lodash');
const { getPagePath, pick } = require('../../utils');
const { page: pageProps } = require('./properties');

module.exports = function ({ theme, locals, helpers }) {
  const pages = locals.pages.sort('title');

  return flattenDeep([
    pages.map(page => {
      page.slug = getPagePath(page.source);
      page.link = helpers.urlFor(page.slug);
      page.comments = theme.comments.disqus && page.comments;
      page.type = 'page';

      return [
        helpers.generateJson({
          path: `page/${page.slug}`,
          data: pick(page, pageProps)
        }),
        helpers.generateHtml({
          path: getPagePath(page.source),
          data: page
        })
      ]
    }),

    helpers.generateHtml({
      path: '404',
      data: { type: 'pages', title: '404' }
    })
  ]);
}
