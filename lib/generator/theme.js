const { md5 } = require('../utils');
const { css: generateTheme } = require('../../source/_theme.js');

module.exports = function () {
  const css = this.extend.helper.get('css').bind(this);
  const theme = this.theme.config;
  const data = generateTheme(theme.appearance);

  const path = `theme.${md5(data)}.css`;
  this.extend.injector.register('head_end', css(path).replace('>', ' is="theme">'));

  return [{
    path,
    data
  }];
};
