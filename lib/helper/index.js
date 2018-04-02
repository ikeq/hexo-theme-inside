module.exports = function (hexo) {
  hexo.extend.helper.register('load_js', require('./load_js'));
  hexo.extend.helper.register('load_css', require('./load_css'));
  hexo.extend.helper.register('ga', require('./ga'));
};
