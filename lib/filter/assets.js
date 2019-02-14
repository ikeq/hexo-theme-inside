const cheerio = require('cheerio');
const trim_slash_regex = /^\/*(.*[^\/])\/*$/;

module.exports = function (post) {
  const assets = this.theme.config.assets;

  if (!assets) return;

  const { prefix, suffix } = assets;

  if (post.thumbnail) {
    const particals = post.thumbnail.split(' ');
    post.thumbnail = replacer(particals[0]);
    if (particals[1] && !post.color)
      post.color = particals[1];
  }

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
