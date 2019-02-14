const listProps = ['title', 'date', 'slug'];

module.exports = {
  archive: listProps,
  categoryPosts: listProps,
  tagPosts: listProps,
  page: ['title', 'date', 'updated', 'content', 'slug', 'comments', 'dropcap', 'link', 'toc', 'reward', 'copyright', 'meta'],
  post: ['title', 'date', 'author', 'thumbnail', 'color', 'slug', 'comments', 'dropcap', 'tags', 'categories', 'updated', 'content', 'prev', 'next', 'link', 'toc', 'reward', 'copyright'],
  postList: ['title', 'date', 'author', 'thumbnail', 'color', 'excerpt', 'slug', 'tags', 'categories']
}
