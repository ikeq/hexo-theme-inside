const { pick, md5, parseBackground, flattenObject } = require('../utils');

module.exports = function (locals) {
  const js = this.extend.helper.get('js').bind(this);
  const site = this.config,
    theme = this.theme.config,
    config = Object.assign(
      pick(site, ['title', 'author']),
      pick(theme, ['profile', 'menu', 'sns', 'footer', 'toc', 'reward', 'plugins', 'data_prefix']),
      {
        count: {
          posts: countOverflow(locals.posts.length),
          categories: countOverflow(locals.categories.length),
          tags: countOverflow(locals.tags.length)
        },
        hash: theme.runtime.hash,
        locale: this.theme.i18n.get(site.language),
        theme: {
          default: flattenObject({ ...theme.appearance, darkmode: undefined }),
          dark: flattenObject(theme.appearance.darkmode)
        }
      },
    );

  // extra color from background setting
  // [sidebar bg, body bg] | [sidebar bg] | body bg
  const { accent_color, sidebar_background, background } = theme.appearance
  // [color with sidebar open, color with sidebar close]
  config.color = [
    parseBackground(sidebar_background).color || accent_color]
    .concat(parseBackground(background).color || (theme.pwa && theme.pwa.theme_color) || [])

  // post routes
  config.routes = {}
  config.routes.posts = [...locals.posts
    .reduce((set, post) => {
      // convert `/path/to/path/` to `:a/:b/:c`
      const link = post.link.split('/').filter(i => i)
        .map((_, i) => ':' + String.fromCharCode(97 + i))
        .join('/')
      set.add(link)
      return set
    }, new Set)].sort()

  // allow post/page can be set as index
  config.index = [...locals.posts, ...locals.pages].find(i => i.link === '') ? 'index' : 'page';

  // page routes
  if (locals.pages.length)
    config.routes.pages = [...locals.pages
      .reduce((set, post) => {
        if (post.link === undefined) return set;
        // convert `/path/to/path/` to `path/:a/:b`
        const link = post.link.split('/').filter(i => i)
          .map((partial, i) => i === 0 ? partial : ':' + String.fromCharCode(97 + i))
          .join('/')
        set.add(link)
        return set
      }, new Set)].sort()

  if (config.count.categories) config.category0 = locals.categories[0].name;

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

  // Cache config for ssr
  if (theme.seo.ssr) theme.runtime.generatedConfig = config;

  let data = 'window.__inside__=' + JSON.stringify(config);

  if (theme.pwa.workbox)
    data += `\n;navigator.serviceWorker && location.protocol === 'https:' && window.addEventListener('load', function() { navigator.serviceWorker.register('${theme.pwa.workbox.name}') })`

  const path = `config.${md5(data)}.js`;
  this.extend.injector.register('head_begin', js(path));

  return [{
    path,
    data
  }];
};

function countOverflow(count) {
  return count > 999 ? '999+' : count;
}
