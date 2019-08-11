const { localeId } = require('../utils');
const Pattern = require('hexo-util').Pattern;
const { locales: localeScripts } = require('../../source/_resources.json');

module.exports = function (hexo) {
  const lang = localeId(hexo.config.language);

  return {
    process: function (file) {
      const Asset = this.model('Asset');
      const id = file.source.substring(this.base_dir.length).replace(/\\/g, '/')
      const doc = Asset.findById(id);
      if (doc && (!localeScripts[lang] || !file.path.match(localeScripts[lang]))) doc.remove();
    },
    pattern: new Pattern(/source\/main.*\.js$/)
  }
}
