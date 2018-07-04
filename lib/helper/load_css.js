const path = require('path');
const { getAssetsName } = require('../utils');

module.exports = function () {
  return this.css(...getAssetsName(path.join(__dirname, '../../source'), 'css', ['styles']));
}
