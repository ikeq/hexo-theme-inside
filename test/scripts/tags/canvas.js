'use strict';

const cheerio = require('cheerio');

describe('canvas', () => {
  const canvas = require('../../../lib/tag/canvas');

  it('increase the id and reset when title is changed', () => {
    const $1 = cheerio.load(canvas.call({ title: 'foo' }, []));
    const $2 = cheerio.load(canvas.call({ title: 'foo' }, []));
    const $3 = cheerio.load(canvas.call({ title: 'bar' }, []));

    expect($1('canvas').attr('id')).toBe('canvas-0');
    expect($2('canvas').attr('id')).toBe('canvas-1');
    expect($3('canvas').attr('id')).toBe('canvas-0');
  });

  it('create canvas and script', () => {
    const $ = cheerio.load(canvas([], 'ctx'));

    expect($('canvas')).not.toBeNull();
    expect($('script').html()).not.toBe('');
  });

  it('set width and height', () => {
    const $1 = cheerio.load(canvas([]));
    const $2 = cheerio.load(canvas([100, 50]));

    expect($1('canvas').attr('width')).toBe('300');
    expect($1('canvas').attr('height')).toBe('150');
    expect($2('canvas').attr('width')).toBe('100');
    expect($2('canvas').attr('height')).toBe('50');
  });
});
