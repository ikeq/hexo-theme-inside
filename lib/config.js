const utils = require('./utils');
const gravatar = require('hexo/lib/plugins/helper/gravatar');
const cheerio = require('cheerio');
const urlFor = require('hexo/lib/plugins/helper/url_for');
const pkg = require('../package.json');
const configSchema = require('./configSchema.json');

module.exports = function (hexo) {
  hexo.on('generateBefore', function () {
    const site = hexo.config;
    const theme = hexo.theme.config;
    const __ = this.theme.i18n.__();
    const email = theme.profile && theme.profile.email || site.email || '';
    const result = utils.validateSchema(configSchema, theme, {
      $email: email,
      $feed: site.feed ? urlFor.call(this, site.feed.path) : '',
      $copyright: `&copy;${new Date().getFullYear()} • <a href="${site.url}">${site.author}</a>`,
      $gravatar: gravatar(email, 160),
      $title: site.title,
      $description: site.description
    });

    if (!result.data_prefix) result.data_prefix = result.data_dir;

    // comments: {} | undefined
    if (result.comments.disqus) {
      const shortname = result.comments.disqus.shortname;
      delete result.comments.disqus.shortname;
      // attach disqus script
      if (!result.comments.disqus.script) result.comments.disqus.script = `//${shortname}.disqus.com/embed.js`;
      else delete result.comments.disqus;
    } else if (!result.comments.livere) {
      delete result.comments;
    }

    // reward: {} | undefined
    if (result.reward.methods)
      result.reward.methods = result.reward.methods.filter(i => i.qrcode || i.url);
    if (!result.reward.methods.length) delete result.reward;

    const sns = [];
    if (result.sns.email) result.sns.email = 'mailto:' + result.sns.email;
    else delete result.sns.email;
    for (let key in result.sns) {
      if (result.sns[key]) sns.push([utils.escapeIdentifier(key), result.sns[key]]);
    }
    if (sns.length) result.sns = sns;
    else delete result.sns;

    /**
     * convert plugins into the following format
     *
     * {
     *   $t: ['0', '1', '2', '3'],
     *   sidebar: [indexes],
     *   post: [indexes],
     *   page: [indexes],
     *   comments: [indexes]
     * }
     */
    if (result.plugins) {
      const plugins = { $t: [] };
      let minify;
      try {
        const htmlMinify = require('html-minifier').minify;
        minify = html => htmlMinify(html, {
          minifyCSS: true,
          collapseWhitespace: true,
          removeEmptyAttributes: true,
          removeComments: true
        });
      } catch (e) {
        minify = o => o;
      }
      result.plugins.forEach(plugin => {
        const $ = cheerio.load(plugin.template, { decodeEntities: false });
        const index = plugins.$t.length;

        $.root().children('script').each(function () {
          const $script = $(this),
            html = $script.html();

          if (html) $script.replaceWith(utils.snippet(html));
        });
        plugins.$t.push(minify($.html()));

        (Array.isArray(plugin.position) ? plugin.position : [plugin.position]).forEach(p => (plugins[p] || (plugins[p] = [])).push(index));
      });

      result.plugins = plugins;
    }

    result.runtime = {
      hash: utils.md5([
        ...hexo.locals.getters.pages().sort('-date').toArray(),
        ...hexo.locals.getters.posts().sort('-date').toArray().filter(i => i.published !== false)
      ].map(i => i.updated.toJSON()).join('')
        + JSON.stringify(result)
        + pkg.version
        , 6)
    };

    // override boolean value to html string
    if (result.footer.powered) result.footer.powered = __('footer.powered', '<a href="https://hexo.io" target="=_blank" rel="external nofollow noopener">Hexo</a>')
    if (result.footer.theme) result.footer.theme = __('footer.theme') + ' - <a href="https://github.com/elmorec/hexo-theme-inside" target="=_blank" rel="external nofollow noopener">Inside</a>'

    hexo.theme.config = result;
  });
}
