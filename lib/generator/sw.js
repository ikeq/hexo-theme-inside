const trim_slash_regex = /(^\/*|\/*$)/g;

module.exports = function () {
  const workbox = this.theme.config.pwa.workbox;

  if (!workbox) return;

  const version = this.theme.config.runtime.hash;
  const root = ('/' + this.config.root.replace(trim_slash_regex, '')).replace(/^\/$/, '');
  const globalExpire = workbox.expire * 60 * 60;
  let baseRules = [
    { name: 'sw', strategy: 'networkOnly', regex: genRegex(workbox.name) },
    { name: 'html', regex: `${root}/.*(:?/[^\\\\.]*/?)$`, expire: 0 },
  ], rules = {};

  baseRules.concat(workbox.rules || []).forEach(({ name, strategy, regex, expire }) => {
    rules[name] = { name: getCacheName(name), strategy, regex, expire: typeof expire === 'number' ? expire * 60 * 60 : globalExpire };
  });

  let script = [`importScripts('${workbox.cdn}');`];

  if (workbox.module_path_prefix)
    script.push(`workbox.setConfig({ modulePathPrefix: '${workbox.module_path_prefix}' });`, '');

  // clean up old caches
  script.push(
    `self.addEventListener('install', function (event) {`,
    `  event.waitUntil(`,
    `    caches.keys().then(function (names) {`,
    `      var validSets = ${JSON.stringify(Object.values(rules).map(i => i.name))};`,
    `      return Promise.all(`,
    `        names`,
    `          .filter(function (name) { return !~validSets.indexOf(name); })`,
    `          .map(function (name) {`,
    `            indexedDB && indexedDB.deleteDatabase(name);`,
    `            return caches.delete(name);`,
    `          })`,
    `      ).then(function() { self.skipWaiting() });`,
    `    })`,
    `  );`,
    `});`,
    ''
  );

  // Routing
  for (const name in rules) {
    if (name === 'html') continue;

    const rule = rules[name];
    const routes = [
      `workbox.routing.registerRoute(new RegExp('${rule.regex}'), workbox.strategies.${rule.strategy}({`,
      `  cacheName: '${rule.name}',`,
      '}));'
    ];

    if (rule.expire && rule.strategy !== 'networkOnly')
      routes.splice(2, 0, `  plugins: [ new workbox.expiration.Plugin({ maxAgeSeconds: ${rule.expire} }) ],`);

    script = script.concat(routes);
  };

  script.push('');

  // Special handling for html to avoid multiple redirects
  if (rules.html.expire) {
    script.push(`var htmlManager = new workbox.expiration.CacheExpiration('${rules.html.name}', { maxAgeSeconds: ${rules.html.expire} });`);
    script.push(
      `workbox.routing.registerRoute(new RegExp('${rules.html.regex}'), function(context) {`,
      `  var url = context.url.pathname;`,
      `  if (!url.endsWith('/')) url += '/';`,
      `  return caches.match(url)`,
      `    .then(res => {`,
      `      if (res) htmlManager.updateTimestamp(url);`,
      `      return res || fetch(url);`,
      `    })`,
      `    .then(res => {`,
      `       caches.open('${rules.html.name}').then(cache => cache.put(url, res));`,
      `       return res.clone();`,
      `     })`,
      `    .catch(() => fetch(url));`,
      `});`
    );
  } else {
    script.push(
      `workbox.routing.registerRoute(new RegExp('${rules.html.regex}'), function(context) {`,
      `  var url = context.url.pathname;`,
      `  if (!url.endsWith('/')) url += '/';`,
      `  return fetch(url);`,
      `});`
    );
  }

  return [{
    path: workbox.name,
    data: script.join('\n')
  }];

  function getCacheName(name) {
    return `is-${name}-${version}`;
  }

};

function genRegex(str) {
  return str ? str.replace(trim_slash_regex, '').replace(/(\.|\?|\:)/g, '\\\\$1') : '';
}
