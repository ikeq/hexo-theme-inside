const Pattern = require('hexo-util').Pattern;

module.exports = function (hexo) {
  const lang = hexo.config.language || 'en';

  return {
    process: function (file) {
      const Asset = this.model('Asset');
      const id = file.source.substring(this.base_dir.length).replace(/\\/g, '/')
      const path = file.path;
      const doc = Asset.findById(id);

      if (path.indexOf(`${lang}.js`) === -1 && doc) doc.remove();
    },
    pattern: new Pattern(/source\/main.*\.js$/)
  }
}
