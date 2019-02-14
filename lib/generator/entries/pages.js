const { flattenDeep } = require('lodash');
const { getPagePath, pick } = require('../../utils');
const { page: pageProps } = require('./properties');

module.exports = function ({ locals, helpers }) {
  const pages = locals.pages.sort('title');

  return flattenDeep([
    pages.map(page => {
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
