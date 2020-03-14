const marked = require('marked');
const { stripHTML } = require('hexo-util');
const { isExternal, htmlTag, parseJs } = require('../utils');
const script_regex = /<script\s*([^>]*)>([\s\S]*)<\/script>/;

class Renderer extends marked.Renderer {
  constructor(ctx) {
    super()
    this.site = ctx.config
    this.theme = ctx.theme.config
    this.styles = this.theme.runtime.styles
  }
  image(src, title, text) {
    const { uriReplacer } = this.theme.runtime
    const pipeValue = parsePipe(title || '');
    return htmlTag('img', {
      src: uriReplacer(src),
      class: pipeValue.options.block ? this.styles.blockimg : '',
      title: pipeValue.value,
      alt: text
    })
  }
  table(header, body) {
    const { styles } = this
    return [
      `<div class="${styles.bounded}"><div class="${styles.table}">`,
      '<table>',
      `<thead>${header}</thead>`,
      `<tbody>${body}</tbody>`,
      '</table>',
      '</div></div>'
    ].join('')
  }
  tablecell(content, flags) {
    if (flags.header) {
      if (content === '&nbsp;') content = '';
      const attrs = !content // is empty
        ? { style: 'padding:0' }
        : { align: flags.align };
      return htmlTag('th', attrs, content);
    }
    return htmlTag('td', { align: flags.align }, content);
  }
  link(href, title, text) {
    return htmlTag('a', { href, title, target: isExternal(href) ? '_blank' : '' }, text);
  }
  heading(text, level, raw, slugger) {
    const title = stripHTML(text);
    const id = slugger.slug(title);
    return htmlTag('h' + level, { id },
      text + htmlTag('a', { href: '#' + id, title })
    )
  }
  list(body, ordered) {
    const isChecklist = /<input.*type="checkbox/.test(body);
    return htmlTag(
      ordered ? 'ol' : 'ul',
      isChecklist ? { class: this.styles.checklist } : undefined,
      body
    );
  }
  checkbox(checked) {
    return htmlTag('input', { type: 'checkbox', disabled: true, checked }) + htmlTag('i');
  }
  html(html) {
    html = html.trim();
    if (html === '<!-- more -->') return html;

    const scriptMatch = html.match(script_regex);
    if (scriptMatch) {
      const minified = parseJs(scriptMatch[2]);
      if (!minified) return html;
      scriptMatch[1] && (scriptMatch[1] = ' ' + scriptMatch[1]);
      return `<script${scriptMatch[1]}>${minified}</script>`
    }
    return html;
  }
}

module.exports = function (data) {
  const hexo = this;
  return marked(preReplace(data.text), Object.assign({
    renderer: new Renderer(hexo),
  }, hexo.config.marked));
};

/**
 * "A picture | block | key: value"
 *   => { value: "A picture", options: { block: true, key: value } }
 * "block"
 *   => { options: { block: true } }
 *
 * @param {string} value
 * @returns {{ value: string, options: any }}
 */
function parsePipe(value) {
  const partial = value.split(/ *\| */);
  const ret = { options: {} };

  if (partial[0]) ret.value = partial[0];

  partial.slice(1).forEach(p => {
    const [k, v] = p.split(/ *\: */);
    if (k) {
      ret.options[k] = v || true;
    }
  });

  return ret;
}

function preReplace(md) {
  return md
    // append `block` pipe for block img
    .replace(/^ *(!\[.*\]\(.*\)) */mg, (_, $1) => {
      if (/"\)$/.test($1))
        return $1.slice(0, -2) + '|block")'
      return $1.slice(0, -1) + ' "|block")'
    })
}
