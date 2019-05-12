# Inside

[![build-img]]() [![release-img]][releases] [![license-img]](LICENSE)

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
- Custom accent color, background and fonts
- Sub-page routes
- Internationalization (i18n)
  - :cn: Simplified Chinese & Traditional Chinese
  - :us: English
  - :jp: Japanese
- Search
- Comments
  - [Disqus]
  - [LiveRe]
  - Support most comment systems as plugin
- Content image CDN
- Enhanced content display
  - Thumbnail
  - Dropcap
  - Zoomable images
  - Optimized table display (headless table, long table)
  - Table of content
  - Copyright notice
  - Reward
- [PWA]
  - Dynamically updated `theme-color` meta tag (by extracting thumbnail pixel values)
  - [manifest.json]
  - Offline support ([workbox])
- SEO
  - canonical link
  - built-in `sitemap.xml`
  - [Structured Data]
  - Open Graph Meta Tags

## Quick start

1\. Download the latest version from [releases], unpack and rename to `inside`, then put it in the themes directory.

2\. Config `HEXO/_config.yml` as follows:

```yml
permalink: post/:title/
theme: inside
```

3\. See [inside/_config.yml](_config.yml) for theme configuration.

## Browser Support

- Modern browser

## Changelog

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
