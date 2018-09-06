const listProps = ['title', 'date', 'slug'];

module.exports = {
  archive: listProps,
  categoryPosts: listProps,
  tagPosts: listProps,
  page: ['title', 'date', 'updated', 'content', 'slug', 'comments', 'dropcap', 'color', 'link'],
  post: ['title', 'date', 'author', 'thumbnail', 'excerpt', 'slug', 'comments', 'dropcap', 'tags', 'categories', 'updated', 'content', 'prev', 'next', 'color', 'link', 'toc', 'copyright'],
  postList: ['title', 'date', 'author', 'thumbnail', 'excerpt', 'slug', 'tags', 'categories']
}
