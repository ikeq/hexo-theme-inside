const renderer = require('./markdown');

module.exports = function (hexo) {
  hexo.config.markdown = Object.assign({
    html: true,
    xhtmlOut: false,
    breaks: true,
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
  }, hexo.config.markdown);

  hexo.extend.renderer.register('md', 'html', renderer, true);
  hexo.extend.renderer.register('markdown', 'html', renderer, true);
  hexo.extend.renderer.register('mkd', 'html', renderer, true);
  hexo.extend.renderer.register('mkdn', 'html', renderer, true);
  hexo.extend.renderer.register('mdwn', 'html', renderer, true);
  hexo.extend.renderer.register('mdtxt', 'html', renderer, true);
  hexo.extend.renderer.register('mdtext', 'html', renderer, true);
};
