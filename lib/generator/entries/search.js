const { flattenDeep, flatten } = require('lodash');
const { pick } = require('../../utils');
const { search: searchProps } = require('./properties');
const { stripHTML } = require('hexo-util');

module.exports = function ({ theme, locals, helpers }) {
  const config = theme.search;

  return flattenDeep([
    helpers.generateHtml({
      path: 'search',
      data: { type: 'search' }
    }),

    config.range ? helpers.generateJson({
      path: 'search',
      data: flatten(config.range.map(key =>
        locals[key].filter(post => post.published || post.type !== 'post').sort('-date').toArray().map(post => {
          const ret = pick(post, searchProps)
          ret.content = stripHTML(
            ret.content
              .replace(/<style(.*?)\<\/style\>/g, '')
              .replace(/<script(.*?)\<\/script\>/g, '')
          )

          return ret
        })
      ))
    }) : [],
  ]);
};
