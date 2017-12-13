module.exports = function (hexo) {
  // override hexo default page generator
  hexo.extend.generator.register('page', require('./page').bind(hexo));
  hexo.extend.generator.register('api', require('./api').bind(hexo));
};