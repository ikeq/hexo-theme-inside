# Inside

[![build-img]]() [![release-img]][releases] [![license-img]](LICENSE)

A SPA, flat and clean theme for [Hexo] ❤️.

[中文文档](README_zh-Hans.md)

## Summary

- [Preview](#preview)
- [Features](#features)
- [Quick start](#quick-start)
- [Changelog](#changelog)
- [License](#license)

## Preview

- https://blog.oniuo.com

## Features

- SPA built with [angular]
- Sub-page routes
- Internationalization (i18n)
  - :cn: Simplified Chinese & Traditional Chinese
  - :us: English
  - :jp: Japanese
- Built-in `archives`、`tags`、`categories` pages
- Comments ([Disqus])
- Rich SNS icons
- Gravatar
- Article image CDN
- Enhanced article display
  - Thumbnail
  - Dropcap
  - Optimized table display (headless table, long table)
  - Executable `<script>` tag
    - Pre-processing with babelify and uglify (optional)
  - Table of content
  - License notice
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
- Google Analytics

## Quick start

1\. Download the latest version here: [releases], or via npm：

```bash
npm install hexo-theme-inside
```

2\. See [_config.yml](_config.yml) for full configuration.

## Browser Support

- Modern browser

## Changelog

[releases]

## License

Licensed under [MIT](LICENSE).

[build-img]: https://img.shields.io/travis-ci/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square
[release-img]: https://img.shields.io/github/release/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square
[license-img]: https://img.shields.io/github/license/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square

[angular]: https://angular.io
[hexo]: https://hexo.io/
[PWA]: https://developers.google.com/web/progressive-web-apps
[manifest.json]: https://developers.google.com/web/fundamentals/web-app-manifest/
[workbox]: https://developers.google.com/web/tools/workbox/
[Structured Data]: https://developers.google.com/search/docs/guides/intro-structured-data
[disqus]: https://disqus.com
[releases]: https://github.com/elmorec/hexo-theme-inside/releases
