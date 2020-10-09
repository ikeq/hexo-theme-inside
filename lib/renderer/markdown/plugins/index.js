const collapse = require('./collapse');
const tree = require('./tree');
const timeline = require('./timeline');

module.exports = function plugins(md, config) {
  const hexo = this;

  md.use(...collapse);
  md.use(...tree);
  md.use(...timeline);

  (config.plugins || []).forEach((plugin) => {
    if (typeof plugin === 'string') {
      return loadPlugin(plugin);
    } else {
      const id = Object.keys(plugin)[0];
      loadPlugin(id, plugin[id]);
    }
  });

  /**
   * be able to extend renderer, mainly load plugins.
   * @example
   * ```js
   * hexo.extend.filter.register('inside:renderer', function(renderer) {
   *   renderer.use(container, 'collapse', [render(tokens, idx, options, env, slf) {}]);
   * });
   * ```
   */
  hexo.execFilterSync('inside:renderer', md, { context: hexo });

  function loadPlugin(id, config) {
    try {
      md.use(require(id), config);
    } catch (e) {
      hexo.log.error(e.message);
    }
  }
};
