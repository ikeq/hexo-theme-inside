let tags = require('./tag'),
  config = require('./config'),
  page = require('./page'),
  archives = require('./archives'),
  post = require('./post');

module.exports = function (locals) {
  return [
    ...tags(locals),
    ...config(locals),
    ...page(locals),
    ...post(locals),
    ...archives(locals),
  ];
};