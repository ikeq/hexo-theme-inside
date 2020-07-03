module.exports = function (hexo) {
  hexo.extend.filter.register('after_post_render', require('./post'));
  hexo.extend.filter.register('template_locals', require('./templates'));
  hexo.extend.filter.register('before_exit', require('./ssr'));
};
