const container = require('markdown-it-container');
const Token = require('markdown-it/lib/token');
const { parsePipe } = require('../../../utils');

module.exports = [container, 'tree', {
  render(tokens, idx, options, env, slf) {
    const meta = parsePipe('|' + tokens[idx].info.trim().slice(5));
    const { styles } = env;

    const treeIcon = styles['tree--' + meta.options.icon] || styles['tree--square'];

    if (tokens[idx].nesting === 1) {
      for (let i = idx;; i++) {
        if (
          tokens[i].type === 'inline' &&
          tokens[i + 2].type === 'bullet_list_open'
        ) {
          const checkbox = new Token('input', 'input', 0);
          checkbox.attrPush(['type', 'checkbox']);
          tokens[i + 1].hidden = tokens[i - 1].hidden = false;
          tokens[i + 1].tag = tokens[i - 1].tag = 'header';
          tokens.splice(i - 1, 0, checkbox);
          // step foward since a new token has just been inserted
          i++;
        } else if (tokens[i].type === 'container_tree_close') {
          return `<div class="${styles.tree} ${treeIcon}">`;
        }
      }
    }

    return '</div>';
  }
}];
