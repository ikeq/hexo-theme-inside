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

  function loadPlugin(id, config) {
    try {
      md.use(require(id), config);
    } catch (e) {
      hexo.log.error(e.message);
    }
  }
};
