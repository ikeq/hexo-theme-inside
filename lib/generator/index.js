module.exports = function (hexo) {
  hexo.extend.generator.register('page', require('./page'));
  hexo.extend.generator.register('api', require('./api'));
};