const url = require('url');
const supportedSocials = ['Facebook', 'Twitter', 'Google+', 'Instagram', 'YouTube', 'LinkedIn', 'Myspace', 'Pinterest', 'SoundCloud', 'Tumblr'];
let avatar = '';
let website = null;
let person = null;
let org = null;

module.exports = function (page) {
  const config = this.config;
  const theme = this.theme;
  const lang = config.language || 'en';
  const datum = [];

  if (!avatar) avatar = url.resolve(config.url, this.url_for(theme.profile.avatar));

  if (!person) {
    person = {
      "@type": "Person",
      "name": config.author,
      "description": theme.profile.bio || config.description,
      "image": avatar
    };

    // https://developers.google.com/search/docs/data-types/social-profile
    const socials = supportedSocials.map(social => theme.sns[social.toLowerCase()]).filter(i => i);
    if (socials.length) person.sameAs = supportedSocials.map(social => theme.sns[social.toLowerCase()]).filter(i => i);
  }

  if (!org) {
    org = {
      "@type": "Organization",
      "name": config.title,
      "logo": {
        "@type": "ImageObject",
        "url": avatar
      }
    };
  }

  if (!website) {
    website = {
      "@context": "http://schema.org",
      "@type": "WebSite",
      "publisher": person,
      "url": config.url,
      "image": avatar,
      "description": config.description,
      "author": person,
      "inLanguage": {
        "@type": "Language",
        "alternateName": lang
      }
    };
  }
  datum.push(website);

  // https://developers.google.com/search/docs/data-types/article
  if (page.type === 'post') {
    const category = page.categories.toArray()[0];
    const article = {
      "@context": "http://schema.org",
      "@type": "Article",
      "articleSection": category ? category.name : '',
      "url": page.permalink,
      "headline": page.title,
      "image": page.thumbnail || avatar,
      "datePublished": page.date,
      "dateModified": page.updated,
      "keywords": page.tags ? page.tags.map(t => t.name).join(',') : '',
      "description": page.excerpt ? this.strip_html(page.excerpt) : config.description,
      "publisher": org,
      "author": person,
      "inLanguage": {
        "@type": "Language",
        "alternateName": lang
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": page.permalink
      }
    };
    if (page.thumbnail) article.thumbnailUrl = page.thumbnail;
    datum.push(article);
  };

  return '<script type="application/ld+json">' + JSON.stringify(datum) + '</script>';
}
