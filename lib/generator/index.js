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
const builtInRoutes = ['page', 'post', 'categories', 'tags', 'archives', 'search', '404'];

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

      pages: locals.pages
        // Filter built-in routes to improve compatibility
        .filter(page => {
          if (builtInRoutes.includes(page.path.split('/')[0])) {
            hexo.log.warn(page.path + ' won\'t be rendered.');
            return false;
          }

          return true;
        })
        .toArray(),

      posts: locals.posts.filter(published).sort('-date').toArray()
    };

    return flatten(generators.map(fn => fn.call(this, sLocals)));
  });
};
