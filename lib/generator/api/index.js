const { base64Encode } = require('../../utils');

module.exports = function (locals) {
  let chunks = [].concat.apply([],
    ['page', 'post', 'tag', 'category', 'archive']
      .map(item => require('./' + item).call(this, locals))
  );

  chunks = chunks.map(item => {
    // encode twice to ensure there is no slash
    const path = base64Encode(base64Encode(item.type + '/' + item.index)).replace(/=/g, '');

    return {
      path: `api/${path}.json`,
      data: JSON.stringify(item.data),
    }
  });

  return chunks;
};