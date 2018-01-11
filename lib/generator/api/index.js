let { md5 } = require('../../utils'),
  pagesGenerator = require('./page'),
  postsGenerator = require('./post'),
  tagsGenerator = require('./tag'),
  archivesGenerator = require('./archive'),
  configsGenerator = require('./config');

module.exports = function (locals) {
  let version = { config: {}, page: {}, post: {}, tag: {}, archive: {} },
    chunks = [
      ...pagesGenerator.call(this, locals),
      ...postsGenerator.call(this, locals),
      ...tagsGenerator.call(this, locals),
      ...archivesGenerator.call(this, locals),
      ...configsGenerator.call(this, locals),
    ];

  chunks = chunks.map(item => {
    let dataJson = JSON.stringify(item.data),
      key = md5(dataJson);

    version[item.type][item.index] = key;

    return {
      path: `api/${key}.json`,
      data: dataJson,
    }
  });

  return [
    ...chunks,
    { path: 'api/v.json', data: JSON.stringify(version) },
  ];
};