const fs = require('fs'),
  path = require('path'),
  crypto = require('crypto'),
  _ = require('lodash');

/**
 * page => folder/subfolder/title/index
 * page => folder/subfolder/title
 *
 * @param   {Page}    page
 * @param   {boolean} noIndex set to true will not align to index
 * @returns {string}
 */
exports.classifyPage = function (page, noIndex) {
  let piece = page.source.split('/'),
    md = piece[piece.length - 1],
    arr = piece.slice(0, piece.length - 1);

  if (md !== 'index.md') arr.push(md.substring(0, md.indexOf('.md')));
  return arr.concat(noIndex ? [] : `index`).join('/')
}

/**
 * get file name without hash suffixed
 *
 * @param {string} dir
 * @param {string} ext
 * @param {string[]} names
 * @returns {string[]}
 */
exports.getAssetsName = function (dir, ext, names) {
  let hexo = this,
    filenames = fs.readdirSync(dir),
    out = [];

  names.forEach(name => {
    filenames.forEach(filename => {
      new RegExp(`^${name}\..*\.${ext}$`).test(filename) && out.push(filename);
    })
  });

  return out;
}

// simply convert hexo circular structure to regular
exports.pick = function (obj, keys) {
  let newObj = _.pick(obj, keys);

  if (newObj.tags) {
    if (newObj.tags.length) newObj.tags = newObj.tags.map(tag => tag.name);
    else delete newObj.tags;
  }
  if (newObj.prev) newObj.prev = { title: newObj.prev.title, slug: newObj.prev.slug };
  if (newObj.next) newObj.next = { title: newObj.next.title, slug: newObj.next.slug };
  // if (newObj.thumbnail) newObj.thumbnail = exports.qiniu(newObj.thumbnail)

  return newObj;
}

exports.md5 = function (str) {
  return crypto.createHash('md5').update(str).digest('hex');
}