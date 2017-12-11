const { getAssetsName } = require('../utils'),
  path = require('path');

module.exports = function (...args) {
  let hexo = this;

  return getAssetsName(path.join(hexo.theme_dir, 'source'), 'css', args)
    .map(i => `<link href="${i}" rel="stylesheet">`).join('');
}