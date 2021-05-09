const { parseJs, isExternal, parsePipe } = require('../../utils');
const script_regex = /<script\s*([^>]*)>([\s\S]*)<\/script>/;

module.exports = function mixins(md, config) {
  md.renderer.rules.table_open = function (tokens, idx, options, env, slf) {
    const token = tokens[idx];
    const { styles } = env;

    return `<div class="${styles.bounded}"><div class="${styles.table}"><table${slf.renderAttrs(token)}>`;
  };
  md.renderer.rules.table_close = function () {
    return '</table></div></div>';
  };
  md.renderer.rules.html_block = function (tokens, idx, options, env, slf) {
    const token = tokens[idx];

    // transform script
    const html = token.content;
    const group = html.match(script_regex);
    if (group) {
      const minified = parseJs(group[2]);
      if (!minified) return html;
      group[1] && (group[1] = ' ' + group[1]);
      return `<script${group[1]}>${minified}</script>`
    }
    return html;
  };

  md.core.ruler.after('inline', 'inside', function (state) {
    const { tokens, env } = state;
    const { theme, styles, getHeadingId, uriReplacer } = env;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const inlineTokens = token.children || [];

      for (const inlineToken of inlineTokens) {
        // make block-level images zoomable
        if (inlineToken.type === 'image') {
          const title = inlineToken.attrGet('title');
          const data = parsePipe(title);

          inlineToken.attrSet('loading', 'lazy');
          inlineToken.attrSet('src', uriReplacer(inlineToken.attrGet('src')));

          /**
           * hint for:
           * ```md
           * <!-- new line -->
           * ![alt](url)
           * <!-- new line -->
           * ```
           */
          if (
            token.type === 'inline' &&
            token.children.length === 1 &&
            tokens[i - 1].type === 'paragraph_open' &&
            tokens[i + 1].type === 'paragraph_close'
          ) data.block = true

          if (data.value) {
            inlineToken.attrSet('title', data.value);
          }
          // case: ![alt](url "|block")
          else if (title) {
            inlineToken.attrs.splice(inlineToken.attrIndex('title'), 1);
          }
          if (data.block) inlineToken.attrPush(['class', styles.blockimg]);
        }

        if (inlineToken.type === 'link_open') {
          const href = inlineToken.attrGet('href');
          if (isExternal(href)) inlineToken.attrPush(['target', '_blank']);
        }
      }

      // todolist
      if (
        i > 1 &&
        token.type === 'inline' &&
        tokens[i - 1].type === 'paragraph_open' &&
        tokens[i - 2].type === 'list_item_open'
      ) {
        if (token.content[0] === '[' && token.content[2] === ']') {
          const checkbox = [
            new state.Token('input', 'input', 0),
            new state.Token('tag_open', 'i', 1),
            new state.Token('tag_close', 'i', -1),
          ];

          checkbox[0].attrPush(['type', 'checkbox']);
          checkbox[0].attrPush(['disabled', '']);
          if (token.content[1] !== ' ') checkbox[0].attrPush(['checked', '']);

          // remove [x], [ ]
          token.content = token.content.slice(4);
          token.children[0].content = token.children[0].content.slice(4);

          token.children.unshift(...checkbox);

          // add class name to ul/ol
          findClosest(tokens, i - 2, ['bullet_list_open', 'ordered_list_open'])
            .attrPush(['class', styles.checklist]);
        }
      }

      // heading anchor
      if (token.type === 'heading_open') {
        const link = [new state.Token('tag_open', 'a', 1), new state.Token('tag_close', 'a', -1)];
        const headingInline = tokens[i + 1];
        const id = getHeadingId(
          headingInline.children.map(t => t.content).join('').split(' ').join('-').toLowerCase()
        );
        const href = '#' + id;

        link[0].attrPush(['title', href]);
        link[0].attrPush(['href', href]);
        token.attrPush(['id', id]);

        headingInline.children.push(...link);

        // skip next token since it is already been processed
        i++;
      }

      // empty th
      if (token.type === 'th_open') {
        const thInline = tokens[i + 1];

        if (thInline.content === '' || thInline.content === '&nbsp;') {
          thInline.content = '';
          thInline.children.length = 0;
          token.attrSet('style', 'padding:0');
          // skip next token since it is already been processed
          i++;
        }
      }
    }
  });
}

/**
 * @param {Array<{ type: string }>} tokens
 * @param {{ type: string }} fromTag
 * @param {number} fromTagIdx
 * @param {string[]} targetTypes
 * @returns {{ type: string }}
 */
function findClosest(tokens, fromTagIdx, targetTypes) {
  if (fromTagIdx < 0) return null;

  const current = tokens[fromTagIdx - 1];
  if (targetTypes.includes(current.type)) return current;

  return findClosest(tokens, fromTagIdx - 1, targetTypes);
}
