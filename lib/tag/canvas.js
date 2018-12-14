const { snippet } = require('../utils');
let currentTitle = ''; id = 0;

/**
 * Canvas snippet
 *
 * Syntax:
 *   {% canvas [width] [height] %}
 *   ctx.fillStyle = 'red';
 *   ctx.fillRect(0, 0, w, h);
 *   {% endcanvas %}
 */
module.exports = function (args, content) {
  if (this.title !== currentTitle) {
    id = 0;
    currentTitle = this.title;
  }

  let [width, height] = args;
  const cid = `canvas-${id}`;


  if (!(+width > 0)) width = 300;
  if (!(+height > 0)) height = 150;

  id++;

  return snippet(
    `var canvas = document.getElementById('${cid}'), ctx = canvas.getContext('2d'), w = ${width}, h = ${height}; ${content}`,
    code => `<p><canvas id="${cid}" width="${width}" height="${height}"></canvas></p><script>${code}</script>`
  )
}
