const { base64, Pagination } = require('../../utils');
const urlFor = require('hexo/lib/plugins/helper/url_for');

module.exports = function (locals) {
  const generationMeta = {
    html: { generateFn: ({ path, data }) => ({ path: path + '/index.html', data, layout: 'index' }) },
    json: { generateFn: ({ path, data }) => ({ path: 'api/' + base64(path) + '.json', data: JSON.stringify(data) }) },
  };
  const pagination = new Pagination(generationMeta);

  return [].concat.apply([], ['pages', 'posts', 'tags', 'categories', 'archives']
    .map(item => require('./' + item)({
      site: this.cnfig,
      theme: this.theme.config,
      helpers: {
        urlFor: urlFor.bind(this),
        generateJson: (...args) => args.map(generationMeta.json.generateFn),
        generateHtml: (...args) => args.map(generationMeta.html.generateFn),
        pagination
      },
      locals
    })));
};
