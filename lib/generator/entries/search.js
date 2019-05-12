const { flattenDeep, flatten } = require('lodash');
const { pick, published } = require('../../utils');
const { search: searchProps } = require('./properties');
const { stripHTML } = require('hexo-util');

module.exports = function ({ theme, locals, helpers }) {
  const config = theme.search;

  if (!config) return

  return flattenDeep([
    config.page ? helpers.generateHtml({
      path: 'search',
      data: { type: 'search' }
    }) : [],

    config.adapter.range ? helpers.generateJson({
      path: 'search',
      data: flatten(config.adapter.range.map(key => locals[key + 's'].filter(published).sort('-date').toArray()))
        .slice(0, config.limit)
        .map(post => {
          const ret = pick(post, searchProps)
          ret.content = stripHTML(
            ret.content
              .replace(/<style(.*?)\<\/style\>/g, '')
              .replace(/<script(.*?)\<\/script\>/g, '')
          )

          return ret
        })
    }) : [],
  ]);
};
