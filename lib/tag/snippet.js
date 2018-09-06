const wrappers = {
  js: content => `<script>(function(){${content}})();</script>`
};

/**
 * Executable code snippet
 *
 * Pure js
 *   {% snippet js %}
 *   alert('hello world')
 *   {% endsnippet %}
 *
 * Universal usage
 *   {% snippet %}
 *   <h1 id="proverb"></h1>
 *   <script>
 *     fetch('/awesomeapi')
 *       .then(function(res) {return res.text()})
 *       .then(function(text) {
 *         var el = document.getElementById('proverb');
 *         if (el) el.innerHTML = text;
 *       })
 *   <script>
 *   {% endsnippet %}
 */
module.exports = function(args, content) {
  const type = args[0];
  content = type && wrappers[type] ? wrappers[type](content) : content;

  return `<div class="is-snippet">${content}</div>`;
}
