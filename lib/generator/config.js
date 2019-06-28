const { pick, md5 } = require('../utils');

module.exports = function (locals) {
  const site = this.config,
    theme = this.theme.config,
    config = Object.assign(
      pick(site, ['title', 'author']),
      pick(theme, ['profile', 'menu', 'sns', 'footer', 'toc', 'comments', 'reward', 'plugins', 'data_prefix']),
      {
        count: {
          posts: countOverflow(locals.posts.length),
          categories: countOverflow(locals.categories.length),
          tags: countOverflow(locals.tags.length)
        },
        color: theme.appearance.accent_color,
        hash: theme.runtime.hash,
        locale: this.theme.i18n.get(site.language)
      }
    );

  // page routes
  if (locals.pages.length)
    config.routes = locals.pages.map(page => page.link).sort();

  if (config.count.categories) config.firstCategory = locals.categories[0].name;

  // search
  if (theme.search) {
    const adapter = theme.search.adapter;
    if (adapter.range) {
      config.search = { local: true }
      if (adapter.per_page) config.search.per_page = adapter.per_page
    } else {
      config.search = adapter
    }
    // Merge search.fab, search.page into adapter
    if (theme.search.fab) config.search.fab = true;
    if (theme.search.page) config.search.page = true;
  }

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
