const { pick } = require('../../utils'),
  siteConfigProps = ['title', 'subtitle', 'description', 'author', 'language', 'timezone', 'url', 'root', 'feed'];

module.exports = function (locals) {
  return [{
    index: '_',
    type: 'config',
    data: {
      site: pick(this.config, siteConfigProps),
      theme: this.theme.config || {}
    }
  }];
};