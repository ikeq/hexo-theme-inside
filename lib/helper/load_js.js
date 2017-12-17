const { getAssetsName } = require('../utils'),
  path = require('path');

module.exports = function (...args) {
  return getAssetsName(path.join(__dirname, '../../source'), 'js', args)
    .map(i => `<script src="${i}"></script>`).join('');
}