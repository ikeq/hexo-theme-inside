const fs = require('fs'),
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

exports.parseToc = function (content, depth) {
  if (!content || depth === false || depth === 0) return [];

  if (depth === undefined || depth === null) depth = 2;
  else if (depth > 4) depth = 4;

  const reg = [
    /^<h1.*id="([^"]*)".*<\/a>(.*)<\/h1>$/,
    /^<h2.*id="([^"]*)".*<\/a>(.*)<\/h2>$/,
    /^<h3.*id="([^"]*)".*<\/a>(.*)<\/h3>$/,
    /^<h4.*id="([^"]*)".*<\/a>(.*)<\/h4>$/,
  ].slice(0, depth + 1),
    headings = content.match(/<(h[1234]).*>[^<]*<\/\1>/g);

  if (!headings) return [];

  // Default will start from heading1, start from heading2 if failed
  if (!test(headings).length) reg.shift();
  // Pop up the last reg to ensure toc matches the specified depth
  else if (reg.length === depth + 1) reg.pop();

  return test(headings);

  function test(block, pointer = 0, code = '') {
    if (!reg[pointer]) return [];

    const splited = split(block, reg[pointer]);

    return splited.map((b, i) => {
      const index = (code ? code + '.' : '') + (i + 1),
        [, id, title] = b[0].match(reg[pointer]),
        out = { title, id, index },
        children = test(b.slice(1), pointer + 1, index);

      if (children.length)
        out.children = children;

      return out;
    }
    );
  }

  /**
   * return paired slicer
   *
   * @param {string[]} target
   * @param {RegExp} reg
   * @returns {string[][]}
   */
  function split(target, reg) {
    const recorder = [],
      slicer = [],
      output = [];

    target.forEach((line, index) => {
      if (line.match(reg)) {
        recorder.push(index);
      }
    }
    );

    recorder.push(target.length);

    for (let i = 0, len = recorder.length; i < len; i++) {
      if (i + 1 === len) break;
      slicer.push([recorder[i], recorder[i + 1]]);
    }

    slicer.forEach(indexs => {
      output.push(target.slice.apply(target, indexs));
    })

    return output;
  }
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
