const { getAssetsName } = require('../utils');
const path = require('path');

module.exports = function () {
  return getAssetsName(path.join(__dirname, '../../source'), 'css', ['styles'])
    .map(i => `<link href="${i}" rel="stylesheet">`).join('');
}