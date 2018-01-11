const ASSETS_REGEXP = /(!?\[[\w\.-]*\]\()([^\)]*)/g, // ![text](url)
  TRIM_SLASH_REGEXP = /^\/*(.*[^\/])\/*$/;

module.exports = function (post) {
  let rule = this.theme.config.assets || {},
    { prefix, suffix } = rule;

  if (!prefix && !suffix) return;

  if (post.thumbnail) post.thumbnail = replacer(post.thumbnail);

  post.content = post.content.replace(ASSETS_REGEXP, (match, $1, $2) => $1 + replacer($2));

  function replacer(str) {
    if (str.match(/^(http|data\:image)/)) return str;
    return str.replace(TRIM_SLASH_REGEXP, prefix + '/$1' + suffix);
  }
};
