const { flattenDeep } = require('lodash');
const { getPagePath, pick, published } = require('../../utils');
const { page: pageProps } = require('./properties');

module.exports = function ({ locals, helpers }) {
  const pages = locals.pages.sort('title');

  return flattenDeep([
    pages.filter(published).map(page => [
      helpers.generateJson({
        path: `page/${page.link}`,
        data: pick(page, pageProps)
      }),
      helpers.generateHtml({
        path: getPagePath(page.source),
        data: page
      })
    ]),

    helpers.generateHtml({
      path: '404',
      data: { type: 'pages', title: '404' }
    })
  ]);
}
