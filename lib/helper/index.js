module.exports = function (hexo) {
  hexo.extend.helper.register('url_trim', require('./url_trim'));
  hexo.extend.helper.register('structured_data', require('./structured_data'));
  hexo.extend.helper.register('ga', require('./ga'));
};
