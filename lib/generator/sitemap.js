const { getPagePath } = require('../utils');

module.exports = function (locals) {
  const url = this.config.url;
  const urlFn = (loc, lastmod) => `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`,
    urlset = [
      ...locals.pages.sort('-date').map(p => urlFn(`${url}/${getPagePath(p.source)}/`, p.updated.toJSON())),
      ...locals.posts.sort('-date').filter(post => post.published).map(p => urlFn(`${url}/post/${p.slug}/`, p.updated.toJSON()))
    ].join('');

  return [{
    path: 'sitemap.xml',
    data: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`
  }];
};
