const { pick, md5, classifyPage } = require('../utils');
const urlFor = require('hexo/lib/plugins/helper/url_for');

module.exports = function (locals) {
  const now = Date.now(),
    config = 'window.__inside__=' + JSON.stringify(Object.assign(
      pick(this.config, ['title', 'subtitle', 'description', 'author']),
      pick(this.theme.config, ['profile', 'menu', 'footer', 'disqus', 'post']),
      {
        sns: Object.assign(this.config.feed && this.config.feed.path ? { feed: urlFor.call(this, this.config.feed.path) } : {}, this.theme.config.sns),
        // routes
        routes: locals.pages.map(p => classifyPage(p, true)).sort(),
        // count
        count: {
          posts: locals.posts.filter(post => post.published).length,
          categories: locals.categories.length,
          tags: locals.tags.length
        },
        // misc
        api: urlFor.call(this, 'api'),
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
