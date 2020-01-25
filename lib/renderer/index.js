const md = require('./md');

module.exports = function (hexo) {
  hexo.config.marked = Object.assign({
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    modifyAnchors: '',
    autolink: true
  }, hexo.config.marked);

  hexo.extend.renderer.register('md', 'html', md, true);
  hexo.extend.renderer.register('markdown', 'html', md, true);
  hexo.extend.renderer.register('mkd', 'html', md, true);
  hexo.extend.renderer.register('mkdn', 'html', md, true);
  hexo.extend.renderer.register('mdwn', 'html', md, true);
  hexo.extend.renderer.register('mdtxt', 'html', md, true);
  hexo.extend.renderer.register('mdtext', 'html', md, true);
};
