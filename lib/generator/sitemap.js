module.exports = function (locals) {
  const urlFn = o => `<url><loc>${o.permalink}</loc><lastmod>${o.updated.toJSON()}</lastmod></url>`,
    urlset = [
      ...locals.pages.sort('-date').map(urlFn),
      ...locals.posts.sort('-date').filter(post => post.published).map(urlFn)
    ].join('');

  return [{
    path: 'sitemap.xml',
    data: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`
  }];
};
