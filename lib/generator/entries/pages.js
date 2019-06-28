const { flattenDeep } = require('lodash');
const { getPagePath, pick } = require('../../utils');
const { page: pageProps } = require('./properties');

module.exports = function ({ locals: { pages }, helpers }) {
  return flattenDeep([
    pages.map(page => [
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
