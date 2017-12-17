module.exports = function (hexo) {
  // override hexo default page generator
  hexo.extend.generator.register('page', require('./page'));
  hexo.extend.generator.register('api', require('./api'));
};