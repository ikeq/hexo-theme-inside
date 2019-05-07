module.exports = function (hexo) {
  // Remove hexo default generators
  ['index', 'post', 'page', 'archive', 'category', 'tag']
    .forEach(name => delete hexo.extend.generator.store[name]);

  hexo.extend.generator.register('is-config', require('./config'));
  hexo.extend.generator.register('is-theme', require('./theme'));
  hexo.extend.generator.register('is-entries', require('./entries'));
  hexo.extend.generator.register('is-sitemap', require('./sitemap'));
  hexo.extend.generator.register('is-manifest', require('./manifest'));
  hexo.extend.generator.register('is-sw', require('./sw'));
};
