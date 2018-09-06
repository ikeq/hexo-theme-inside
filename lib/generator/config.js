const { pick, md5, getPagePath, escapeIdentifier } = require('../utils');

module.exports = function (locals) {
  const site = this.config,
    theme = this.theme.config,
    config = Object.assign(
      pick(site, ['title', 'subtitle', 'description', 'author']),
      pick(theme, ['profile', 'menu', 'footer', 'comments', 'post']),
      {
        routes: locals.pages.map(page => getPagePath(page.source)).sort(),
        count: {
          posts: locals.posts.filter(post => post.published).length,
          categories: locals.categories.length,
          tags: locals.tags.filter(tag => tag.posts.filter(post => post.published).length).length
        },
        api: theme.theme.api_prefix,
        color: theme.pwa.manifest ? theme.pwa.manifest.theme_color : '#2a2b33',
        hash: theme.runtime.buildHash,
        locale: this.theme.i18n.get()
      }
    );

  if (config.count.categories) config.firstCategory = locals.categories.sort('name').data[0].name;

  if (theme.sns.email) theme.sns.email = 'mailto:' + theme.sns.email;
  for (let key in theme.sns) {
    if (theme.sns[key]) (config.sns || (config.sns = [])).push([escapeIdentifier(key), theme.sns[key]]);
  }

  let data = 'window.__inside__=' + JSON.stringify(config);

  if (theme.pwa.workbox)
    data += `;navigator.serviceWorker && location.protocol === 'https:' && window.addEventListener('load', function() { navigator.serviceWorker.register('${theme.pwa.workbox.name}') })`

  theme.runtime.configHash = md5(data);

  return [{
    path: `config.${theme.runtime.configHash}.js`,
    data
  }];
};
