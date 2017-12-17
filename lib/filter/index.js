module.exports = function (hexo) {
  hexo.extend.filter.register('before_post_render', require('./assets'));
};