const { pick, localeId, visible } = require('../../utils');
const { archive: archiveProps } = require('./properties');

module.exports = function ({ site, theme, locals, helpers }) {
  const posts = locals.posts.filter(visible).map(pick(archiveProps));
  const config = theme.archive;
  const dateHelper = helpers.date.bind({ page: { lang: localeId(site.language, true) }, config })

  if (!posts.length) return [];

  return helpers.pagination.apply(posts, { perPage: config.per_page, id: 'archives' }, [
    { type: 'json', dataFn: classify },
    { type: 'html', extend: { type: 'archives' } },
  ]).flat(Infinity);

  /**
   * Classify posts with `year` and `month`
   *
   * @param {object} data
   * @returns {data}
   */
  function classify(data) {
    const posts = data.data;

    if (!posts.length) return [];

    const desc = (a, b) => parseInt(a) < parseInt(b) ? 1 : -1;
    const cfyPosts = {};

    posts.forEach(post => {
      const date = post.date.clone(),
        year = date.year(),
        month = date.month() + 1;

      if (cfyPosts[year]) {
        if (cfyPosts[year][month]) cfyPosts[year][month].push(post)
        else cfyPosts[year][month] = [post]
      } else {
        cfyPosts[year] = {
          [month]: [post]
        }
      }

    });

    data.data = Object.keys(cfyPosts).sort(desc).map(year => {
      return {
        year: year,
        months: Object.keys(cfyPosts[year]).sort(desc).map(month => {
          return {
            month: dateHelper(month, 'MMM'),
            entries: cfyPosts[year][month]
          }
        })
      }
    })

    return data;
  }
}
