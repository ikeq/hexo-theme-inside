const listProps = ['title', 'date', 'slug'];

module.exports = {
  archive: listProps,
  categoryPosts: listProps,
  tagPosts: listProps,
  page: ['title', 'date', 'updated', 'content', 'slug', 'comments', 'dropcap', 'link', 'reward'],
  post: ['title', 'date', 'author', 'thumbnail', 'slug', 'comments', 'dropcap', 'tags', 'categories', 'updated', 'content', 'prev', 'next', 'link', 'toc', 'copyright', 'reward'],
  postList: ['title', 'date', 'author', 'thumbnail', 'excerpt', 'slug', 'tags', 'categories']
}
