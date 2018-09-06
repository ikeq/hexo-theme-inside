const path = require('path');
const fs = require('fs');
const { getAssetsName } = require('../utils');
const sources = fs.readdirSync(path.join(__dirname, '../../source'));

module.exports = function (type, cdn) {
  const lang = this.config.language || 'en';
  const pathFn = cdn ? a => cdn + '/' + a : this.url_for.bind(this);

  if (type === 'css') {
    return css(getAssetsName(sources, 'css', ['styles']), pathFn)
  } else if (type === 'js') {
    return js(
      getAssetsName(sources, 'js', ['runtime', 'polyfills', 'main'])
        .filter(i => !i.match(/^main/) || i.indexOf(`${lang}.js`) !== -1),
        pathFn
    )
  }
}

function css(arr, fn) {
  return arr.map(s => `<link rel="stylesheet" href="${fn(s)}">`).join('\n')
}

function js(arr, fn) {
  return arr.map(s => `<script src="${fn(s)}"></script>`).join('\n')
}
