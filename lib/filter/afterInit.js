const path = require('path');
const fs = require('fs');
const { getAssetsName } = require('../utils');

module.exports = function () {
  const language = this.config.language;
  let mainScript = {
    default: '',
    locale: ''
  };

  getAssetsName(path.join(this.theme_dir, 'source'), 'js', ['_main']).forEach(i => {
    if (new RegExp(language + '\.js$').test(i)) mainScript.locale = i;
    if (new RegExp('en\.js$').test(i)) mainScript.default = i;
  });

  if (!mainScript.locale) mainScript.locale = mainScript.default;

  let src = path.join(this.theme_dir, 'source', mainScript.locale);
  let dest = src.replace(new RegExp('_main\.(.*)\.' + language + '\.js$'), 'main.$1.js');

  // cache it to remove before exit
  this.theme.mainScript = dest;
  fs.createReadStream(src).pipe(fs.createWriteStream(dest));
}