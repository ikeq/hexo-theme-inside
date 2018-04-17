const { pick, md5 } = require('../utils');
const { site: siteConfigProps, theme: themeConfigProps } = require('./api/properties');

module.exports = function (locals) {
  const config = 'window.__inside__=' + JSON.stringify({
    site: pick(this.config, siteConfigProps),
    theme: pick(this.theme.config, themeConfigProps),
    locale: this.theme.i18n.get(),
    hash: md5(String(Date.now())),
    count: {
      posts: locals.posts.filter(post => post.published).length,
      categories: locals.categories.length,
      tags: locals.tags.length
    }
  }) + ';';
  const script = `config.${md5(config)}.js`;

  this.theme.configScript = script;

  return [{
    path: script,
    data: config
  }];
};