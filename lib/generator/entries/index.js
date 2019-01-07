const { base64, Pagination, localeId } = require('../../utils');
const urlFor = require('hexo/lib/plugins/helper/url_for');
const { date } = require('hexo/lib/plugins/helper/date');

module.exports = function (locals) {
  const theme = this.theme.config;
  const generationMeta = {
    html: { generateFn: ({ path, data }) => ({ path: path + '/index.html', data, layout: 'index' }) },
    json: { generateFn: ({ path, data }) => ({ path: 'api/' + base64(path) + '.json', data: JSON.stringify(data) }) },
  };
  const pagination = new Pagination(generationMeta);

  return [].concat.apply([], ['pages', 'posts', 'tags', 'categories', 'archives']
    .map(item => require('./' + item)({
      site: this.config,
      theme,
      hasComments: !!(theme.comments || theme.plugins && theme.plugins.comments),
      helpers: {
        urlFor: urlFor.bind(this),
        date: date.bind({ page: { lang: localeId(this.config.language) }, config: this.config }),
        generateJson: (...args) => args.map(generationMeta.json.generateFn),
        generateHtml: (...args) => args.map(generationMeta.html.generateFn),
        pagination
      },
      locals
    })));
};
