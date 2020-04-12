const container = require('markdown-it-container');

module.exports = [container, 'timeline', {
  render(tokens, idx, options, env, slf) {
    const { styles } = env;

    return tokens[idx].nesting === 1
      ? `<div class="${styles.timeline}">`
      : '</div>';
  }
}];
