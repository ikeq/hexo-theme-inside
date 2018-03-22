module.exports = function (hexo) {
  hexo.extend.filter.register('after_init', require('./afterInit'));
  hexo.extend.filter.register('before_post_render', require('./assets'));
  hexo.extend.filter.register('before_exit', require('./beforeExit'));
  hexo.extend.filter.register('template_locals', require('./templateLocals'));
};