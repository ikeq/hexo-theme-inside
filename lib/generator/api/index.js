const { base64Encode } = require('../../utils');

module.exports = function (locals) {
  let chunks = [].concat.apply([],
    ['page', 'post', 'tag', 'category', 'archive']
      .map(item => require('./' + item).call(this, locals))
  );

  chunks = chunks.map(item => {
    const path = base64Encode(item.type + (item.index ? ('/' + item.index) : '')).replace(/=/g, '');

    return {
      path: `api/${path}.json`,
      data: JSON.stringify(item.data),
    }
  });

  return chunks;
};
