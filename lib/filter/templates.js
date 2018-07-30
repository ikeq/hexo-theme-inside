module.exports = function (locals) {
  const __ = this.theme.i18n.__(),
    { page, config } = locals,
    titleFn = {
      archives: p => __('title.archive'),
      categories: p => __('title.category') + (p.name ? ` : ${p.name}` : ''),
      tags: p => __('title.tag') + (p.name ? ` : ${p.name}` : ''),
      page: p => p.title,
      posts: p => p.title,
      post: p => p.title,
    },
    title = titleFn[page.type] ? titleFn[page.type](page) : '';

  locals.title = title ? `${title} - ${config.title}` : config.title;

  // Override `locals.theme` with the unified `this.theme.config`
  locals.theme = this.theme.config;

  return locals;
}
