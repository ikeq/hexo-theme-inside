const { pick, md5, getPagePath } = require('../utils');
const urlFor = require('hexo/lib/plugins/helper/url_for');

module.exports = function (locals) {
  const site = this.config,
    theme = this.theme.config,
    config = Object.assign(
      pick(site, ['title', 'subtitle', 'description', 'author']),
      pick(theme, ['profile', 'menu', 'footer', 'comments', 'post']),
      {
        routes: locals.pages.map(page => getPagePath(page.source)).sort(),
        count: {
          posts: locals.posts.filter(post => post.published).length,
          categories: locals.categories.length,
          // filter unpublished posts
          tags: locals.tags.filter(tag => tag.posts.filter(post => post.published).length).length
        },
        api: urlFor.call(this, 'api'),
        hash: md5(['pages', 'posts'].map(key => locals[key].map(i => i.updated.toJSON()).join('')).join('')),
        locale: this.theme.i18n.get()
      }
    );
  if (theme.sns.email) theme.sns.email = 'mailto:' + theme.sns.email;
  if (theme.sns.feed) theme.sns.feed = urlFor.call(this, theme.sns.feed);
  for (let key in theme.sns) {
    if (theme.sns[key]) (config.sns || (config.sns = [])).push([key, theme.sns[key]]);
  }

  const configStr = JSON.stringify(config);
  theme.hash = md5(configStr);

  return [{
    path: `config.${theme.hash}.js`,
    data: 'window.__inside__=' + configStr + ';'
  }];
};
