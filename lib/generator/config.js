const { pick, md5, classifyPage } = require('../utils');
const urlFor = require('hexo/lib/plugins/helper/url_for');

module.exports = function (locals) {
  const now = Date.now(),
    site = this.config,
    theme = this.theme.config,
    config = Object.assign(
      pick(site, ['title', 'subtitle', 'description', 'author']),
      pick(theme, ['profile', 'menu', 'footer', 'disqus', 'post']),
      {
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
        hash: md5(String(now)),
        locale: this.theme.i18n.get()
      }
    );

  // unify theme.footer
  config.footer || (config.footer = {});
  config.footer.powered = config.footer.powered !== false;
  config.footer.theme = config.footer.theme !== false;
  if (!config.footer.copyright && config.footer.copyright !== false)
    config.footer.copyright = `&copy;${new Date(now).getFullYear()} • <a href="${site.url}">${site.author}</a>`;

  // unify theme.sns
  const sns = theme.sns || {};
  if (sns.email !== undefined) sns.email = sns.email || theme.profile.email || site.email;
  if (sns.email) sns.email = 'mailto:' + sns.email;
  if (sns.feed !== undefined) {
    sns.feed = sns.feed || site.feed && site.feed.path;
    if (sns.feed) sns.feed = urlFor.call(this, sns.feed);
  }
  for (let key in sns) {
    if (sns[key]) (config.sns || (config.sns = [])).push([key, sns[key]]);
  }

  const configStr = JSON.stringify(config);
  script = `config.${md5(configStr)}.js`;
  this.theme._configScript = script;

  return [{
    path: script,
    data: 'window.__inside__=' + configStr + ';'
  }];
};
