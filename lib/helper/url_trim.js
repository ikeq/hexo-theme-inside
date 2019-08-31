const { trimHtml } = require('../utils')

module.exports = function (url) {
  return url ? trimHtml(url) + '/' : '';
}
