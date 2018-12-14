'use strict';

describe('template', () => {
  const Hexo = require('hexo');
  const hexo = new Hexo();
  const templates = require('../../../lib/filter/templates').bind(hexo);

  hexo.config.title = 'Blog';
  hexo.theme.i18n.set('default', {
    'title.archives': 'Archives',
    'title.categories': 'Categories',
    'title.tags': 'Tags',
  });

  it('change title', () => {
    const config = hexo.config
    const data = {
      post: { page: { type: 'post', title: 'Hello word' }, config },
      page: { page: { type: 'page', title: 'About' }, config },
      posts: { page: { type: 'posts' }, config },
      archives: { page: { type: 'archives' }, config },
      categories: { page: { type: 'categories' }, config },
      tags: { page: { type: 'tags' }, config },
    };

    Object.keys(data).forEach(key => templates(data[key]));

    expect(data.post.title).toBe('Hello word - Blog');
    expect(data.posts.title).toBe('Blog');
    expect(data.page.title).toBe('About - Blog');
    expect(data.archives.title).toBe('Archives - Blog');
    expect(data.categories.title).toBe('Categories - Blog');
    expect(data.tags.title).toBe('Tags - Blog');
  });
});
