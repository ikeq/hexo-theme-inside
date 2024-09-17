module.exports = function (hexo) {
  hexo.extend.tag.register('gist', require('./gist'));
  hexo.extend.tag.register('iframe', require('./iframe'));
  hexo.extend.tag.register('canvas', require('./canvas'), true);
};
