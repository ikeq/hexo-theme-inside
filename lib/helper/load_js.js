const path = require('path');
const { getAssetsName } = require('../utils');

module.exports = function () {
  const lang = this.config.language || 'en';

  return this.js(...getAssetsName(path.join(__dirname, '../../source'), 'js', ['runtime', 'polyfills', 'main'])
    .filter(i => !i.match(/^main/) || i.indexOf(`${lang}.js`) !== -1));
}
