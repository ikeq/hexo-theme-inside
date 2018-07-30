module.exports = function (hexo) {
  // Overrides Hexo default generators
  hexo.extend.generator.register('index', none);
  hexo.extend.generator.register('post', none);
  hexo.extend.generator.register('page', none);
  hexo.extend.generator.register('archive', none);
  hexo.extend.generator.register('category', none);
  hexo.extend.generator.register('tag', none);

  hexo.extend.generator.register('is-config', require('./config'));
  hexo.extend.generator.register('is-entries', require('./entries'));
  hexo.extend.generator.register('is-sitemap', require('./sitemap'));
  hexo.extend.generator.register('is-manifest', require('./manifest'));

  function none() {}
};
