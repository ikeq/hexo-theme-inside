'use strict';

const cheerio = require('cheerio');

describe('gist', () => {
  const gist = require('../../../lib/tag/gist');

  it('create additional tag', () => {
    const $ = cheerio.load(gist(['foo']));

    expect($('script').parent().attr('class')).toBe('is-snippet');
    expect($('script').attr('src')).toBe('//gist.github.com/foo.js');
  });
});
