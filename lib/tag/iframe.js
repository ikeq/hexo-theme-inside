const { htmlTag } = require('../utils');

module.exports = function ([src, width = '100%', height = 300]) {
  return htmlTag('iframe', {
    width,
    height,
    src,
    frameborder: '0',
  });
};
