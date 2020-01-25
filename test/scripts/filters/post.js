'use strict';

describe('post', function () {
  const filterPath = require.resolve('../../../lib/filter/post');
  const post = {
    call(ctx, arg) {
      delete require.cache[filterPath]
      return require(filterPath).call(ctx, arg)
    }
  }

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
          page: { reward: true, toc: true, copyright: true },
          runtime: {
            dateHelper: o => o,
            uriReplacer: o => o,
            hasReward: true,
            hasComments: true,
            hasToc: true,
            copyright: {
              license: 'a'
            },
          }
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
      slug: 'test',
      path: 'post/test'
    }
    post.call(this.ctx, data);
    expect(data.link).toBe('post/test');
    expect(data.plink).toBe('//example.com/post/test/');

    data.layout = 'page';
    data.path = 'test'
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

  it('escape with data:image', function () {
    const data = {
      layout: 'post',
      thumbnail: 'data:image',
      excerpt: '',
      content: '<p>inline<img src="data:image"></p>',
    };

    post.call(this.ctx, data);

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

    expect(data.thumbnail).toBe('img/sample.jpg')
    expect(data.color).toBe('#000')
  });

  it('don\'t parses color when `color` is specified', function () {
    const data = {
      layout: 'post',
      thumbnail: 'img/sample.jpg #000',
      color: '#fff',
      excerpt: '',
      content: '',
    };

    post.call(this.ctx, data);

    expect(data.thumbnail).toBe('img/sample.jpg')
    expect(data.color).toBe('#fff')
  });
});
