const { pick, md5, classifyPage } = require('../utils');
const { site: siteConfigProps, theme: themeConfigProps } = require('./api/properties');

module.exports = function (locals) {
  const now = Date.now(),
    root = this.config.root.replace(/[\\|\/]{2,}/g, '/').replace(/^\/|\/$/g, ''),
    config = 'window.__inside__=' + JSON.stringify(Object.assign(
      pick(this.config, ['title', 'subtitle', 'description', 'author']),
      pick(this.theme.config, ['profile', 'menu', 'footer', 'disqus']),
      {
        sns: Object.assign({ feed: this.config.feed }, this.theme.config.sns),
        // routes
        routes: locals.pages.map(p => classifyPage(p, true)),
        // count
        count: {
          posts: locals.posts.filter(post => post.published).length,
          categories: locals.categories.length,
          tags: locals.tags.length
        },
        // misc
        api: root ? (root + '/api') : 'api',
        time: now,
        hash: md5(String(now)),
        locale: this.theme.i18n.get()
      }
    )) + ';',
    script = `config.${md5(config)}.js`;

  this.theme._configScript = script;

  return [{
    path: script,
    data: config
  }];
};
