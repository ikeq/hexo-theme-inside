module.exports = function (locals) {
  // It seems `locals.__()` has tricks sometimes.
  const i18n = this.theme.i18n.__();
  const { page, config } = locals;

  let title = '';

  if (page.archive)
    title = i18n('title.archive');
  else if (page.category)
    title = i18n('title.category') + (page.category === true ? '' : ` : ${page.category}`);
  else if (page.tag)
    title = i18n('title.tag') + (page.tag === true ? '' : ` : ${page.tag}`);
  else if (page.__page || page.__post)
    title = page.title;

  locals.title = title ? `${title} - ${config.title}` : config.title;
  locals._configScript = this.theme._configScript;

  return locals;
}
