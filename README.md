# Inside

[![build-img]][travis] [![release-img]][releases] [![license-img]](LICENSE)

❤️ SPA, flat and clean theme for [Hexo].

[中文文档](README_zh-Hans.md)

## Summary

- [Preview](#preview)
- [Features](#features)
- [Quick start](#quick-start)
- [Changelog](#changelog)
- [License](#license)

## Preview

- https://blog.oniuo.com
- https://blog.oniuo.com/post/inside-theme-showcase

## Features

- SPA built with [angular]
- Custom accent color, background, fonts, dark mode
- Custom code syntax highlighting
- Sub-page
- Search
- Comments
  - [Disqus]
  - [LiveRe]
  - Support most comment systems as plugin
- Enhanced content display
  - Thumbnail
  - Dropcap
  - Zoomable images
  - Optimized table display (headless table, long table)
  - Table of content
  - Copyright notice
  - Reward
- [PWA]
  - Immersive design (Chrome on Android)
  - [manifest.json]
  - Offline support ([workbox])
- SEO
  - Built-in `sitemap.xml`
  - [Structured Data]
- Print friendly

## Quick start

1\. Download the latest version from [releases], unpack and rename to `inside`, then put it in the themes directory.

2\. Config `HEXO/_config.yml` as follows:

```yml
permalink: post/:title/
theme: inside
```

3\. Read [documentation] to configure the theme.

## Browser Support

- Modern browser

## Changelog

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
