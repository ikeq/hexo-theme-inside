'use strict';

describe('post', () => {
  const post = require('../../../lib/filter/post');

  it('add additional tag for table and remove empty thead', () => {
    const data = {
      content: `<table><thead><tr><th> </th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>`,
    };

    post(data);

    expect(data.content).toBe('<div class="article-bounded"><div class="article-table"><table><tbody><tr><td>1</td></tr></tbody></table></div></div>');
  });

  it('add additional tag for single img', () => {
    const data = {
      content: `<p><img></p><p>img<img></p><p><img><img></p>`,
    };

    post(data);

    expect(data.content).toBe('<div class="article-img"><p><img></p></div><p>img<img></p><p><img><img></p>');
  });

  it('add additional tag for script', () => {
    const data = {
      content: `<script>'foo'</script>`,
    };
    post(data);
    expect(data.content).toBe(`<div class="is-snippet"><script>"use strict";</script></div>`);

    data.content = '<script></script>';
    post(data);
    expect(data.content).toBe('<script></script>');
  });
});
