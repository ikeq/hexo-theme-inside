const utils = require('./utils');
const gravatar = require('hexo/lib/plugins/helper/gravatar');

module.exports = function (hexo) {
  hexo.on('generateBefore', function () {
    const site = hexo.config;
    const defaults = {
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
      theme: {
        background: 'data:image/png;base64,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',
        sidebar_background: 'shattered-island.png',
        content_width: 640
      },
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
    };
    const theme = utils.extends(defaults, this.theme.config);

    if (theme.sns.email !== undefined) theme.sns.email = theme.sns.email || theme.profile.email;
    if (theme.sns.feed !== undefined) theme.sns.feed = theme.sns.feed || site.feed && site.feed.path;

    if (!theme.profile.avatar && theme.profile.email)
      theme.profile.avatar = gravatar(theme.profile.email, 160);

    if (theme.comments.disqus && theme.comments.disqus.shortname)
      theme.comments.disqus.script = `//${theme.comments.disqus.shortname}.disqus.com/embed.js`;

    if (!this.theme.config.comments) theme.comments = {}
    else if (!this.theme.config.comments.disqus) theme.comments.disqus = {}

    hexo.theme.config = theme;
  });
}
