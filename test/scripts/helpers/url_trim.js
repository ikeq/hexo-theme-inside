'use strict';

describe('url_trim', function () {
  const urlTrim = require('../../../lib/helper/url_trim');

  it('trim `index.html` in the end', function () {
    expect(urlTrim('//abc.com/index.html')).toBe('//abc.com/');
  });
});
