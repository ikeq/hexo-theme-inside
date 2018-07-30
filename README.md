# Inside

[![build-img]][root]
[![release-img]][release]
[![license-img]](LICENSE)

A SPA, flat and clean theme for [Hexo] ❤️.

[中文文档](README_zh-Hans.md)

## Features

### Sub-page routes

For example, the directory structure looks like this:

```css
ROOT
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
Change `language` at site's configuration file to take effects.

```yml
language: en
# language: zh-Hans
# language: zh-Hant
# language: ja
```

### Comments

```yaml
comments:
  disqus:
    shortname: your_disqus_shortname
    autoload: true
```

Set `autoload` to `true` to auto load disqus, otherwise will show a button.

### Social Media

```yaml
# Try to sort by changing the order of the keys
sns:
  # `email` will fallback to `profile.email` if not specified
  email:
  # `feed` will fallback to `feed.path` of site if not specified
  # You may need to install hexo-generator-feed, see more at https://github.com/hexojs/hexo-generator-feed.
  feed:
  github:
  telegram:
  twitter:
  facebook:
  tumblr:
  instagram:
  dribbble:
  gplus:
  weibo:
  qq:
```

### Assets path

Prefix/Suffix post assets path with assets filter, useful for CDN settings.

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

### Google Analytics

```yaml
ga: UA-00000000-0
```

### Web App Manifest

Add a `manifest.json` file for your site.

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

 See [here][manifest] for more information.

### Meta Theme Color

By default, `#2a2b33` is used as the value of `theme-color`; if a thumbnail is set, the color of the first pixel of the thumbnail is extracted as `theme-color`.

**Note** this only works for **Chrome on Android**.

See [here][meta-theme-color] for more information.

### Sitemap

Add a `sitemap.xml` file for your site.

### Enhanced front matter

Inside extended the default front matter with the following properties used by itself:

- `author` author of the post
- `thumbnail` picture which shows on your post header
- `dropcap` capitalizes the first character

None of them are required.

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

### Site (`ROOT/_config.yml`)

Configure the site's `_config.yml` as follows.

```yaml
permalink: post/:title/index.html
```

### Theme (`themes/inside/_config.yml`)

```yaml
# Sidebar menu
menu:
  home: /
  # about: /about
  # links: /links

# Profile
profile:
  avatar: /avatar.jpg
  # Email address will be used for showing gravatar(https://en.gravatar.com) avatar if `avatar` is not specified.
  email: example@mail.com
  bio: Awesome guy.

# Social media
# Try to sort by changing the order of the keys
sns:
  # `email` will fallback to `profile.email` if not specified
  email:
  # `feed` will fallback to `feed.path` of site if not specified
  # You may need to install hexo-generator-feed, see more at https://github.com/hexojs/hexo-generator-feed.
  feed:
  github:
  telegram:
  twitter:
  facebook:
  tumblr:
  instagram:
  dribbble:
  gplus:
  weibo:
  qq:

footer:
  # If not defined, will show current year and author, eg: ©2018 • Superman
  copyright:

  # Set to false to hide Hexo link.
  powered: true
  # Set to false to hide theme info.
  theme: true

  # Custom text can be defined here.
  # custom: Hosted by <a target="_blank" rel="external nofollow" href="https://pages.coding.me"><b>Coding Pages</b></a>

# Post
post:
  per_page: 10
  # Table of content
  # Set to false to disable
  toc:
    # The depth of toc, default is 2, maximum to 4.
    # depth: 3
    # Showing index before toc, eg. 1.1 title
    index: true

### Pagination size
archive:
  per_page: 10
tag:
  per_page: 10
category:
  per_page: 10

# Favicon
# Default is `favicon.ico`
favicon: favicon.ico

# Comments
comments:
  # disqus:
    # shortname: your_disqus_shortname
    # Set to true to auto load disqus, otherwise will show a button
    # autoload: false

# Assets path
assets:
  # prefix: 'https://cdn.example.com'
  # suffix: '?m=webp&q=80'

# Web App Manifest
manifest:
  # short_name:
  # name:
  # start_url: /
  # theme_color: '#2a2b33'
  # background_color: '#2a2b33'
  # icons:
  #   - src: icon-194x194.png
  #     sizes: 194x194 512x512
  #     type: image/png
  #   - src: icon-144x144.png
  #     sizes: 144x144
  #     type: image/png

# Google analytics
# ga: UA-00000000-0
```

[root]: https://github.com/elmorec/hexo-theme-inside
[release]: https://github.com/elmorec/hexo-theme-inside/releases
[build-img]: https://img.shields.io/travis-ci/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square
[release-img]: https://img.shields.io/github/release/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square
[license-img]: https://img.shields.io/github/license/elmorec/hexo-theme-inside.svg?longCache=true&style=flat-square

[hexo]: https://hexo.io/
[hexo-generator-feed]: https://github.com/hexojs/hexo-generator-feed

[manifest]: https://www.w3.org/TR/appmanifest/
[meta-theme-color]: https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#meta_theme_color_for_chrome_and_opera
