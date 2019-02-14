const crypto = require('crypto');

exports.type = function (o) {
  return Object.prototype.toString.call(o).split(' ')[1].slice(0, -1).toLowerCase()
}

exports.isObject = function (obj) {
  return exports.type(obj) === 'object';
}

exports.isEmptyObject = function (obj) {
  if (!exports.isObject(obj)) return false;

  for (const key in obj) return false;
  return true;
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
      if (ret.tags.length) ret.tags = ret.tags.sort('name').map(tag => tag.name);
      else delete ret.tags;
    }
    if (ret.categories) {
      if (ret.categories.length) ret.categories = ret.categories.sort('name').map(cat => cat.name);
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
 * @param {string[]} dir
 * @param {string} ext
 * @param {string[]} names
 * @returns {string[]}
 */
exports.getAssetsName = function (dir, ext, names) {
  const out = [];

  names.forEach(name => {
    dir.forEach(filename => {
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
   * @param {({ type: 'html' | 'json'; layout?: string; dataFn?: Function; id: string | Function; extend?: object })} meta
   * @returns {{ path: string; layout?: string; data: any }}
   */
  _merge(index, data, meta) {
    const type = meta.type;
    const base = this.config[type];

    if (!base) return;

    const dataFn = meta.dataFn || (o => o);
    const pathFn = meta.pathFn || (o => o);
    const layout = meta.layout || base.layout;
    const extend = meta.extend || {};
    const id = typeof meta.id === 'function' ?
      meta.id :
      (index => (meta.id || '') + (index === 1 ? '' : `/${index}`));

    return base.generateFn({
      path: pathFn(id(index)),
      layout,
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
  if (depth > 4) depth = 4;
  if (depth < 1) depth = 3;

  const reg = [
    /^<h1.*id="([^"]*)".*>(.*)<a/,
    /^<h2.*id="([^"]*)".*>(.*)<a/,
    /^<h3.*id="([^"]*)".*>(.*)<a/,
    /^<h4.*id="([^"]*)".*>(.*)<a/,
    /^<h5.*id="([^"]*)".*>(.*)<a/,
  ].slice(0, depth + 1),
    headings = content.match(/<(h[12345]).*id="([^"]*)".*>(.*)<a.*<\/\1>/g);

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

      // strip anchor href
      out.title = out.title.replace(/ href=['"]['"^>]/g, '')

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


/**
 * Simple json schema validator
 *
 * @param {object} schema
 * @param {object} config
 * @param {object} defaults
 * @returns {config}
 */
exports.validateSchema = function (schema, config = {}, defaults = {}) {
  return validateObject(schema, config);

  function validateObject(schema, config, ordered) {
    let ret = {};
    config || (config = {});

    for (const key in schema) {
      const left = schema[key];
      const right = config[key];
      const rightType = exports.type(right);

      // Has properties means `type: object`
      if (left.properties) ret[key] = validateObject(left.properties, right, left.ordered);

      // Enum can only be primitive values
      else if (left.enum) {
        if (left.enum.indexOf(right) !== -1) ret[key] = right;
      }

      else if (left.oneOf) {
        // Matches primitive value first
        if (rightType !== 'object' && rightType !== 'array') {
          if (matchPrimitive(right, left.oneOf)) ret[key] = right;
        }
        // `right` is an object or invalid primitive value
        else {
          // Does not support two same type
          // eg, oneOf: [ {type:string}, {type:string} ] will only check the first
          const objectPattern = left.oneOf.find(t => t.type === 'object' || t.type === 'array');
          if (objectPattern) ret[key] = validateObject({ item: objectPattern }, { item: right }, objectPattern.ordered).item;
        }
      }

      else if (left.type) {
        if (left.type === rightType) {
          if (left.type === 'array') {
            const t = [];
            right.forEach(v => {
              const res = validateObject({ item: left.items }, { item: v });
              // passed or object type
              if ('item' in res && !exports.isEmptyObject(res)) {
                t.push(res.item);
              }
            });

            if (t.length) ret[key] = t;
          } else {
            // primitive value
            ret[key] = right;
          }
        }
        // type is a schema
        else if (exports.isObject(left.type)) {
          let t = validateObject(left.type, right), f = false;
          // passed only if all required keys are fullfilled
          for (const key in left.type) {
            if (left.type[key].required && !(key in t)) f = true;
          }
          if (!f) ret[key] = t;
        }
      }

      // If doesn't has a match, use default if required or right is null
      if (
        left.hasOwnProperty('default') && !ret.hasOwnProperty(key)
        && (left.required || right === null)
      ) {
        ret[key] = exports.type(left.default) === 'string' && left.default.startsWith('$') && defaults.hasOwnProperty(left.default) ? defaults[left.default] : left.default;
      }
    }

    // restore order
    if (ordered) {
      const t = {};
      for (const key in config) {
        if (key in ret) t[key] = undefined;
      }
      ret = Object.assign(t, ret);
    }

    return ret;
  }

  function matchPrimitive(value, oneOf) {
    return !!oneOf.find(item => {
      if (item.enum) return item.enum.indexOf(value) !== -1
      else return item.type === exports.type(value);
    })
  }
}

const identifierMap = {
  '+': 'plus',
  '&': 'and'
};
exports.escapeIdentifier = function (str) {
  if (!str) return '';
  return Object.keys(identifierMap).reduce((sum, i) => sum.replace(new RegExp('\\' + i, 'g'), identifierMap[i]), str);
}

const localeMap = {
  'zh-cn': 'zh-Hans',
  'zh-hk': 'zh-Hant',
  'zh-tw': 'zh-Hant',
};
const oldLocaleMap = {
  'zh-Hans': 'zh-cn',
  'zh-Hant': 'zh-hk'
};
exports.localeId = function (id, toNew) {
  return (toNew ? localeMap : oldLocaleMap)[id] || id;
}

function jsParser() {
  let babel, uglify;
  try {
    uglify = require('uglify-js');
    babel = require('babel-core');
    require('babel-preset-env');
  } catch (e) { return i => i || '' }

  const esSafe = code => babel.transform(code, { presets: [['env', { 'modules': false }]] });
  const minify = uglify.minify;

  return function (code) {
    if (!code || typeof code !== 'string') return '';

    code = esSafe(code);
    if (code) code = code.code;
    else return '';

    code = minify(code);
    if (code) code = code.code;
    else return '';

    return code;
  }
}
exports.parseJs = jsParser();

/**
 * Wrap code with template
 *
 * Example:
 *
 * snippet('') => ''
 *
 * snippet('code')
 *   => `<div class="is-snippet"><script>code which parsed by parseJs()</script></div>`
 *
 * snippet('', '<script id="mycode">code</script>')
 *   => `<div class="is-snippet"><script id="mycode">code</script></div>`
 *
 * snippet('code', code => `<script id="mycode">${code}</script>`)
 *   => `<div class="is-snippet"><script id="mycode">code which parsed by parseJs()</script></div>`
 *
 * @param {string} code
 * @param {(string | ((code: string) => string))} template
 * @returns {string}
 */
exports.snippet = function (code, template = code => `<script>${code}</script>`) {
  let content = '';

  // ignore code if template is string
  if (typeof template === 'string') {
    content = template;
  }

  // template is function which relay on code
  else if (code) {
    content = template(exports.parseJs(`(function(){${code}})();`));
  }

  return content ? `<div class="is-snippet">${content}</div>` : '';
}
