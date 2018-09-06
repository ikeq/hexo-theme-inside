const cheerio = require('cheerio');
const trim_slash_regex = /^\/*(.*[^\/])\/*$/;

module.exports = function (post) {
  const assets = this.theme.config.assets;

  if (!assets) return;

  const { prefix, suffix } = assets;

  if (post.thumbnail) post.thumbnail = replacer(post.thumbnail);

  const $ = cheerio.load(post.content, { decodeEntities: false });

  $('img').each(function () {
    const img$ = $(this), src = img$.attr('src');
    img$.attr('src', replacer(src))
  })

  post.content = $.html();

  function replacer(str) {
    if (str.match(/^(http|data\:image)/)) return str;
    return str.replace(trim_slash_regex, prefix + '/$1' + suffix);
  }
};
