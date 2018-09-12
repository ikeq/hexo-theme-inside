const { parseJs } = require('../utils');
const snippet = require('./snippet');
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

  const [width, height] = args;
  const cid = `canvas-${id}`;


  if (!(+width > 0)) width = 300;
  if (!(+height > 0)) height = 150;

  id++;

  let code = parseJs(
    `(function(canvas) {
       'use strict';
       var ctx=canvas.getContext('2d'), w = ${width}, h = ${height};
       ${content}
     })(document.getElementById('${cid}'));`
  );

  if (!code) return '';
  return snippet([], `<canvas id="${cid}" width="${width}" height="${height}"></canvas><script>${code}</script>`);
}
