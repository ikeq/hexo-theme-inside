'use strict';

describe('post', function () {
  const post = require('../../../lib/filter/post');

  beforeEach(function () {
    this.ctx = {
      theme: {
        config: {
          assets: { prefix: 'https://sample.com', suffix: '?q=80' },
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
    expect(data.link).toBe('post/test');
    expect(data.plink).toBe('//example.com/post/test/');

    data.layout = 'page';
    data.source = 'test/index.md';
    post.call(this.ctx, data);
    expect(data.link).toBe('test');
    expect(data.plink).toBe('//example.com/test/');
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
      content: `<p><img></p><p>img<img></p><p><img><img></p><figure><img></figure>`,
    };

    post.call(this.ctx, data);

    expect(data.content.replace(/\=\"\"/g, '')).toBe(
      '<p><img class="article-img"></p>' +
      '<p>img<img></p>' +
      '<p><img class="article-img"><img class="article-img"></p>' +
      '<figure><img class="article-img"></figure>');
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

  // assets
  it('modify image url', function () {
    const data = {
      layout: 'post',
      thumbnail: 'img/sample.jpg',
      excerpt: '',
      source: 'test/index.md',
      content: '<img src="img/sample.jpg">',
    };

    post.call(this.ctx, data);
    expect(data.thumbnail).toBe('https://sample.com/img/sample.jpg?q=80')
    expect(data.content).toBe('<img src="https://sample.com/img/sample.jpg?q=80" class="article-img">')

    data.layout = 'page'
    post.call(this.ctx, data);

    data.thumbnail = 'img/sample.jpg';
    post.call(this.ctx, data);
    expect(data.thumbnail).toBe('img/sample.jpg')
  });

  it('escape with data:image', function () {
    const data = {
      layout: 'post',
      thumbnail: 'data:image',
      excerpt: '',
      content: '<p>inline<img src="data:image"></p>',
    };

    post.call(this.ctx, { ...data });

    expect(data.thumbnail).toBe('data:image')
    expect(data.content).toBe('<p>inline<img src="data:image"></p>')
  });

  it('escape with absolute path', function () {
    const data = {
      layout: 'post',
      thumbnail: 'https://abc.com',
      excerpt: '',
      content: '<p>inline<img src="https://abc.com"></p>',
    };

    post.call(this.ctx, data);

    expect(data.thumbnail).toBe('https://abc.com')
    expect(data.content).toBe('<p>inline<img src="https://abc.com"></p>')
  });

  it('parses color', function () {
    const data = {
      layout: 'post',
      thumbnail: 'img/sample.jpg #000',
      excerpt: '',
      content: '',
    };

    post.call(this.ctx, data);

    expect(data.thumbnail).toBe('https://sample.com/img/sample.jpg?q=80')
    expect(data.color).toBe('#000')
  });

  it('don\'t parses color when `color` is specified', function () {
    const data = {
      layout: 'post',
      thumbnail: 'img/sample.jpg #000',
      color: '#fff',
      excerpt: '',
      content: '<img src="img/sample.jpg">',
    };

    post.call(this.ctx, data);

    expect(data.thumbnail).toBe('https://sample.com/img/sample.jpg?q=80')
    expect(data.color).toBe('#fff')
    expect(data.content).toBe('<img src="https://sample.com/img/sample.jpg?q=80" class="article-img">')
  });
});
