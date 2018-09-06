module.exports = function (url) {
  if (!url) return '';

  return url.replace(/index.html$/, '');
}
