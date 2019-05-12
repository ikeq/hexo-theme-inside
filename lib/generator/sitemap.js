const { published } = require('../utils');

module.exports = function (locals) {
  const urlFn = ({ plink, updated }) => `<url><loc>${plink}</loc><lastmod>${updated.toJSON()}</lastmod></url>`,
    urlset = [
      ...locals.posts.sort('-date').toArray(),
      ...locals.pages.sort('-date').toArray()
    ].filter(published).map(urlFn).join('');

  return [{
    path: 'sitemap.xml',
    data: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`
  }];
};
