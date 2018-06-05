module.exports = function (hexo) {
  hexo.theme.processors.push(require('./localized-script')(hexo));
};
