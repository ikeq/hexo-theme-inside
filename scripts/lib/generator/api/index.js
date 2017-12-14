let tags = require('./tag'),
  config = require('./config'),
  page = require('./page'),
  archives = require('./archives'),
  post = require('./post');

module.exports = function (locals) {
  return [
    ...tags.call(this, locals),
    ...config.call(this, locals),
    ...page.call(this, locals),
    ...post.call(this, locals),
    ...archives.call(this, locals),
  ];
};