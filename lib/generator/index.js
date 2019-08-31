const { flatten } = require('lodash');
const { published } = require('../utils');
const generators = [
  require('./config'),
  require('./theme'),
  require('./entries'),
  require('./sitemap'),
  require('./manifest'),
  require('./sw')
];
const builtInRoutes = ['page', 'categories', 'tags', 'archives', 'search', '404'];

module.exports = function (hexo) {
  // Remove hexo default generators
  ['index', 'post', 'page', 'archive', 'category', 'tag']
    .forEach(name => delete hexo.extend.generator.store[name]);

  hexo.extend.generator.register('inside', function (locals) {
    const sLocals = {
      tags: locals.tags.sort('name').map(data => {
        data.posts = data.posts.filter(published).sort('-date');
        return data;
      }).filter(data => data.posts.length),

      categories: locals.categories.sort('name').map(data => {
        data.posts = data.posts.filter(published).sort('-date');
        return data;
      }).filter(data => data.posts.length),

      pages: locals.pages.filter(filterBuiltInRoutes).toArray(),

      posts: locals.posts.filter(published).filter(filterBuiltInRoutes).sort('-date').toArray()
    };

    return flatten(generators.map(fn => fn.call(this, sLocals)));
  });

  // Filter built-in routes to improve compatibility
  function filterBuiltInRoutes(post) {
    if (builtInRoutes.includes(post.path.split('/')[0])) {
      hexo.log.warn(post.path + ' won\'t be rendered.');
      return false;
    }

    return true;
  }
};
