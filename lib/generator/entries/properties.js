const listProps = ['title', 'date', 'link'];

module.exports = {
  archive: listProps,
  categoryPosts: listProps,
  tagPosts: listProps,
  page: ['title', 'date', 'updated', 'content', 'link', 'comments', 'dropcap', 'plink', 'toc', 'reward', 'copyright', 'meta'],
  post: ['title', 'date', 'author', 'thumbnail', 'color', 'link', 'comments', 'dropcap', 'tags', 'categories', 'updated', 'content', 'prev', 'next', 'plink', 'toc', 'reward', 'copyright'],
  postList: ['title', 'date', 'author', 'thumbnail', 'color', 'excerpt', 'link', 'tags', 'categories'],
  search: ['title', 'date', 'author', 'updated', 'content', 'thumbnail', 'color', 'plink']
}
