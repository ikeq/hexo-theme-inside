module.exports = function (hexo) {
  hexo.extend.generator.register('config', require('./config'));
  hexo.extend.generator.register('page', require('./page'));
  hexo.extend.generator.register('api', require('./api'));
  hexo.extend.generator.register('sitemap', require('./sitemap'));
  hexo.extend.generator.register('manifest', require('./manifest'));
};
