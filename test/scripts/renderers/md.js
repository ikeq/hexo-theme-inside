'use strict';

describe('md', function () {
  const md = require('../../../lib/renderer/markdown');
  const render = function (data) {
    return md.call({
      execFilterSync() {},
      config: {
        markdown: {}
      },
      theme: {
        config: {
          runtime: {
            styles: {
              blockimg: 'img',
              table: 'tb',
              bounded: 'bd',
              checklist: 'cl'
            },
            uriReplacer: _ => _ + '?'
          }
        },
      }
    }, data).trim().replace(/\n/g, '');
  }

  it('render img', function () {
    expect(render({ text: 'a ![img](img.png)' }))
      .toBe('<p>a <img src="img.png?" alt="img" loading="lazy"></p>');
    // block img
    expect(render({ text: '![img](img.png "|block")' }))
      .toBe('<p><img src="img.png?" alt="img" loading="lazy" class="img"></p>');
    expect(render({ text: '![img](img.png "|||")' }))
      .toBe('<p><img src="img.png?" alt="img" loading="lazy" class="img"></p>');
  });

  it('render link', function () {
    expect(render({ text: '[a](#a)' }))
      .toBe('<p><a href="#a">a</a></p>');
    // external link
    expect(render({ text: '[a](http://abc)' }))
      .toBe('<p><a href="http://abc" target="_blank">a</a></p>');
  });
  it('render heading', function () {
    expect(render({ text: '# h1' }))
      .toBe('<h1 id="h1">h1<a title="#h1" href="#h1"></a></h1>');
  });
  it('render list', function () {
    expect(render({ text: '- 1' }))
      .toBe('<ul><li>1</li></ul>');
    expect(render({ text: '1. 1' }))
      .toBe('<ol><li>1</li></ol>');
    expect(render({ text: '- [ ] 1' }))
      .toBe('<ul class="cl"><li><input type="checkbox" disabled=""><i></i>1</li></ul>');
    expect(render({ text: '- [x] 1' }))
      .toBe('<ul class="cl"><li><input type="checkbox" disabled="" checked=""><i></i>1</li></ul>');
  });
  it('render table', function () {
    expect(render({
      text: `
a | b | c
-|-|-
a|b|c` }))
      .toBe('<div class="bd"><div class="tb"><table><thead><tr><th>a</th><th>b</th><th>c</th></tr></thead><tbody><tr><td>a</td><td>b</td><td>c</td></tr></tbody></table></div></div>');
    // headless
    expect(render({
      text: `
&nbsp;|&nbsp;|&nbsp;
-|-|-
a|b|c` }))
      .toBe('<div class="bd"><div class="tb"><table><thead><tr><th style="padding:0"></th><th style="padding:0"></th><th style="padding:0"></th></tr></thead><tbody><tr><td>a</td><td>b</td><td>c</td></tr></tbody></table></div></div>');
  });
});
