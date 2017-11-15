const { pick } = require('../../utils'),
  siteConfigProps = ['title', 'subtitle', 'description', 'author', 'language', 'timezone', 'url', 'root', 'feed'];

module.exports = function (locals) {
  return [{
    path: 'api/config.json',
    data: JSON.stringify({
      site: pick(hexo.config, siteConfigProps),
      theme: hexo.theme.config
    })
  }]
};