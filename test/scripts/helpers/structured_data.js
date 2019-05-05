'use strict';

const cheerio = require('cheerio');
const urlFor = require('hexo/lib/plugins/helper/url_for');

describe('structured_data', function () {
  const Hexo = require('hexo');
  const hexo = new Hexo();
  const ctx = {
    url_for: urlFor.bind(hexo),
    config: hexo.config,
    theme: { profile: {}, sns: {} }
  };
  const structuredData = require('../../../lib/helper/structured_data').bind(ctx);

  it('generate WebSite entry', function () {
    const $ = cheerio.load(structuredData({}));
    const json = JSON.parse($('script').html());

    expect(json.length).toBe(1);
    expect(json[0]['@type']).toBe('WebSite');
  });

  it('generate additional Article entry for post page', function () {
    const $ = cheerio.load(structuredData({ type: 'post', categories: { toArray() { return [] } } }));
    const json = JSON.parse($('script').html());

    expect(json.length).toBe(2);
    expect(json[0]['@type']).toBe('WebSite');
    expect(json[1]['@type']).toBe('Article');
  });
});
