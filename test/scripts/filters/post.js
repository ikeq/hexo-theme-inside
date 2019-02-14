'use strict';

describe('post', function () {
  const post = require('../../../lib/filter/post');
  const ctx = {
    theme: {
      config: {}
    },
    config: {}
  }

  it('specify type', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: ''
    }
    post.call(ctx, data);
    expect(data.type).toBe('post');
  })

  it('add additional tag for table and remove empty thead', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: `<table><thead><tr><th> </th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>`,
    };

    post.call(ctx, data);

    expect(data.content).toBe('<div class="article-bounded"><div class="article-table"><table><tbody><tr><td>1</td></tr></tbody></table></div></div>');
  });

  it('add additional tag for block img', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: `<p><img></p><p>img<img></p><p><img><img></p>`,
    };

    post.call(ctx, data);

    expect(data.content).toBe(
      '<div class="article-img"><p><img data-zoomable=""></p></div>' +
      '<p>img<img></p>' +
      '<div class="article-img"><p><img data-zoomable=""><img data-zoomable=""></p></div>');
  });

  it('add additional tag for script', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: `<script>'foo'</script>`,
    };
    post.call(ctx, data);
    expect(data.content).toBe(`<div class="is-snippet"><script></script></div>`);

    data.content = '<script></script>';
    post.call(ctx, data);
    expect(data.content).toBe('<script></script>');
  });
});
