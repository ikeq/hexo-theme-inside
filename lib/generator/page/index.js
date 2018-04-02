module.exports = function (locals) {
  let chunks = [].concat.apply([],
    ['page', 'tag', 'category', 'archive']
      .map(item => require('./' + item).call(this, locals))
  );

  return chunks;
};