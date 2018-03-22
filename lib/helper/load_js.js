const { getAssetsName } = require('../utils');
const path = require('path');
const mainRegex = '_main';
const scripts = ['inline', 'polyfills', '_main'];

module.exports = function () {
  const locale = this.theme.language;
  return getAssetsName(path.join(__dirname, '../../source'), 'js', scripts)
    .filter(script => !script.match(mainRegex) || script.match(locale + '.js'))
    .map(i => {
      if (i.match(mainRegex)) i = i.replace(mainRegex, 'main').replace('.' + locale, '');

      return `<script src="${i}"></script>`;
    }).join('');
}