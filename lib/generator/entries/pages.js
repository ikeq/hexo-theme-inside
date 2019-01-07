const { flattenDeep } = require('lodash');
const { getPagePath, pick } = require('../../utils');
const { page: pageProps } = require('./properties');

module.exports = function ({ theme, site, locals, helpers, hasComments }) {
  const pages = locals.pages.sort('title');
  const config = theme.page;

  return flattenDeep([
    pages.map(page => {
      page.slug = getPagePath(page.source);
      page.link = site.url + '/' + page.slug + '/';

      // comments
      if (!hasComments || !page.comments) delete page.comments;
      // comments is default to true
      // else page.comments = true

      // reward
      if (theme.reward && config.reward && page.reward !== false) page.reward = true;

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
