const markdownIt = require('markdown-it');
const mixins = require('./mixins');
const plugins = require('./plugins');

module.exports = function (data) {
  const hexo = this;
  const config = hexo.config.markdown;
  const renderer = markdownIt(config);

  mixins.apply(hexo, [renderer, config]);
  plugins.apply(hexo, [renderer, config]);

  return renderer.render(data.text, {
    theme: hexo.theme.config,
    styles: hexo.theme.config.runtime.styles,
    getHeadingId: new function () {
      const map = {};
      return (title) => {
        if (map[title] === undefined) {
          map[title] = 0
          return title;
        } else {
          map[title] = map[title] + 1;
          return title + '-' + map[title];
        }
      }
    }
  });
};
