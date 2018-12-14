'use strict';

describe('assets', () => {
  const Hexo = require('hexo');
  const hexo = new Hexo();
  const assets = require('../../../lib/filter/assets').bind(hexo);

  hexo.config.title = 'Blog';
  hexo.theme.config.assets = { prefix: 'https://sample.com', suffix: '?q=80' };

  it('modify image url', () => {
    const data = {
      thumbnail: 'img/sample.jpg',
      content: '<p><img src="img/sample.jpg"></p>',
    };

    assets(data);

    expect(data).toEqual({
      thumbnail: 'https://sample.com/img/sample.jpg?q=80',
      content: '<p><img src="https://sample.com/img/sample.jpg?q=80"></p>',
    });
  });

  it('escape with data:image', () => {
    const data = {
      thumbnail: 'data:image',
      content: '<p><img src="data:image"></p>',
    };

    assets(data);

    expect(data).toEqual({
      thumbnail: 'data:image',
      content: '<p><img src="data:image"></p>',
    });
  });

  it('escape with absolute path', () => {
    const data = {
      thumbnail: 'https://abc.com',
      content: '<p><img src="https://abc.com"></p>',
    };

    assets(data);

    expect(data).toEqual({
      thumbnail: 'https://abc.com',
      content: '<p><img src="https://abc.com"></p>',
    });
  });

});
