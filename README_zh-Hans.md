# Inside

[![build-img]][travis] [![release-img]][releases] [![license-img]](LICENSE)

❤️ SPA, flat and clean theme for [Hexo].

## Summary

- [预览](#预览)
- [特色](#特色)
- [开始使用](#开始使用)
- [浏览器支持](#浏览器支持)
- [更新日志](#更新日志)
- [License](#license)

## 预览

- https://blog.oniuo.com
- https://blog.oniuo.com/post/inside-theme-showcase

## 特色

- SPA built with [angular]
- 自定义色调、背景、字体、暗色主题
- 自定义代码语法高亮
- 评论
  - [Disqus]
  - [LiveRe]
  - 以插件的形式支持大多数评论系统
- 搜索
- 增强的文章展示
  - 缩略图
  - 首字下沉
  - 文章图片点击放大
  - 优化的 table 展示（无头表格、长表格）
  - 目录
  - 版权声明
  - 打赏
- [PWA]
  - 沉浸式设计（限安卓手机 Chrome）
  - [manifest.json]
  - 离线支持 ([workbox])
- SEO
  - 内置 `sitemap.xml`
  - [Structured Data]
- 打印友好

## 开始使用

1\. 自行下载（[releases]），解压并重命名为 `inside`，然后将其放在 themes 目录。

2\. 配置 `HEXO/_config.yml` 如下：

```yml
theme: inside
```

3\. 主题配置请参阅 [documentation]。

## 浏览器支持

- Modern browser

## 更新日志

[releases]

## License

Licensed under [MIT](LICENSE).

[build-img]: https://img.shields.io/travis/ikeq/hexo-theme-inside.svg?longCache=true&style=flat-square
[release-img]: https://img.shields.io/github/release/ikeq/hexo-theme-inside.svg?longCache=true&style=flat-square
[license-img]: https://img.shields.io/github/license/ikeq/hexo-theme-inside.svg?longCache=true&style=flat-square

[angular]: https://angular.io
[hexo]: https://hexo.io/
[PWA]: https://developers.google.com/web/progressive-web-apps
[manifest.json]: https://developers.google.com/web/fundamentals/web-app-manifest/
[workbox]: https://developers.google.com/web/tools/workbox/
[Structured Data]: https://developers.google.com/search/docs/guides/intro-structured-data
[disqus]: https://disqus.com
[livere]: https://livere.com
[releases]: https://github.com/ikeq/hexo-theme-inside/releases
[travis]: https://travis-ci.org/ikeq/hexo-theme-inside
[documentation]: https://blog.oniuo.com/theme-inside
