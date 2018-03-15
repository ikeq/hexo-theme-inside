const { pick } = require('../../utils');
const { site: siteConfigProps, theme: themeConfigProps } = require('./properties');

module.exports = function (locals) {
  return [{
    index: '_',
    type: 'config',
    data: {
      site: pick(this.config, siteConfigProps),
      theme: pick(this.theme.config, themeConfigProps)
    }
  }];
};