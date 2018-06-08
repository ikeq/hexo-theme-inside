const Pattern = require('hexo-util').Pattern;

module.exports = function (hexo) {
  const lang = hexo.config.language || 'en';

  return {
    process: function (file) {
      const Asset = this.model('Asset');
      const id = file.source.substring(this.base_dir.length).replace(/\\/g, '/')
      const path = file.path;

      if (path.indexOf(`${lang}.js`) !== -1) return;

      return Asset.save({
        _id: id,
        path,
        modified: false,
        renderable: true
      });
    },
    pattern: new Pattern(/source\/main.*\.js$/)
  }
}
