const { getFiles } = require('../utils');

module.exports = function (...args) {
  return getFiles.apply(this, ['css', args]).map(i => `<link href="${i}" rel="stylesheet">`).join('');
}