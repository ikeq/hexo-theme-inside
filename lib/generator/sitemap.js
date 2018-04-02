module.exports = function (locals) {
  let host = this.config.url.endsWith('/') ? this.config.url : (this.config.url + '/'),
    urlFn = o => `<url><loc>${host + (o.slug || o.title || '')}</loc><lastmod>${o.updated.toJSON()}</lastmod></url>`,
    posts = locals.posts.sort('-date').filter(post => post.published).map(urlFn),
    pages = locals.pages.sort('-date').map(urlFn),

    urlset = [...pages, ...posts].join('');

  return [{
    path: 'sitemap.xml',
    data: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`
  }];
};