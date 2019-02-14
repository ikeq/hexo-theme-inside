const { pick, md5, getPagePath } = require('../utils');

module.exports = function (locals) {
  const site = this.config,
    theme = this.theme.config,
    config = Object.assign(
      pick(site, ['title', 'author']),
      pick(theme, ['profile', 'menu', 'sns', 'footer', 'toc', 'comments', 'reward', 'plugins', 'data_prefix']),
      {
        count: {
          posts: countOverflow(locals.posts.filter(post => post.published).length),
          categories: countOverflow(locals.categories.length),
          tags: countOverflow(locals.tags.filter(tag => tag.posts.filter(post => post.published).length).length)
        },
        color: theme.appearance.accent_color,
        hash: theme.runtime.hash,
        locale: this.theme.i18n.get()
      }
    );

  // page routes
  if (locals.pages.length)
    config.routes = locals.pages.map(page => getPagePath(page.source)).sort();

  if (config.count.categories) config.firstCategory = locals.categories.sort('name').data[0].name;

  let data = 'window.__inside__=' + JSON.stringify(config);

  if (theme.pwa.workbox)
    data += `\n;navigator.serviceWorker && location.protocol === 'https:' && window.addEventListener('load', function() { navigator.serviceWorker.register('${theme.pwa.workbox.name}') })`

  theme.runtime.configHash = md5(data);

  return [{
    path: `config.${theme.runtime.configHash}.js`,
    data
  }];
};

function countOverflow(count) {
  return count > 999 ? '999+' : count;
}
