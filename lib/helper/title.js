module.exports = function (page) {
  return page.title ? page.title + ' - ' + this.config.title : this.config.title;
}