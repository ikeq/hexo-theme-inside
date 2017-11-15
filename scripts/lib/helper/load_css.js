const { getFiles } = require('../utils');

module.exports = function (...args) {
  return getFiles('css', args).map(i => `<link href="${i}" rel="stylesheet">`).join('');
}