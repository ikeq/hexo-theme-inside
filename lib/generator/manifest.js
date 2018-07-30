module.exports = function (locals) {
  const manifest = this.theme.config.manifest;

  return [{
    path: 'manifest.json',
    data: JSON.stringify(manifest)
  }];
};
