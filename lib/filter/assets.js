const assets_regex = /(!?\[[\w\.-]*\]\()([^\)]*)/g, // ![text](url)
  trim_slash_regex = /^\/*(.*[^\/])\/*$/;

module.exports = function (post) {
  if (!this.theme.config.assets) require('./config').call(this);

  const rule = this.theme.config.assets,
    { prefix, suffix } = rule;

  if (!prefix && !suffix) return;

  if (post.thumbnail) post.thumbnail = replacer(post.thumbnail);

  post.content = post.content.replace(assets_regex, (match, $1, $2) => $1 + replacer($2));

  function replacer(str) {
    if (str.match(/^(http|data\:image)/)) return str;
    return str.replace(trim_slash_regex, prefix + '/$1' + suffix);
  }
};
