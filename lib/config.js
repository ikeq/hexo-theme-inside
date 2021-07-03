const fs = require('fs');
const path = require('path');
const gravatar = require('hexo/lib/plugins/helper/gravatar');
const { date } = require('hexo/lib/plugins/helper/date');
const urlFor = require('hexo/lib/plugins/helper/url_for');
const utils = require('./utils');
const pkg = require('../package.json');
const configSchema = require('./configSchema.json');
const manifest = require('../source/_manifest.json');
const { css } = require(`../source/${manifest.theme}`);

module.exports = function (hexo) {
  const js = hexo.extend.helper.get('js').bind(hexo);
  const pluginManifest = loadManifest([path.join(hexo.theme_dir, 'lib/plugins')]);

  hexo.on('generateBefore', function () {
    const site = hexo.config;
    const theme = Object.assign(hexo.theme.config || {}, site.theme_config);
    const email = (theme.profile && theme.profile.email) || site.email || '';
    const feed = site.feed ? urlFor.call(hexo, site.feed.path) : '';
    const result = utils.parseConfig(configSchema, theme, {
      $email: email,
      $feed: feed,
      $copyright: `&copy; ${new Date().getFullYear()} • <a href="${site.url}">${site.author}</a>`,
      $gravatar: gravatar(email, 160),
      $title: site.title,
      $description: site.description,
    });

    // override default language
    site.language = utils.localeId(site.language);

    const __ = hexo.theme.i18n.__(site.language);

    if (!result.data_prefix) result.data_prefix = result.data_dir;

    // convert menu to array
    if (result.menu) {
      result.menu = Object.keys(result.menu).map((k) => {
        const item = [k, result.menu[k]];
        if (utils.isExternal(item[1])) item.push(1);
        return item;
      });
    }

    // sns
    if (result.sns) {
      const sns = Array.isArray(result.sns)
        ? result.sns
        : (() => {
            const ret = [];
            // keep key order
            for (let key in result.sns) {
              ret.push({
                icon: utils.escapeIdentifier(key),
                title: key,
                url: result.sns[key],
              });
            }
            return ret;
          })();

      result.sns = sns.reduce((ret, i) => {
        if (i.icon) {
          if (i.icon === 'email') {
            i.url = `mailto:${i.url || email}`;
          } else if (i.icon === 'feed') {
            i.url = i.url || feed;
          }
          if (i.url) {
            i.template = `<i class="iκ-${i.icon}"></i>`;
          }
        }

        if (i.template) {
          ret.push([i.title || '', i.url || '', i.template]);
        }
        return ret;
      }, []);
    }

    // theme vars
    hexo.extend.injector.register('head_end', `<style is="theme">${css(utils.flattenObject(result.appearance))}</style>`);
    // theme.js
    hexo.extend.injector.register('head_end', `<script src="${urlFor.call(hexo, manifest.theme)}"></script>`);

    // disqus
    if (result.comments && result.comments.disqus) {
      result.plugins.push(...execPlugin('disqus', result.comments.disqus));
    }

    {
      const entries = [
        // plugins comes first to ensure that their libs is ready when executing dynamic code.
        ...result.plugins,
        ...manifest.styles,
        ...manifest.scripts,
      ];
      const injectorPoints = ['head_begin', 'head_end', 'body_begin', 'body_end'];
      const positionedPlugins = { $t: [] };

      if (result.appearance.font && result.appearance.font.url) {
        entries.unshift({
          position: 'head_end',
          template: `<link href="${result.appearance.font.url}" rel="stylesheet"></link>`,
        });
      }

      process();

      result.plugins = positionedPlugins;

      function process() {
        let item = entries.shift();

        if (!item) return;

        if (typeof item === 'string') {
          // Direct with url
          if (!pluginManifest[item]) {
            const ext = path.extname(item);
            const src = urlFor.call(hexo, item);
            if (ext === '.css') {
              item = `<link href="${src}" rel="stylesheet">`;
            } else if (ext === '.js') {
              item = `<script src="${src}"></script>`;
            } else return process();

            hexo.extend.injector.register(injectorPoints[ext === '.css' ? 1 : 3], item);
            return process();
          }

          // Built in plugins without options
          item = { [item]: {} };
        }

        if (item.position && injectorPoints.includes(item.position)) {
          hexo.extend.injector.register(item.position, item.template);
          return process();
        }

        // Built in plugins
        const executed = execPlugin(Object.keys(item)[0], Object.values(item)[0]);
        if (executed) {
          if (executed.length) entries.unshift(...executed);
          return process();
        }

        /**
         * Positioned plugins, go last
         * convert into the following format
         * {
         *   $t: ['0', '1', '2', '3'],
         *   sidebar: [indexes],
         *   post: [indexes],
         *   page: [indexes],
         *   comments: [indexes]
         * }
         */
        const index = positionedPlugins.$t.length;
        positionedPlugins.$t.push(utils.minifyHtml(loadSnippet(item.template)));

        (Array.isArray(item.position) ? item.position : [item.position]).forEach((p) =>
          (positionedPlugins[p] || (positionedPlugins[p] = [])).push(index)
        );

        process();
      }
    }

    // override boolean value to html string
    if (result.footer.powered)
      result.footer.powered = __(
        'footer.powered',
        '<a href="https://hexo.io" target="_blank" rel="external nofollow noopener">Hexo</a>'
      );
    if (result.footer.theme)
      result.footer.theme =
        __('footer.theme') +
        ' - <a href="https://github.com/ikeq/hexo-theme-inside" target="_blank" rel="external nofollow noopener">Inside</a>';

    // root selector
    hexo.extend.injector.register('body_begin', `<${manifest.root}></${manifest.root}>`);

    result.runtime = {
      styles: manifest.class,
      hash: utils.md5(
        [...hexo.locals.getters.pages().sort('-date').toArray(), ...hexo.locals.getters.posts().sort('-date').toArray()]
          .filter(utils.published)
          .map((i) => i.updated.toJSON())
          .join('') +
          JSON.stringify(result) +
          pkg.version,
        6
      ),

      // runtime helpers
      hasComments: !!(result.comments || (result.plugins && result.plugins.comments)),
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
          ? (o) => utils.sprintf(reading_time.text, o)
          : (o) => __('post.reading_time', o);

        return (content) => {
          const words = utils.countWord(
            htmlToText.fromString(content, {
              ignoreImage: false,
              ignoreHref: true,
              wordwrap: false,
            })
          );
          return compile({ words, minutes: Math.round(words / wpm) || 1 });
        };
      })(),
      copyright: result.copyright,
      dateHelper: date.bind({
        page: { lang: utils.localeId(site.language, true) },
        config: site,
      }),
      uriReplacer: (() => {
        let assetsFn = (src) => src;
        if (result.assets) {
          const prefix = result.assets.prefix ? result.assets.prefix + '/' : '';
          const suffix = result.assets.suffix || '';
          assetsFn = (src) => prefix + `${src}${suffix}`.replace(/\/{2,}/g, '/');
        }

        return (src, assetPath) => {
          assetPath = assetPath ? assetPath + '/' : '';

          // skip both external and absolute path
          return /^(\/\/?|http|data\:image)/.test(src) ? src : assetsFn(`${assetPath}${src}`);
        };
      })(),
    };

    hexo.theme.config = result;

    /**
     * @param {string} name built-in plugin name
     * @param {*} options plugin options
     * @returns {any[]} return a plugin list
     */
    function execPlugin(name, options) {
      if (!pluginManifest[name]) return;

      const plugin = require(pluginManifest[name]);
      const res = plugin.exec(hexo, utils.parseConfig(plugin.schema, options), {
        md5: utils.md5,
        i18n: (template) =>
          template.replace(/{{([\.a-zA-Z0-9_\| ]+)}}/g, (_, $1) => {
            const [key, t] = $1.split('|').map((i) => i.trim());
            const payload = t.split(',');
            return __(
              key,
              t.includes(':')
                ? payload.reduce((map, i) => {
                    const [k, v] = i.split(':');
                    return {
                      ...map,
                      [k.trim()]: v.trim() || true,
                    };
                  }, {})
                : payload
            );
          }),
        js,
      });

      return Array.isArray(res) ? res : [];
    }
  });

  /**
   * @param {string} pathOrCode plugin.template or plugin.code
   * @returns {string}
   */
  function loadSnippet(pathOrCode) {
    // simple but enough
    if (/[\n\:]/.test(pathOrCode)) return pathOrCode;

    const templateUrl = path.join(hexo.base_dir, pathOrCode);
    if (!fs.existsSync(templateUrl)) return pathOrCode;

    return fs.readFileSync(templateUrl, 'utf8');
  }
};

function loadManifest(includePaths = []) {
  return Object.assign({}, ...includePaths.map(load));

  function load(dir) {
    let map = {};
    try {
      const manifestPath = path.join(dir, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        map = require(manifestPath) || {};
      }
    } catch {
      return map;
    }

    return Object.keys(map).reduce((prefixMap, name) => {
      return {
        ...prefixMap,
        [name]: path.join(dir, map[name]),
      };
    }, {});
  }
}
