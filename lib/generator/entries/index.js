const { base64, Pagination } = require('../../utils');
const urlFor = require('hexo/lib/plugins/helper/url_for');

module.exports = function (locals) {
  const theme = this.theme.config;
  const generationMeta = {
    html: { generateFn: ({ path, data }) => ({ path: path + '/index.html', data, layout: 'index' }) },
    json: { generateFn: ({ path, data }) => ({ path: theme.data_dir + '/' + base64(path) + '.json', data: JSON.stringify(data) }) },
  };
  const pagination = new Pagination(generationMeta);

  return [].concat.apply([], ['pages', 'posts', 'tags', 'categories', 'archives', 'search']
    .map(item => require('./' + item)({
      site: this.config, theme, locals,
      helpers: {
        urlFor: urlFor.bind(this),
        generateJson: (...args) => args.map(generationMeta.json.generateFn),
        generateHtml: (...args) => args.map(generationMeta.html.generateFn),
        pagination
      },
    })));
};
