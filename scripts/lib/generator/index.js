module.exports = function (hexo) {
  hexo.extend.generator.register('entry', require('./entry').bind(hexo));
  hexo.extend.generator.register('api', require('./api').bind(hexo));
};