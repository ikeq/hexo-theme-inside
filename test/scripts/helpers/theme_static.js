'use strict';

const cheerio = require('cheerio');
const urlFor = require('hexo/lib/plugins/helper/url_for');

describe('theme_static', () => {
  const Hexo = require('hexo');
  const hexo = new Hexo();
  const ctx = {
    url_for: urlFor.bind(hexo),
    config: hexo.config,
    theme: { theme: {} }
  };
  const themeStatic = require('../../../lib/helper/theme_static').bind(ctx);

  it('css', () => {
    const $ = cheerio.load(themeStatic('css'));
    expect($('link').eq(0).attr('href')).toMatch(/^\/fonts\.\w*\.css$/);
    expect($('link').eq(1).attr('href')).toMatch(/^\/styles\.\w*\.css$/);
  });

  it('js', () => {
    const $ = cheerio.load(themeStatic('js'));
    expect($('script').eq(0).attr('src')).toMatch(/^\/runtime\.\w*\.js$/);
    expect($('script').eq(1).attr('src')).toMatch(/^\/polyfills\.\w*\.js$/);
    expect($('script').eq(2).attr('src')).toMatch(/^\/main\.\w*\.en\.js$/);
  });
});
