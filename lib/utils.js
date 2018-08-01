const fs = require('fs'),
  crypto = require('crypto');

exports.isObject = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * Custom extends, assign to left only if
 * 1. the right is primitive value or an Array
 * 2. the right is not undefined or the left is undefined
 *
 * @param {...object[]} args
 * @returns {object}
 */

exports.extends = function (...args) {
  let extended = {};

  args.forEach(arg => {
    for (let key in arg) {
      let i = arg[key];
      if (exports.isObject(i)) extended[key] = exports.extends(extended[key], i);
      else if (i !== undefined && (i !== null || extended[key] === undefined)) extended[key] = i;
    }
  });

  return extended;
}

exports.pick = function (obj, keys) {
  if (keys === undefined) {
    keys = obj;
    return process;
  }

  return process(obj);

  function process(o) {
    o = Object.assign({}, o);
    let ret = {};

    keys.forEach(key => o.hasOwnProperty(key) && (ret[key] = o[key]));

    if (ret.tags) {
      if (ret.tags.length) ret.tags = ret.tags.map(tag => tag.name);
      else delete ret.tags;
    }
    if (ret.categories) {
      if (ret.categories.length) ret.categories = ret.categories.map(cat => cat.name);
      else delete ret.categories;
    }
    if (ret.prev) ret.prev = { title: ret.prev.title, slug: ret.prev.slug };
    if (ret.next) ret.next = { title: ret.next.title, slug: ret.next.slug };

    return ret;
  }
}

exports.md5 = function (str, len = 20) {
  return crypto.createHash('md5').update(str).digest('hex').substring(0, len);
}

exports.base64 = function (str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '');
}

/**
 * Aligns pages path to support sub pages
 *
 * source/page/index.md => /root/page
 * source/page/v2.md => /root/page/v2
 *
 * @param   {string}  source page.source
 * @returns {string}
 */
exports.getPagePath = function (source) {
  let [paths, md] = source.split(/\/(?=[^\/]*md$)/);

  if (md !== 'index.md') paths += '/' + md.substring(0, md.indexOf('.md'));
  return paths;
}

/**
 * Get file name without hash suffixed
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


exports.Pagination = class {
  /**
   * @param {any} config
   */
  constructor(config) {
    this.config = Object.assign(config);
  }

  /**
   * @param {any[]} posts
   * @param {{ perPage: number; id?: string | Function; extend?: object; dataFn?: Function; }} options
   * @param {(Array<{ type: 'html' | 'json'; dataFn?: Function; id: string | Function; extend?: object }>)} generationMeta
   * @returns {Array<{ path: string; layout?: string; data: any }>}
   */
  apply(posts, options, generationMeta) {
    const len = posts.length;
    const perPage = options.perPage == undefined ? 10 : options.perPage == 0 ? len : +options.perPage;
    const total = Math.ceil(len / perPage);
    const ret = [];

    // Merge options into meta
    const commonProps = ['id', 'dataFn'];
    generationMeta = generationMeta.map(meta => {
      commonProps.forEach(prop => {
        if (meta[prop] === undefined && options[prop] !== undefined) meta[prop] = options[prop];
      });
      meta.extend = Object.assign({}, options.extend || {}, meta.extend || {});

      return meta;
    })

    for (let i = 1; i <= total; i++) {
      const data = {
        per_page: perPage,
        total,
        current: i,
        data: posts.slice((i - 1) * perPage, i * perPage)
      };

      ret.push(generationMeta.map(meta => this._merge(i, data, meta)))
    }

    return ret;
  }

  /**
   * @param {number} index
   * @param {object} data
   * @param {({ type: 'html' | 'json'; dataFn?: Function; id: string | Function; extend?: object })} meta
   * @returns {{ path: string; layout?: string; data: any }}
   */
  _merge(index, data, meta) {
    const type = meta.type;
    const base = this.config[type];

    if (!base) return;

    const dataFn = meta.dataFn || (o => o);
    const pathFn = meta.pathFn || (o => o);
    const extend = meta.extend || {};
    const id = typeof meta.id === 'function' ?
      meta.id :
      (index => index === 1 ? meta.id : `${meta.id}/${index}`);

    return base.generateFn({
      path: pathFn(id(index)),
      layout: base.layout,
      data: dataFn(Object.assign(data, extend))
    })
  }
}

/**
 * Parses toc of post
 *
 * @param {string} content
 * @param {number} depth
 * @returns {Array<{title: string; id: string; index: string; children?: any[]}>}
 */
exports.parseToc = function (content, depth) {
  if (!content || !depth) return [];

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
  // Pops up the last reg to ensure toc matches the specified depth
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
   * Return paired slicer
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
