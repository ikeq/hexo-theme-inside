module.exports = function (locals) {
  const i18n = this.theme.i18n.__();
  let chunks = [].concat.apply([],
    ['page', 'tag', 'category', 'archive']
      .map(item => require('./' + item).call(this, locals, { i18n: i18n }))
  );

  return chunks;
};