const fs = require('fs');
const path = require('path');
const { magenta } = require('chalk');
const { trimHtml, asyncMap } = require('../utils');

module.exports = function () {
  const hexo = this;
  const { theme: { config: theme } } = this;

  if (!theme.seo || !theme.seo.ssr || !~['g', 'generate'].indexOf(hexo.env.cmd)) return;

  const render = require(path.join(hexo.theme_dir, 'source/_ssr.js')).Renderer();
  const { generatedConfig, generatedRoutes } = hexo.theme.config.runtime;
  const root = hexo.config.root.replace(/^[\\|\/]+|[\\|\/]+$/g, '');

  asyncMap(generatedRoutes, (route) => {
    const documentUrl = path.join(hexo.public_dir, route);

    return render({
      url: '/' + trimHtml(route),
      document: fs.readFileSync(documentUrl),
      resolver: {
        config: generatedConfig,
        getData(url) {
          url = path.join(hexo.public_dir, url.replace(new RegExp('^[\\|/]+' + root), ''));

          return require(url);
        },
      },
    }).then(html => {
      fs.writeFileSync(documentUrl, html);
      hexo.log.info('SSR: %s', magenta(route));
    });
  });
};
