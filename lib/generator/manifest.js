module.exports = function (locals) {
  const manifest = this.theme.config.pwa.manifest;

  if (!manifest) return;

  return [{
    path: 'manifest.json',
    data: JSON.stringify(manifest)
  }];
};
