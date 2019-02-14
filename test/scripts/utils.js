'use strict';

const cheerio = require('cheerio');

describe('utils', () => {
  const { type, isEmptyObject, pick, md5, base64, getPagePath, getAssetsName, Pagination, parseToc, validateSchema, escapeIdentifier, localeId, parseJs, snippet } = require('../../lib/utils');

  it('type()', () => {
    expect(type({})).toBe('object');
    expect(type([])).toBe('array');
    expect(type()).toBe('undefined');
  });

  it('isEmptyObject()', () => {
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject({ a: 1 })).toBe(false);
    expect(isEmptyObject([])).toBe(false);
  });

  it('pick()', () => {
    const o = { a: 1, b: 2, c: 3, d: 4 };
    const keys = ['a', 'b'];
    const result = { a: 1, b: 2 };
    const curying = pick(keys);

    expect(pick(o, keys)).toEqual(result);
    expect(curying(o)).toEqual(result);
  });

  it('md5()', () => {
    expect(md5('foo')).toBe('acbd18db4cc2f85cedef');
    expect(md5('foo', 6)).toBe('acbd18');
  })

  it('base64()', () => {
    expect(base64('foo')).toBe('Zm9v');
    expect(base64('foo/')).toBe('Zm9vLw');
    expect(base64('foo/a')).toBe('Zm9vL2E');
  })

  it('getPagePath()', () => {
    expect(getPagePath('root/page/index.md')).toEqual('root/page');
    expect(getPagePath('root/page/v2.md')).toEqual('root/page/v2');
  });

  it('getAssetsName()', () => {
    expect(getAssetsName(
      [
        '404.12848da7f1026d4027da.jpg',
        'fonts.e15b7f98c5fa14803416.css',
        'main.59ea5ab0236c806259b7.ja.js',
        'main.d585f7caa9803a0b3184.zh-Hant.js',
        'main.e03c502d4e39a3813ed1.zh-Hans.js',
        'main.ed840fafa9b7040ecb3a.en.js',
        'polyfills.d08f09f49682da52980e.js',
        'runtime.ec2944dd8b20ec099bf3.js',
        'styles.33c538ae674b89d5ccc1.css'
      ],
      'js',
      ['polyfills', 'main', 'runtime']
    )).toEqual([
      'polyfills.d08f09f49682da52980e.js',
      'main.59ea5ab0236c806259b7.ja.js',
      'main.d585f7caa9803a0b3184.zh-Hant.js',
      'main.e03c502d4e39a3813ed1.zh-Hans.js',
      'main.ed840fafa9b7040ecb3a.en.js',
      'runtime.ec2944dd8b20ec099bf3.js',
    ])
  });

  it('Pagination', () => {
    const pagination = new Pagination({
      html: { generateFn: ({ path, data }) => ({ path: path + '/index.html', data, layout: 'index' }) },
      json: { generateFn: ({ path, data }) => ({ path: 'api/' + path + '.json', data: JSON.stringify(data) }) },
    });
    const posts = [1, 2, 3, 4, 5, 6];
    const datium = pagination.apply(posts, { perPage: 5, id: 'test' }, [{ type: 'html' }, { type: 'json' }]);

    expect(datium[0]).toEqual([
      { path: 'test/index.html', data: { per_page: 5, total: 2, current: 1, data: [1, 2, 3, 4, 5] }, layout: 'index' },
      { path: 'api/test.json', data: '{"per_page":5,"total":2,"current":1,"data":[1,2,3,4,5]}' },
    ]);
    expect(datium[1]).toEqual([
      { path: 'test/2/index.html', data: { per_page: 5, total: 2, current: 2, data: [6] }, layout: 'index' },
      { path: 'api/test/2.json', data: '{"per_page":5,"total":2,"current":2,"data":[6]}' },
    ]);
  });

  it('parseToc()', () => {
    const cnt1 = `
      <h1 a="a" id="title-1" b="b"><a></a>title 1<a></a></h1>
      content
      <h2 a="a" id="title-1-1" b="b"><a></a>title 1.1<a></a></h2>
      content
      <h3 a="a" id="title-1-1-1" b="b"><a></a>title 1.1.1<a></a></h3>
      content
      <h4 a="a" id="title-1-1-1-1" b="b"><a></a>title 1.1.1.1<a></a></h4>
      content
      <h5 a="a" id="title-1-1-1-1-1" b="b"><a></a>title 1.1.1.1.1<a></a></h5>
      content
      <h1 a="a" id="title-2" b="b"><a></a>title 2<a></a></h1>
      content
    `;
    const cnt2 = `
      <h1 a="a" id="title-1" b="b"><a></a>title 1<a></a></h1>
      content
      <h3 a="a" id="title-1-1-1" b="b"><a></a>title 1.1.1<a></a></h1>
      content
    `;

    //  depth is max to 4
    expect(parseToc(cnt1, 5)).toEqual([
      {
        title: 'title 1', id: 'title-1', index: '1', children: [
          {
            title: 'title 1.1', id: 'title-1-1', index: '1.1', children: [
              {
                title: 'title 1.1.1', id: 'title-1-1-1', index: '1.1.1', children: [
                  {
                    title: 'title 1.1.1.1', id: 'title-1-1-1-1', index: '1.1.1.1'
                  }
                ]
              }
            ]
          }
        ]
      },
      { title: 'title 2', id: 'title-2', index: '2' },
    ]);
    expect(parseToc(cnt1, 1)).toEqual([
      { title: 'title 1', id: 'title-1', index: '1' },
      { title: 'title 2', id: 'title-2', index: '2' },
    ]);

    // cnt2 shouldn't be parsed
    expect(parseToc(cnt2)).toEqual([]);
  });

  it('validateSchema()', () => {
    const schema = {
      a: { type: 'number', default: '$a', required: true },
      b: { type: 'number', default: 2, required: true },
      c: { type: 'number', default: 3 },
      d: { type: 'object', properties: { a: { type: 'number', default: '$a', required: true }, b: { type: 'number', default: 2, required: true } } },
      e: { type: { a: { type: 'number' } } }
    };
    expect(validateSchema(schema, { b: 'b', c: 'c', d: { b: 2 }, e: { a: 1 } }, { $a: 1 })).toEqual({
      a: 1,
      b: 2,
      d: { a: 1, b: 2 },
      e: { a: 1 }
    });

    const schemaOneOf = {
      a: {
        oneOf: [
          { type: 'number' },
          { enum: [false, 'a'] },
          { type: 'array', items: { enum: [1, 2, 3], required: true } },
        ]
      }
    };
    expect(validateSchema(schemaOneOf, { a: 1 })).toEqual({ a: 1 });
    expect(validateSchema(schemaOneOf, { a: false })).toEqual({ a: false });
    expect(validateSchema(schemaOneOf, { a: 'a' })).toEqual({ a: 'a' });
    expect(validateSchema(schemaOneOf, { a: [1, 'a'] })).toEqual({ a: [1] });

    const schemaOneOf2 = {
      a: {
        oneOf: [
          { type: 'string' },
          { type: 'array', items: { type: 'string' } },
        ]
      }
    };
    expect(validateSchema(schemaOneOf2, { a: 'a' })).toEqual({ a: 'a' });
    expect(validateSchema(schemaOneOf2, { a: ['a', 'b', 1, {}] })).toEqual({ a: ['a', 'b'] });

    const schemaArray = { a: { type: 'array', items: { type: { a: { type: 'number' }, b: { type: 'string' } } } } };
    expect(validateSchema(schemaArray, { a: [{ a: 1, b: 'b' }] })).toEqual({ a: [{ a: 1, b: 'b' }] })
  });

  it('escapeIdentifier()', () => {
    expect(escapeIdentifier('A & B & C')).toBe('A and B and C');
    expect(escapeIdentifier('A + B + C')).toBe('A plus B plus C');
  });

  it('localeId()', () => {
    expect(localeId('zh-cn', true)).toBe('zh-Hans');
    expect(localeId('zh-Hans')).toBe('zh-cn');
  });

  it('jsParser()', () => {
    expect(parseJs()).toBe('');
    expect(parseJs({})).toBe('');
    expect(parseJs(`const foo = 1; // foo`)).toBe('var foo=1;');
    expect(parseJs(`(function() {
                       const foo = 1; // foo
                    })();`)).toBe('');
  });

  it('snippet()', () => {
    expect(snippet('')).toBe('');

    expect(snippet('alert(1)'))
      .toBe('<div class="is-snippet"><script>alert(1);</script></div>');

    expect(snippet('', 'whatever here')).toBe('<div class="is-snippet">whatever here</div>');

    expect(snippet('alert(1)', code => `<foo>${code}</foo>`))
      .toBe('<div class="is-snippet"><foo>alert(1);</foo></div>');
  });

});
