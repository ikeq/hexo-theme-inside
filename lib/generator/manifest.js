module.exports = function (locals) {
  if (this.theme.config.manifest === undefined) return [];

  const config = this.theme.config.manifest || {};
  const manifest = {
    short_name: config.short_name || this.config.title,
    name: config.name || this.config.title,
    icons: (config.icons || []).map(({ src, sizes, type }) => ({ src, sizes, type })),
    start_url: config.start_url || '/',
    background_color: config.background_color || '#2a2b33',
    theme_color: config.theme_color || '#2a2b33',
    display: "minimal-ui"
  };

  return [{
    path: 'manifest.json',
    data: JSON.stringify(manifest)
  }];
};