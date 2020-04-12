const { md5 } = require('../utils');
const { css } = require('../../source/_theme.js');

module.exports = function () {
  const theme = this.theme.config;
  const data = css(theme.appearance);

  theme.runtime.themeHash = md5(data);

  return [{
    path: `theme.${theme.runtime.themeHash}.css`,
    data
  }];
};
