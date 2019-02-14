# Inside

[![build-img]]() [![release-img]][releases] [![license-img]](LICENSE)

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
- 自定义色调、背景
- 可嵌套的 page 路由
- 多语言 (i18n)
  - :cn: Simplified Chinese & Traditional Chinese
  - :us: English
  - :jp: Japanese
- 评论
  - [Disqus]
  - [LiveRe]
  - 以插件的形式支持大多数评论系统
- 文章图片 CDN 设置
- 增强的文章展示
  - 缩略图
  - 首字下沉
  - 文章图片点击放大
  - 优化的 table 展示（无头表格、长表格）
  - 目录
  - 版权声明
  - 打赏
- [PWA]
  - 动态更新的 `theme-color` meta 标签（通过提取缩略图像素值）
  - [manifest.json]
  - 离线支持 ([workbox])
- SEO
  - canonical link
  - 内置 `sitemap.xml`
  - [Structured Data]
  - Open Graph Meta Tags

## 开始使用

1\. 自行下载（[releases]）或通过 npm：

```bash
npm install hexo-theme-inside
```

2\. 配置 `HEXO/_config.yml` 如下：

```yml
permalink: post/:title/
```

3\. 主题配置见 [inside/_config.yml](_config.yml)，详细说明见[这里](https://blog.oniuo.com/post/inside-theme-configuration)。

## 浏览器支持

- Modern browser

## 更新日志

[releases]

## License

Licensed under [MIT](LICENSE).

[build-img]: https://img.shields.io/travis/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square
[release-img]: https://img.shields.io/github/release/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square
[license-img]: https://img.shields.io/github/license/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square

[angular]: https://angular.io
[hexo]: https://hexo.io/
[PWA]: https://developers.google.com/web/progressive-web-apps
[manifest.json]: https://developers.google.com/web/fundamentals/web-app-manifest/
[workbox]: https://developers.google.com/web/tools/workbox/
[Structured Data]: https://developers.google.com/search/docs/guides/intro-structured-data
[disqus]: https://disqus.com
[livere]: https://livere.com
[releases]: https://github.com/elmorec/hexo-theme-inside/releases
