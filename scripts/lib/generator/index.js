module.exports = function (hexo) {
  hexo.extend.generator.register('entry', require('./entry'));
  hexo.extend.generator.register('api', require('./api'));
};