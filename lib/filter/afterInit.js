const path = require('path');
const fs = require('fs');
const { getAssetsName } = require('../utils');
const langSets = {
  'en': 'en',
  'zh-Hans': 'zh-Hans',
  'zh-Hant': 'zh-Hant',
  'ja': 'ja'
}

module.exports = function () {
  const lang = langSets[Array.isArray(this.config.language) ? this.config.language[0] : this.config.language] || langSets.en;
  let mainScript = {
    default: '',
    locale: ''
  };

  getAssetsName(path.join(this.theme_dir, 'source'), 'js', ['_main']).forEach(i => {
    if (new RegExp(lang + '\.js$').test(i)) mainScript.locale = i;
    if (new RegExp('en\.js$').test(i)) mainScript.default = i;
  });

  if (!mainScript.locale) mainScript.locale = mainScript.default;

  let src = path.join(this.theme_dir, 'source', mainScript.locale);
  let dest = src.replace(new RegExp('_main\.(.*)\.' + lang + '\.js$'), 'main.$1.js');

  fs.createReadStream(src).pipe(fs.createWriteStream(dest));

  // cache it to remove before exit
  this.theme.mainScript = dest;
}