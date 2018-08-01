const utils = require('../utils');
const gravatar = require('hexo/lib/plugins/helper/gravatar');

module.exports = function () {
  if (this.theme.config._inited) return;

  const site = this.config,
    defaults = {
      menu: {},
      profile: {
        avatar: '',
        email: site.email
      },
      sns: {},
      footer: {
        copyright: `&copy;${new Date().getFullYear()} • <a href="${site.url}">${site.author}</a>`,
        powered: true,
        theme: true
      },
      post: {
        per_page: 10,
        toc: {
          depth: 3,
          index: true
        }
      },
      archive: { per_page: 10 },
      tag: { per_page: 10 },
      category: { per_page: 10 },
      favicon: 'favicon.ico',
      comments: {
        disqus: {
          script: '',
          shortname: '',
          autoload: true
        }
      },
      assets: {},
      manifest: {
        short_name: site.title,
        name: site.title,
        start_url: site.root,
        theme_color: '#2a2b33',
        background_color: '#2a2b33',
        icons: [],
        display: 'minimal-ui'
      },
      ga: ''
    },
    theme = utils.extends(defaults, this.theme.config);

  if (theme.sns.email !== undefined) theme.sns.email = theme.sns.email || theme.profile.email;
  if (theme.sns.feed !== undefined) theme.sns.feed = theme.sns.feed || site.feed && site.feed.path;

  if (!theme.profile.avatar && theme.profile.email)
    theme.profile.avatar = gravatar(theme.profile.email, 160);

  if (theme.comments.disqus && theme.comments.disqus.shortname)
    theme.comments.disqus.script = `//${theme.comments.disqus.shortname}.disqus.com/embed.js`;

  // fix invalid merge
  if (!this.theme.config.comments) theme.comments = {}
  else if (!this.theme.config.comments.disqus) theme.comments.disqus = {}

  theme._inited = true;
  this.theme.config = theme;
}
