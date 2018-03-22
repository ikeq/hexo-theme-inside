const { pick, md5 } = require('../utils');
const { site: siteConfigProps, theme: themeConfigProps } = require('./api/properties');

module.exports = function (locals) {
  const config = 'window.__inside__=' + JSON.stringify({
    site: pick(this.config, siteConfigProps),
    theme: pick(this.theme.config, themeConfigProps),
    locale: this.theme.i18n.get(),
    hash: md5(String(Date.now()))
  }) + ';';
  const script = `config.${md5(config)}.js`;

  this.theme.configScript = script;

  return [{
    path: script,
    data: config
  }];
};