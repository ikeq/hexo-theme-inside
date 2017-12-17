const { getAssetsName } = require('../utils'),
  path = require('path');

module.exports = function (...args) {
  return getAssetsName(path.join(__dirname, '../../source'), 'css', args)
    .map(i => `<link href="${i}" rel="stylesheet">`).join('');
}