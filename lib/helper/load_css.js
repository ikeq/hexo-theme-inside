const path = require('path');
const { getAssetsName } = require('../utils');

module.exports = function () {
  return getAssetsName(path.join(__dirname, '../../source'), 'css', ['styles'])
    .map(i => `<link href="${i}" rel="stylesheet">`).join('');
}