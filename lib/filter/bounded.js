const cheerio = require('cheerio');
const bounded = '<div class="bounded"></div>';
const table = '<div class="table"></div>';

module.exports = function (data) {
  const $ = cheerio.load(data.content, { decodeEntities: false });

  $.root().children('table')
    // remove empty thead
    .each(function () {
      const $thead = $(this).children('thead');
      if (!$thead.find('th').map((_,el) => $(el).html()).get().join('').replace(/\&nbsp;/g, '').trim()) $thead.remove();
    })
    .wrap(bounded).wrap(table);

  data.content = $.html();
};
