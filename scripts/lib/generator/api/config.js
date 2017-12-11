const { pick } = require('../../utils'),
  siteConfigProps = ['title', 'subtitle', 'description', 'author', 'language', 'timezone', 'url', 'root', 'feed'];

module.exports = function (locals) {
  let hexo = this;

  return [{
    path: 'api/config.json',
    data: JSON.stringify({
      site: pick(this.config, siteConfigProps),
      theme: hexo.theme.config || {}
    })
  }]
};