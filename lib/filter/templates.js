let locale, configTitle, titleFn;

module.exports = function (locals) {
  if (titleFn === undefined) {
    locale = this.theme.i18n.get(locals.config.language);
    configTitle = locals.config.title;
    titleFn = {
      archives: p => locale['title.archives'],
      categories: p => locale['title.categories'] + (p.name ? ` : ${p.name}` : ''),
      tags: p => locale['title.tags'] + (p.name ? ` : ${p.name}` : ''),
      page: p => p.title,
      posts: p => p.title,
      post: p => p.title,
    };
  }

  const { page } = locals;
  const title = titleFn[page.type] ? titleFn[page.type](page) : '';

  locals.title = title ? `${title} - ${configTitle}` : configTitle;

  return locals;
}
