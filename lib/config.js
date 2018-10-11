const utils = require('./utils');
const gravatar = require('hexo/lib/plugins/helper/gravatar');
const urlFor = require('hexo/lib/plugins/helper/url_for');
const pkg = require('../package.json');
const configSchema = require('./configSchema.json');

module.exports = function (hexo) {
  hexo.on('generateBefore', function () {
    const site = hexo.config;
    const theme = hexo.theme.config;
    const __ = this.theme.i18n.__();
    const email = theme.profile && theme.profile.email || site.email;
    const result = utils.validateSchema(configSchema, theme, {
      $email: email,
      $feed: site.feed ? urlFor.call(this, site.feed.path) : '',
      $copyright: `&copy;${new Date().getFullYear()} • <a href="${site.url}">${site.author}</a>`,
      $gravatar: gravatar(email, 160),
      $title: site.title,
      $description: site.description
    });

    // comments: {} | false
    // attach disqus
    if (result.comments.disqus) {
      const shortname = result.comments.disqus.shortname;
      delete result.comments.disqus.shortname;
      if (!result.comments.disqus.script) result.comments.disqus.script = `//${shortname}.disqus.com/embed.js`;
      else delete result.comments.disqus;
    } else if (!result.comments.livere) {
      result.comments = false;
    }

    if (result.reward.methods) {
      result.reward.methods = result.reward.methods.filter(i => i.qrcode || i.url);
      if (!result.reward.methods.length) delete result.reward;
    }

    result.theme.api_prefix = urlFor.call(this, result.theme.api_prefix).replace(/\/*$/, '');

    result.runtime = {
      hash: utils.md5([
        ...hexo.locals.getters.pages().sort('-date').toArray(),
        ...hexo.locals.getters.posts().sort('-date').toArray().filter(i => i.published !== false)
      ].map(i => i.updated.toJSON()).join('') + pkg.version, 6)
    };

    // override boolean value to html
    if (result.footer.powered) result.footer.powered = __('footer.powered', '<a href="https://hexo.io" target="=_blank" rel="external nofollow noopener">Hexo</a>')
    if (result.footer.theme) result.footer.theme =  __('footer.theme') + ' - <a href="https://github.com/elmorec/hexo-theme-inside" target="=_blank" rel="external nofollow noopener">Inside</a>'

    hexo.theme.config = result;
  });
}
