let tags = require('./tag'),
  config = require('./config'),
  page = require('./page'),
  archives = require('./archives'),
  post = require('./post');

module.exports = function (locals) {
  let hexo = this;

  return [
    ...tags.call(hexo, locals),
    ...config.call(hexo, locals),
    ...page.call(hexo, locals),
    ...post.call(hexo, locals),
    ...archives.call(hexo, locals),
  ];
};