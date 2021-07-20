const container = require('markdown-it-container');
const { parsePipe } = require('../../../utils');

module.exports = [
  container,
  'tree',
  {
    render(tokens, idx, options, env, slf) {
      const meta = parsePipe('|' + tokens[idx].info.trim().slice(5));
      const { styles } = env;

      const treeIcon = styles['tree--' + meta.options.icon] || styles['tree--square'];

      if (tokens[idx].nesting === 1) {
        for (let i = idx; ; i++) {
          if (tokens[i].type === 'container_tree_close') {
            break;
          }
          if (tokens[i].type === 'inline' && tokens[i + 2].type === 'bullet_list_open') {
            tokens[i + 1].hidden = tokens[i - 1].hidden = false;
            tokens[i - 1].tag = tokens[i + 1].tag = 'summary';
            tokens[i - 2].tag = 'details';
            // find bullet_list_close to close the details
            let j = i + 2;
            while(true) {
              if (tokens[j].type === 'bullet_list_close') {
                tokens[j].tag = 'details';
                break;
              }
              j += 1;
            }
          }
        }
        // hide ul open
        tokens[idx + 1].hidden = true;
        return `<div class="${styles.tree} ${treeIcon}">`;
      } else {
        // hide ul close
        tokens[idx - 1].hidden = true;
        return '</div>';
      }
    },
  },
];
