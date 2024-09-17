const { htmlTag } = require('../utils');

module.exports = function (...args) {
  const id = args.shift();
  const file = args.length ? `?file=${args[0]}` : '';

  return htmlTag('script', { src: `//gist.github.com/${id}.js${file}` });
};
