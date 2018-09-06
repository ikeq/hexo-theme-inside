const gistTag = require('hexo/lib/plugins/tag/gist');
const snippet = require('./snippet');

/**
* Gist tag
*
* Syntax:
*   Same as official gist tag
*/
module.exports = function (...args) {
  return snippet([], gistTag.apply(this, args));
}
