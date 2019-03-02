'use strict';

describe('post', function () {
  const post = require('../../../lib/filter/post');

  beforeEach(function () {
    this.ctx = {
      theme: {
        config: {
          comments: {},
          reward: {},
          toc: {},
          copyright: {
            license: 'a'
          },
          post: { reward: true, toc: true, copyright: true },
          page: { reward: true, toc: true, copyright: true }
        }
      },
      config: {
        url: '//example.com'
      }
    };
  });

  it('specify type', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: ''
    }
    post.call(this.ctx, data);
    expect(data.type).toBe('post');
  })

  it('link', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: '',
      slug: 'test'
    }
    post.call(this.ctx, data);
    expect(data.link).toBe('//example.com/post/test/');

    data.layout = 'page';
    data.source = 'test/index.md';
    post.call(this.ctx, data);
    expect(data.link).toBe('//example.com/test/');
  })

  it('comments', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: '',
      comments: true
    };

    post.call(this.ctx, data);
    expect(data.comments).toBe(true);

    // local comments disabled
    data.comments = false;
    post.call(this.ctx, data);
    expect(data.comments).toBe(false);
  })

  it('reward', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: ''
    };

    post.call(this.ctx, data);
    expect(data.reward).toBe(true);

    // local reward disabled
    data.reward = false;
    post.call(this.ctx, data);
    expect(data.reward).toBe(false);
  });

  it('copyright', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: ''
    };

    post.call(this.ctx, data);
    expect(data.copyright).toEqual({ license: 'a' });

    data.copyright = { license: 'b' };
    post.call(this.ctx, data);
    expect(data.copyright).toEqual({ license: 'b' });
  });

  it('heading anchor', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      slug: 'test',
      content: '<h2 id="Title"><a href="#Title" class="headerlink" title="Title"></a>Title</h2>'
    };

    post.call(this.ctx, data);
    expect(data.content).toBe('<h2 id="Title">Title<a href="post/test#Title"></a></h2>');

    data.content = '<h2 id="Title"><a href="#Title" class="headerlink" title="Title"></a><span>Title</span></h2>';
    post.call(this.ctx, data);
    expect(data.content).toBe('<h2 id="Title"><span>Title</span><a href="post/test#Title"></a></h2>');
  })

  it('add additional tag for table and remove empty thead', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: `<table><thead><tr><th> </th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>`,
    };

    post.call(this.ctx, data);

    expect(data.content).toBe('<div class="article-bounded"><div class="article-table"><table><tbody><tr><td>1</td></tr></tbody></table></div></div>');
  });

  it('add additional tag for block img', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: `<p><img></p><p>img<img></p><p><img><img></p>`,
    };

    post.call(this.ctx, data);

    expect(data.content.replace(/\=\"\"/g, '')).toBe(
      '<div class="article-img"><p><img data-zoomable></p></div>' +
      '<p>img<img></p>' +
      '<div class="article-img"><p><img data-zoomable><img data-zoomable></p></div>');
  });

  it('add additional tag for script', function () {
    const data = {
      layout: 'post',
      excerpt: '',
      content: `<script>'foo'</script>`,
    };
    post.call(this.ctx, data);
    expect(data.content).toBe(`<div class="is-snippet"><script></script></div>`);

    data.content = '<script></script>';
    post.call(this.ctx, data);
    expect(data.content).toBe('<script></script>');
  });
});
