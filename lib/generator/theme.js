const { md5 } = require('../utils');
const urlFor = require('hexo/lib/plugins/helper/url_for');

module.exports = function () {
  const theme = this.theme.config;
  const config = theme.theme;
  let style = '';

  if (config.background) style += `body { background: ${parseBg.call(this, config.background)} !important; }`;
  if (config.content_width) style += `.ZDZjNj { max-width: ${config.content_width}px !important; }`
  if (config.sidebar_background) style += `@media (max-width: 639px) {
    .MDgzOG { background: ${parseBg.call(this, config.sidebar_background)} !important; }
  }`

  if (!style) return [];

  theme.runtime.themeHash = md5(style);

  return [{
    path: `theme.${theme.runtime.themeHash}.css`,
    data: style
  }];
};

function parseBg(bg) {
  const img_regex = /(^data:image)|(^[^\(^'^"]*\.(jpg|png|gif|svg))/;
  bg = bg.split(/\s+/);

  return bg.map(s => s.match(img_regex) ? `url(${urlFor.call(this, s)})` : s).join(' ');
}
