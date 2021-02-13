const fs = require('fs');
const path = require('path');
const gravatar = require('hexo/lib/plugins/helper/gravatar');
const { date } = require('hexo/lib/plugins/helper/date');
const urlFor = require('hexo/lib/plugins/helper/url_for');
const utils = require('./utils');
const pkg = require('../package.json');
const configSchema = require('./configSchema.json');
const feManifest = require('../source/_manifest.json');
const { css } = require('../source/_theme.js');

module.exports = function (hexo) {
  hexo.on('generateBefore', function () {
    const site = hexo.config;
    const theme = Object.assign(hexo.theme.config || {}, site.theme_config);
    const email = (theme.profile && theme.profile.email) || site.email || '';
    const feed = site.feed ? urlFor.call(this, site.feed.path) : '';
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
                url: result.sns[key]
              });
            }
            return ret;
          })();

      result.sns = sns.reduce((ret, i) => {
        if (i.icon) {
          if (i.icon === 'email') {
            i.url = `mailto:${i.url || email}`;
          }
          else if (i.icon === 'feed') {
            i.url = i.url || feed;
          }
          if (i.url) {
            i.template = `<i class="icon-${i.icon}"></i>`;
          }
        }

        if (i.template) {
          ret.push([i.title || '', i.url || '', i.template]);
        }
        return ret;
      }, []);
    }

    // theme vars
    this.extend.injector.register('head_end', `<style is="theme">${css(result.appearance)}</style>`);

    {
      const entries = [
        // plugins comes first to ensure that their libs is ready when executing dynamic code.
        ...result.plugins,
        ...feManifest.styles,
        ...feManifest.scripts,
      ];
      const pluginManifest = loadManifest(this, ['themes/inside/lib/plugins']);
      const injectorPoints = ['head_begin', 'head_end', 'body_begin', 'body_end'];
      const positionedPlugins = { $t: [] };

      if (result.appearance.font && result.appearance.font.url) {
        entries.unshift({
          position: 'head_end',
          template: `<link href="${result.appearance.font.url}" rel="stylesheet"></link>`,
        });
      }

      entries.forEach((item) => {
        if (typeof item === 'string') {
          // Direct with url
          if (!pluginManifest[item]) {
            const ext = path.extname(item);
            if (ext === '.css') {
              item = `<link href="${item}" rel="stylesheet">`;
            } else if (ext === '.js') {
              item = `<script src="${item}"></script>`;
            } else return;

            this.extend.injector.register(injectorPoints[ext === '.css' ? 1 : 3], item);
            return;
          }

          // Built in plugins without options (syntax sugar)
          item = { [item]: {} };
        }

        // Hexo injector, see https://hexo.io/api/injector
        if (item.position && injectorPoints.includes(item.position)) {
          this.extend.injector.register(item.position, item.template);
          return;
        }

        // Built in plugins
        const pluginName = Object.keys(item)[0];
        if (pluginManifest[pluginName]) {
          const plugin = require(pluginManifest[pluginName]);
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
        const index = positionedPlugins.$t.length;
        positionedPlugins.$t.push(utils.minifyHtml(loadSnippet(item.template)));

        (Array.isArray(item.position) ? item.position : [item.position]).forEach((p) =>
          (positionedPlugins[p] || (positionedPlugins[p] = [])).push(index)
        );
      });

      result.plugins = positionedPlugins;
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
    this.extend.injector.register('body_begin', `<${feManifest.root}></${feManifest.root}>`);

    result.runtime = {
      styles: feManifest.class,
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

function loadManifest(hexo, includePaths = []) {
  const { base_dir } = hexo;
  return Object.assign({}, ...includePaths.map((i) => path.join(base_dir, i)).map(load));

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
