module.exports = function (hexo) {
  hexo.extend.tag.register('snippet', require('./snippet'), true);
  hexo.extend.tag.register('gist', require('./gist'));
  hexo.extend.tag.register('canvas', require('./canvas'), true);
};
