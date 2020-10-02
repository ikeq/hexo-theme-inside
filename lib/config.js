const fs = require('fs');
const path = require('path');
const gravatar = require('hexo/lib/plugins/helper/gravatar');
const { date } = require('hexo/lib/plugins/helper/date');
const urlFor = require('hexo/lib/plugins/helper/url_for');
const utils = require('./utils');
const pkg = require('../package.json');
const configSchema = require('./configSchema.json');
const feManifest = require('../source/_manifest.json');
const pluginManifest = require('./plugins/manifest.json');

module.exports = function (hexo) {
  hexo.on('generateBefore', function () {
    const site = hexo.config;
    const theme = Object.assign(hexo.theme.config || {}, site.theme_config);
    const email = theme.profile && theme.profile.email || site.email || '';
    const feed = site.feed ? urlFor.call(this, site.feed.path) : '';
    const result = utils.parseConfig(configSchema, theme, {
      $email: email,
      $feed: feed,
      $copyright: `&copy; ${new Date().getFullYear()} • <a href="${site.url}">${site.author}</a>`,
      $gravatar: gravatar(email, 160),
      $title: site.title,
      $description: site.description
    });
    const urlFn = result.static_prefix ?
      a => utils.isExternal(a) ? a : `${result.static_prefix}/${a}` :
      urlFor.bind(this);

    // override default language
    site.language = utils.localeId(site.language);

    const __ = this.theme.i18n.__(site.language);

    if (!result.data_prefix) result.data_prefix = result.data_dir;

    // attach disqus script
    if (result.comments && result.comments.disqus) {
      const disqus = result.comments.disqus;
      disqus.script = disqus.script || `//${disqus.shortname}.disqus.com/embed.js`;
      delete disqus.shortname;
    }

    // convert menu to array
    if (result.menu) {
      result.menu = Object.keys(result.menu).map(k => {
        const item = [k, result.menu[k]];
        if (utils.isExternal(item[1])) item.push(1);
        return item;
      })
    }

    // sns
    if (result.sns) {
      const sns = [];
      if (result.sns.email !== undefined) result.sns.email = 'mailto:' + (result.sns.email || email);
      if (result.sns.feed !== undefined) result.sns.feed = result.sns.feed || feed;
      for (let key in result.sns) {
        if (result.sns[key]) sns.push([utils.escapeIdentifier(key), result.sns[key]]);
      }
      result.sns = sns;
    }

    result.plugins = [
      // plugins comes first to ensure that their libs is ready when executing dynamic code.
      ...(result.plugins || []),
      ...feManifest.styles,
      ...feManifest.scripts
    ];

    if (result.appearance.font && result.appearance.font.url)
      result.plugins.unshift({ tag: 'link', href: result.appearance.font.url });

    {
      const plugins = { $t: [] };
      result.plugins.forEach(item => {
        if (typeof item === 'string' || item.tag) {
          if (!item.tag) {
            // Built in plugins
            if (pluginManifest[item]) {
              const plugin = require(`./plugins/${pluginManifest[item]}`);
              plugin.exec(hexo, utils.parseConfig(plugin.schema, {}));
              return;
            }
            // Direct with url
            const tag = item.split('?')[0].endsWith('.css') ? 'link' : 'script';
            item = tag === 'link' ? { tag, href: item } : { tag, src: item };
          }

          if (item.src) item.src = urlFn(item.src);
          if (item.href) item.href = urlFn(item.href);
          if (item.code) item.code = loadSnippet(item.code);

          const { tag, code, ...attrs } = item;
          this.extend.injector.register(
            tag === 'script' ? 'body_end' : 'head_end',
            utils.htmlTag(tag, attrs, code)
          );
          return;
        }

        // Built in plugins
        const pluginName = Object.keys(item)[0];
        if (pluginManifest[pluginName]) {
          const plugin = require(`./plugins/${pluginManifest[pluginName]}`);
          plugin.exec(hexo, utils.parseConfig(plugin.schema, item[pluginName]));
          return;
        }

        /**
         * Positioned plugins
         * convert into the following format
         * {
         *   $t: ['0', '1', '2', '3'],
         *   sidebar: [indexes],
         *   post: [indexes],
         *   page: [indexes],
         *   comments: [indexes]
         * }
         */
        const index = plugins.$t.length;
        plugins.$t.push(utils.minifyHtml(loadSnippet(item.template)));

        (Array.isArray(item.position) ? item.position : [item.position])
          .forEach(p => (plugins[p] || (plugins[p] = [])).push(index));
      });

      result.plugins = plugins;
    }

    // override boolean value to html string
    if (result.footer.powered) result.footer.powered = __('footer.powered', '<a href="https://hexo.io" target="_blank" rel="external nofollow noopener">Hexo</a>')
    if (result.footer.theme) result.footer.theme = __('footer.theme') + ' - <a href="https://github.com/ikeq/hexo-theme-inside" target="_blank" rel="external nofollow noopener">Inside</a>'

    // root selector
    this.extend.injector.register('body_begin', `<${feManifest.root}></${feManifest.root}>`);

    result.runtime = {
      styles: feManifest.class,
      hash: utils.md5([
        ...hexo.locals.getters.pages().sort('-date').toArray(),
        ...hexo.locals.getters.posts().sort('-date').toArray()
      ].filter(utils.published).map(i => i.updated.toJSON()).join('')
        + JSON.stringify(result)
        + pkg.version
        , 6),

      // runtime helpers
      hasComments: !!(result.comments || result.plugins && result.plugins.comments),
      hasReward: !!result.reward,
      hasToc: !!result.toc,
      renderReadingTime: (() => {
        const { reading_time } = result.post;
        if (!reading_time) return false;

        let htmlToText = null;
        try {
          htmlToText = require('html-to-text');
        } catch {
          return false;
        }

        const wpm = reading_time.wpm || 150;
        const compile = reading_time.text
          ? o => utils.sprintf(reading_time.text, o)
          : o => __('post.reading_time', o);

        return (content) => {
          const words = utils.countWord(htmlToText.fromString(content, {
            ignoreImage: false,
            ignoreHref: true,
            wordwrap: false
          }));
          return compile({ words, minutes: Math.round(words / wpm) || 1 });
        }
      })(),
      copyright: result.copyright,
      dateHelper: date.bind({
        page: { lang: utils.localeId(site.language, true) },
        config: site
      }),
      uriReplacer: (() => {
        let assetsFn = src => src;
        if (result.assets) {
          const prefix = result.assets.prefix ? result.assets.prefix + '/' : ''
          const suffix = result.assets.suffix || ''
          assetsFn = src => prefix + `${src}${suffix}`.replace(/\/{2,}/g, '/')
        }

        return (src, assetPath) => {
          assetPath = assetPath ? assetPath + '/' : ''

          // skip both external and absolute path
          return /^(\/\/?|http|data\:image)/.test(src) ? src : assetsFn(`${assetPath}${src}`);
        }
      })()
    };

    hexo.theme.config = result;
  });

  /**
   * @param {string} pathOrCode plugin.template or plugin.code
   * @returns {string}
   */
  function loadSnippet(pathOrCode) {
    // simple but enough
    if (/[\n\:]/.test(pathOrCode)) return pathOrCode;

    const templateUrl = path.join(hexo.theme_dir, pathOrCode);
    if (!fs.existsSync(templateUrl)) return pathOrCode;

    return fs.readFileSync(templateUrl, 'utf8');
  }
}
