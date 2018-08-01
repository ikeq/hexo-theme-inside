module.exports = function (hexo) {
  hexo.extend.filter.register('before_generate', require('./config'));
  hexo.extend.filter.register('before_post_render', require('./assets'));
  hexo.extend.filter.register('after_post_render', require('./bounded'));
  hexo.extend.filter.register('template_locals', require('./templates'));
};
