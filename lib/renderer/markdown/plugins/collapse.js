const container = require('markdown-it-container');
const { parsePipe } = require('../../../utils');

module.exports = [container, 'collapse', {
  render(tokens, idx, options, env, slf) {
    const meta = parsePipe(tokens[idx].info.trim().slice(9));

    return tokens[idx].nesting === 1
      ? `<details><summary>${meta.value}</summary>`
      : '</details>';
  }
}];
