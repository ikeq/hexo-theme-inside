const cheerio = require('cheerio');
const bounded = '<div class="bounded"></div>';
const table = '<div class="table"></div>';

module.exports = function (data) {
  const $ = cheerio.load(data.content, { decodeEntities: false });

  $.root().children('table').wrap(bounded).wrap(table);

  data.content = $.html();
};
