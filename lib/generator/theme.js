const { md5 } = require('../utils');
const generateTheme = require('../../source/_theme.js').default;

module.exports = function () {
  const theme = this.theme.config;
  const data = generateTheme(theme.appearance);

  theme.runtime.themeHash = md5(data);

  return [{
    path: `theme.${theme.runtime.themeHash}.css`,
    data
  }];
};
