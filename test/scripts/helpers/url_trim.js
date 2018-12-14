'use strict';

describe('url_trim', () => {
  const urlTrim = require('../../../lib/helper/url_trim');

  it('trim `index.html` in the end', () => {
    expect(urlTrim('//abc.com/index.html')).toBe('//abc.com/');
  });
});
