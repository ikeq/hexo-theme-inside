const { getFiles } = require('../utils');

module.exports = function (...args) {
  return getFiles.apply(this, ['js', args]).map(i => `<script src="${i}"></script>`).join('');
}