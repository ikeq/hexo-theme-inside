const path = require('path');
const { getAssetsName } = require('../utils');

module.exports = function () {
  return getAssetsName(path.join(__dirname, '../../source'), 'js', ['inline', 'polyfills', 'main'])
    .map(i => `<script src="${i}"></script>`).join('');
}