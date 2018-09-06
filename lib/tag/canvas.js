const snippet = require('./snippet');
let currentTitle = ''; id = 0;

/**
 * Canvas snippet
 *
 * Syntax:
 *   {% canvas [width] [height] %}
 *   ctx.fillStyle = 'red';
 *   ctx.arc(50, 50, 50, 0, Math.PI * 2);
 *   ctx.fill();
 *   {% endcanvas %}
 */
module.exports = function (args, content) {
  if (this.title !== currentTitle) {
    id = 0;
    currentTitle = this.title;
  }

  const [width, height] = args;
  const cid = `canvas-${id}`;

  id++;

  return snippet([], `<canvas${attrs({ id: cid, width, height })}></canvas><script>(function(canvas){var ctx=canvas.getContext('2d');${content}})(document.getElementById('${cid}'));</script>`);
}

function attrs(map) {
  let ret = ` id="${map.id}"`;
  if (+map.width > 0) ret += ` width="${map.width}"`;
  if (+map.height > 0) ret += ` height="${map.height}"`;

  return ret;
}
