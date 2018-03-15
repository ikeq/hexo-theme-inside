const { pick, apiPagination } = require('../../utils');
const { archive: archiveProps } = require('./properties');

module.exports = function (locals) {
  const posts = locals.posts.sort('-date').filter(post => post.published).map(post => pick(post, archiveProps));

  if (!posts.length) return [];

  const pagedPosts = apiPagination(posts, {
    type: 'archive',
    pageSize: this.theme.config.archive && this.theme.config.archive.per_page
  });

  return pagedPosts.map(posts => {
    posts.data.data = classify(posts.data.data);
    return posts;
  });
}

/**
 * classify posts with `year` and `month`
 *
 * @param {Post[]} posts
 */
function classify(posts) {
  if (!posts.length) return [];

  let data = {};

  posts.forEach((post, i) => {
    const date = post.date.clone(),
      year = date.year(),
      month = date.month() + 1;

    if (data[year]) {
      if (data[year][month]) data[year][month].push(post)
      else data[year][month] = [post]
    } else {
      data[year] = {
        [month]: [post]
      }
    }

  });

  data = Object.keys(data).sort(desc).map(year => {
    return {
      year: year,
      months: Object.keys(data[year]).sort(desc).map(month => {
        return {
          month: month,
          entries: data[year][month]
        }
      })
    }
  })

  return data;
}

function desc(a, b) {
  return parseInt(a) < parseInt(b) ? 1 : -1;
}