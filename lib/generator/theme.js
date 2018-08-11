const { md5 } = require('../utils');
const urlFor = require('hexo/lib/plugins/helper/url_for');

module.exports = function () {
  const config = this.theme.config.theme;
  let style = '';

  if (config.background) style += `body { background-image: url("${urlFor.call(this, config.background)}"); }`;
  if (config.content_width) style += `.page{ max-width: ${config.content_width}px !important; }`
  if (config.sidebar_background) style += `@media (max-width: 975px) {
    .sidebar { background-image: url(${urlFor.call(this, config.sidebar_background)}) !important; }
  }`

  const hash = md5(style);
  this.theme.config.themeHash = hash;

  return [{
    path: `theme.${hash}.css`,
    data: style
  }];
};
