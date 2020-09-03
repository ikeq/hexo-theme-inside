const { pick } = require('../../utils');
const { page: pageProps } = require('./properties');

module.exports = function ({ locals: { pages }, helpers }) {
  return [
    pages.map(page => [
      helpers.generateJson({
        path: page.link,
        data: pick(page, pageProps)
      }),
      helpers.generateHtml({
        path: page.link,
        data: page
      })
    ]),

    helpers.generateHtml({
      path: '404',
      data: { type: 'pages', title: '404' }
    })
  ].flat(Infinity);
}
