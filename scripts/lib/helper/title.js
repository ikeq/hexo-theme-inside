module.exports = function (page) {
  let hexo = this,
    title = page.title;

  if (page.__page)
    title = title.substring(0, 1).toUpperCase() + title.substring(1, title.length);
  else if (page.archive)
    title = 'Archives';
  else if (page.tag)
    title = 'Tag: ' + page.tag;

  title = title ? title + ' - ' + hexo.config.title : hexo.config.title;

  return title;
}