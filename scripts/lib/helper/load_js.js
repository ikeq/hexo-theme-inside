const { getAssetsName } = require('../utils'),
  path = require('path');

module.exports = function (...args) {
  let hexo = this;

  return getAssetsName(path.join(hexo.theme_dir, 'source'), 'js', args)
    .map(i => `<script src="${i}"></script>`).join('');
}