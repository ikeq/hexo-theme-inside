const fs = require('fs'),
  path = require('path'),
  crypto = require('crypto');

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

exports.pick = function (obj, keys) {
  if (!isObject(obj)) return {};

  obj = Object.assign({}, obj);
  let newObj = {};

  keys.forEach(key => obj.hasOwnProperty(key) && (newObj[key] = obj[key]));

  // simply convert hexo circular structure to regular
  if (newObj.tags) {
    if (newObj.tags.length) newObj.tags = newObj.tags.map(tag => tag.name);
    else delete newObj.tags;
  }
  if (newObj.categories) {
    if (newObj.categories.length) newObj.categories = newObj.categories.map(cat => cat.name);
    else delete newObj.categories;
  }
  if (newObj.prev) newObj.prev = { title: newObj.prev.title, slug: newObj.prev.slug };
  if (newObj.next) newObj.next = { title: newObj.next.title, slug: newObj.next.slug };

  return newObj;
}

exports.md5 = function (str, len = 20) {
  return crypto.createHash('md5').update(str).digest('hex').substring(0, len);
}

exports.apiPagination = function (items, options = {}) {
  let indexFn = options.indexFn || (i => `${i + 1}`),
    type = options.type,
    len = items.length,
    pageSize = options.pageSize == undefined ? 10 : options.pageSize == 0 ? len : options.pageSize,
    pageCount = Math.ceil(len / pageSize),
    out = [];

  for (let i = 0; i < pageCount; i++) {
    out.push({
      index: indexFn(i),
      type: type,
      data: Object.assign({
        total: len,
        pageSize: pageSize,
        pageCount: pageCount,
        current: i + 1,
        data: items.slice(i * pageSize, (i + 1) * pageSize)
      }, isObject(options.extend) ? options.extend : {})
    });
  }

  return out;
}

exports.base64Encode = function (input) {
  const MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '',
    chr1, chr2, chr3, enc1, enc2, enc3, enc4,
    i = 0;

  input = utf8Encode(input);

  while (i < input.length) {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output = output +
      MAP.charAt(enc1) + MAP.charAt(enc2) +
      MAP.charAt(enc3) + MAP.charAt(enc4);
  }

  return output;

  function utf8Encode(string) {
    string = string.replace(/\r\n/g, '\n');
    let utftext = '';
    for (let n = 0; n < string.length; n++) {
      let c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }
    return utftext;
  }
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
