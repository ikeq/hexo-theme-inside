const fs = require('fs'),
  path = require('path'),
  _ = require('lodash');

/**
 * page => folder/subfolder/title/index
 * page => folder/subfolder/title
 *
 * @param   {Page}    page
 * @param   {boolean} noIndex not align to index
 * @returns {string}
 */
exports.classifyPage = function (page, noIndex) {
  let piece = page.source.split('/'),
    md = piece[piece.length - 1],
    arr = piece.slice(0, piece.length - 1);

  if (md !== 'index.md') arr.push(md.substring(0, md.indexOf('.md')));
  return arr.concat(noIndex ? [] : `index`).join('/')
}

exports.getFiles = function (ext, names) {
  let typedFiles = getFilesMap(ext);

  return names.map(name => typedFiles[name]).filter(i => i);
}

function getFilesMap(ext) {
  let files = fs.readdirSync(path.join(hexo.theme_dir, 'source')).filter(name => name.match(new RegExp(`\.${ext}$`))),
    len = files.length,
    map = {};

  files.forEach(file => {
    // simple but enough here
    map[file.split('.')[0]] = file
  })
  return map;
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

  return newObj;
}