const utils = require('./utils');
const gravatar = require('hexo/lib/plugins/helper/gravatar');
const urlFor = require('hexo/lib/plugins/helper/url_for');
const configSchema = require('./configSchema.json');

module.exports = function (hexo) {
  hexo.on('generateBefore', function () {
    const locals = hexo.locals.toObject();
    const site = hexo.config;
    const theme = hexo.theme.config;
    const email = theme.profile && theme.profile.email || site.email;
    const result = utils.validateSchema(configSchema, theme, {
      $email: email,
      $feed: site.feed ? urlFor.call(this, site.feed.path) : '',
      $copyright: `&copy;${new Date().getFullYear()} • <a href="${site.url}">${site.author}</a>`,
      $gravatar: gravatar(email, 160),
      $title: site.title,
      $description: site.description
    });

    // attach disqus script if available
    if (result.comments.disqus) {
      if (result.comments.disqus.shortname && !result.comments.disqus.script) result.comments.disqus.script = `//${result.comments.disqus.shortname}.disqus.com/embed.js`;
      else result.comments.disqus = false;
    }

    if (result.pwa.workbox) {
      result.pwa.workbox.name = urlFor.call(this, result.pwa.workbox.name);
    }

    result.theme.api_prefix = urlFor.call(this, result.theme.api_prefix).replace(/\/*$/, '');

    result.runtime = {
      buildHash: utils.md5(
        ['pages', 'posts'].map(key => locals[key].sort('-date').filter(i => i.published !== false).map(i => i.updated.toJSON()).join('')).join(''),
        6
      )
    };

    hexo.theme.config = result;
  });
}
