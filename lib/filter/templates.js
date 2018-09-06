module.exports = function (locals) {
  const __ = this.theme.i18n.__(),
    { page, config } = locals,
    titleFn = {
      archives: p => __('title.archives'),
      categories: p => __('title.categories') + (p.name ? ` : ${p.name}` : ''),
      tags: p => __('title.tags') + (p.name ? ` : ${p.name}` : ''),
      page: p => p.title,
      posts: p => p.title,
      post: p => p.title,
    },
    title = titleFn[page.type] ? titleFn[page.type](page) : '';

  locals.title = title ? `${title} - ${config.title}` : config.title;

  return locals;
}
