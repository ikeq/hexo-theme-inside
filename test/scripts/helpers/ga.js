'use strict';

const cheerio = require('cheerio');

describe('ga', function () {
  const ga = require('../../../lib/helper/ga');

  it('create ga script tag', function () {
    const $ = cheerio.load(ga('foo'));

    expect($('script').eq(0).attr('src')).toBe('//www.googletagmanager.com/gtag/js?id=foo');
    expect($('script').eq(1)).not.toBeNull();
  });
});
