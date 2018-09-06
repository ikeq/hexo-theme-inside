const urlFor = require('hexo/lib/plugins/helper/url_for');
const trim_slash_regex = /(^\/*|\/*$)/g;

module.exports = function () {
  const workbox = this.theme.config.pwa.workbox;

  if (!workbox) return;

  const root = ('/' + this.config.root.replace(trim_slash_regex, '')).replace(/^\/$/, '');
  const api_prefix = this.theme.config.theme.api_prefix;
  const rules = {
    sw: { name: 'is-sw', strategy: 'networkOnly', regex: genRegex(workbox.name) },
    theme: { name: 'is-theme', strategy: 'cacheFirst', regex: `${root}/.*\\\\.(?:js|css|woff2|png|jpg|gif)$` },
    data: { name: 'is-data', strategy: 'cacheFirst', regex: `${genRegex(api_prefix)}/.*${genRegex('.json?')}` },
    gravatar: { name: 'is-gravatar', strategy: 'staleWhileRevalidate', regex: genRegex('https://www.gravatar.com') },
    html: { name: 'is-html', regex: `${root}/.*(:?/[^\\\\.]*/?)$` }
  };
  const expire = workbox.expire * 60 * 60;

  if (workbox.rules) {
    workbox.rules.forEach(({ name, strategy, regex }) => {
      rules[name] = { name: 'is-' + name, strategy, regex };
    })
  }

  let script = ['self.skipWaiting();', '', `importScripts('${workbox.cdn}');`];

  if (workbox.module_path_prefix)
    script.push(`workbox.setConfig({ modulePathPrefix: '${workbox.module_path_prefix}' });`);

  script.push('', `var version = '${this.theme.config.runtime.buildHash}';`, '');

  // Clean up the cache whenever the version changed
  script.push(`${JSON.stringify(Object.values(rules).map(i => i.name))}.forEach(name => { caches.delete(name); indexedDB.deleteDatabase(name); })`, '');

  // Routing
  for (const name in rules) {
    if (name === 'html') continue;

    const rule = rules[name];
    const routes = [
      `workbox.routing.registerRoute(new RegExp('${rule.regex}'), workbox.strategies.${rule.strategy}({`,
      `  cacheName: '${rule.name}',`,
      '}));'
    ];

    if (expire && rule.strategy !== 'networkOnly')
      routes.splice(2, 0, `  plugins: [ new workbox.expiration.Plugin({ maxAgeSeconds: ${expire} }) ],`);

    script = script.concat(routes);
  };

  script.push('');

  // Special handling for html to avoid multiple redirects
  if (expire)
    script.push(`var htmlManager = new workbox.expiration.CacheExpiration('${rules.html.name}', { maxAgeSeconds: ${expire} });`);
  script.push(
    `workbox.routing.registerRoute(new RegExp('${rules.html.regex}'), function(context) {`,
    `  var url = context.url.pathname + (context.url.pathname.endsWith('/') ? '' : '/') + 'index.html';`,
    `  return caches.match(url)`,
    `    .then(res => {`,
    expire ?
      `      if (res) htmlManager.updateTimestamp(url);` : '',
    `      return res || fetch(url);`,
    `    })`,
    `    .then(res => {`,
    `       caches.open('${rules.html.name}').then(cache => cache.put(url, res));`,
    `       return res.clone();`,
    `     })`,
    `    .catch(() => fetch(context.event.request));`,
    `});`
  );

  return [{
    path: urlFor.call(this, workbox.name),
    data: script.join('\n')
  }];

};

function genRegex(str) {
  return str ? str.replace(trim_slash_regex, '').replace(/(\.|\?|\:)/g, '\\\\$1') : '';
}
