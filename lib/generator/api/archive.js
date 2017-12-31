const { pick } = require('../../utils'),
  archiveProps = ['title', 'date', 'updated', 'slug', 'tags', 'author'];

module.exports = function (locals) {
  let posts = locals.posts.sort('-date').filter(post => post.published).map(post => pick(post, archiveProps));

  if (!posts.length) return [];

  let data = {};

  posts.forEach((post, i) => {
    let date = post.date.clone(),
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

  return [{
    index: '_',
    type: 'archive',
    data: data
  }]
}

function desc(a, b) {
  return parseInt(a) < parseInt(b) ? 1 : -1;
}