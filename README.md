# Inside

[![build-img]][root] [![release-img]][release] [![license-img]](LICENSE)

A SPA, flat and clean theme for [Hexo] ❤️.

[中文文档](README_zh-Hans.md)

## Features

### Sub-page routes

For example, the directory structure looks like this:

```css
HEXO
  |-source
    |-about
      |-index.md
    |-links
      |-index.md
    |-awesome-stuff
      |-index.md
      |-chapter-1.md
      |-chapter-2.md
    |-amazing-stuff
      |-index.md
      |-chapter-1
        |-index.md
        |-part-1.md
        |-part-2.md
```

And urls will be:

- [/about]('') `about/index.md`
- [/awesome-stuff]('') `awesome-stuff/index.md`
- [/awesome-stuff/chapter-1]('') `awesome-stuff/chapter-1.md`
- [/awesome-stuff/chapter-2]('') `awesome-stuff/chapter-2.md`
- [/amazing-stuff]('') `amazing-stuff/index.md`
- [/amazing-stuff/chapter-1]('') `amazing-stuff/chapter-1/index.md`
- [/amazing-stuff/chapter-1/part-1]('') `amazing-stuff/chapter-1/part-1.md`
- [/amazing-stuff/chapter-1/part-2]('') `amazing-stuff/chapter-1/part-2.md`

Other built-in routes are as follows:

- home: [/]('')
- archives: [/archives]('')
- tags: [/tags]('')
- categories: [/categories]('')
- 404: [/404]('')

Routes can be configured at site's sidebar directly, for example:

```yml
menu:
  home: /
  about: /about
  Awesome Stuff: /awesome-stuff
  Amazing Stuff: /amazing-stuff
  Just Kidding: /404
```

### Multiple languages

- :cn: Simplified Chinese & Traditional Chinese
- :us: English
- :jp: Japanese

Support 3 languages for now, default is English.
Change `language` at `HEXO/_config.yaml` to take effects.

```yml
language: en
# language: zh-Hans
# language: zh-Hant
# language: ja
```

### Comments (disqus)

```yaml
comments:
  disqus:
    shortname: your_disqus_shortname
    autoload: true
```

Set `autoload` to `true` to enable auto load, otherwise will show a button.

### Social Media

```yaml
sns:
  email:
  feed:
  github:
  twitter:
  facebook:
  google+:
  instagram:
  tumblr:
  dribbble:
  telegram:
  youtube:
  hangouts:
  linkedin:
  pinterest:
  soundcloud:
  myspace:
  weibo:
  qq:
```

### Assets path

Prefix/Suffix post images path with assets filter, useful for CDN settings.

```yaml
assets:
  prefix: 'https://cdn.example.com'
  suffix: '?m=webp&q=80'
```

For example

```markdown
![cat](images/cat.gif)
```

will convert to:

```html
<img src="https://cdn.example.com/images/cat.gif?m=webp&q=80" alt="cat">
```

### PWA

#### Web App Manifest

Add a `manifest.json` for your site.

```yaml
manifest:
  short_name:
  name:
  start_url: /
  theme_color: '#2a2b33'
  background_color: '#2a2b33'
  icons:
    - src: icon-194x194.png
      sizes: 194x194 512x512
      type: image/png
    - src: icon-144x144.png
      sizes: 144x144
      type: image/png
```

See [manifest] for more information.

#### Offline cache

Uses Workbox for offline support

```yaml
workbox:
  cdn: https://storage.googleapis.com/workbox-cdn/releases/3.3.0/workbox-sw.js
  expire: 4
  name: sw.js
  rules:
    - name: jsdelivery
      strategy: staleWhileRevalidate
      regex: https://cdn\\.jsdelivr\\.net
    - name: gtm
      strategy: staleWhileRevalidate
      regex: https://www\\.googletagmanager\\.com
```

See [workbox] for more information.

#### Meta Theme Color

By default, `#2a2b33` is used as the value of `theme-color`; if a thumbnail is set, the color of the first pixel of the thumbnail is extracted as `theme-color`.

**Note** this only works for **Chrome on Android**.

See [theme-color][meta-theme-color] for more information.

### SEO

#### Sitemap

Add a `sitemap.xml` for your site.

#### Structured Data

```yaml
seo:
  structured_data: true
```

See [Structured Data](https://developers.google.com/search/docs/guides/intro-structured-data) for more information.

### Enhanced front matter

Inside extended the default front matter with the following properties used by itself:

- `author` author of the post, optional
- `thumbnail` picture which shows on your post header, optional
- `dropcap` capitalizes the first character, optional

For example:

```markdown
---
title: You've got to find what you love
date: 2005-06-15
author: Jobs
tags:
 - people
categories:
 - articles
thumbnail: images/people/jobs.jpg
dropcap: true
---
```

## Configuration

### Site (HEXO/_config.yml)

Configure site's `_config.yml` as follows.

```yaml
permalink: post/:title/
```

### Theme (HEXO/themes/inside/_config.yml)

Full configuration can be found [here](_config.yml).

[root]: https://github.com/elmorec/hexo-theme-inside
[release]: https://github.com/elmorec/hexo-theme-inside/releases
[build-img]: https://img.shields.io/travis-ci/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square
[release-img]: https://img.shields.io/github/release/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square
[license-img]: https://img.shields.io/github/license/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square

[hexo]: https://hexo.io/
[hexo-generator-feed]: https://github.com/hexojs/hexo-generator-feed

[manifest]: https://www.w3.org/TR/appmanifest/
[workbox]: https://developers.google.com/web/tools/workbox/
[meta-theme-color]: https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#meta_theme_color_for_chrome_and_opera
