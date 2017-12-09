module.exports = function (hexo) {
  hexo.extend.helper.register('title', require('./title').bind(hexo));
  hexo.extend.helper.register('load_js', require('./load_js').bind(hexo));
  hexo.extend.helper.register('load_css', require('./load_css').bind(hexo));
  hexo.extend.helper.register('ga', require('./ga').bind(hexo));
};
