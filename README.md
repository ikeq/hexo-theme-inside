# Inside

[![build-img]][root]
[![license-img]](LICENSE)

A flat and clean theme for [Hexo] ❤️.

## Features

### Custom page routes (also support sub page)

Adding routes for hexo pages (only for hexo pages), also support sub pages.

```yaml
page:
  - about
  - links
  # sub page example
  - awesome-stuff:
    - chapter-1
    - chapter-2
  - amazing-stuff:
    - chaper-1:
      - part-1
      - part-2
    - chapter-2
```

The directory structure looks like this:

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
- [/about]()
- [/links]()
- [/awesome-stuff]()
- [/awesome-stuff/chapter-1]()
- [/awesome-stuff/chapter-2]()
- [/amazing-stuff]()
- [/awesome-stuff/chapter-1]()
- [/awesome-stuff/chapter-1/part-1]()
- [/awesome-stuff/chapter-1/part-2]()

Other built-in routes are as follows:
- home: [/]()
- archives: [/archives]()
- tags: [/tags]()
- categories: [/categories]()
- 404: [/404]()

### Multiple languages
- :cn: Simplified Chinese & Traditional Chinese
- :us: English
- :jp: Japanese

Support 3 languages for now, default language is English.

```yml
language: en
# language: zh-Hans
# language: zh-Hant
# language: ja
```

### Disqus comments.

```yaml
disqus:
  shortname: your_disqus_shortname
  autoload: true
```

Set `autoload` to `true` to auto load disqus, otherwise will display a button.

### Social Media
```yaml
sns:
  github: your-github-url
  twitter: your-twitter-url
  gplus: your-google-plus-url
  weibo: your-weibo-url
```

### Feed.

1. Install [hexo-generator-feed]:
   ```bash
   npm install hexo-generator-feed --save
   ```
2. Config site's `_config.yml` as follows:
   ```yaml
   feed:
     path: atom.xml
   ```

### Assets path
Prefix/Suffix post assets path with assets filter. Useful for resource cdn.
```yaml
assets:
  prefix: 'https://cdn.example.com'
  suffix: '?m=webp&q=80'
```
For example, `![cat](images/cat.gif)` will convert to `![cat](https://cdn.example.com/images/cat.gif?m=webp&q=80)`


### Google Analytics
```yaml
ga: UA-00000000-0
```


### Meta Theme Color

> To specify the theme color for Chrome on Android, use the [meta theme color][meta-theme-color].

Inside changes the meta theme color automatically by extracts the color from the thumbnail of each post.

[![meta-theme-color-img]][meta-theme-color-img-origin]

Note this only works for **Chrome on Android**.

## Enhanced front matter
Inside extended the default front matter of your post with the following properties:
- `author` author of the post, optional
- `thumbnail` picture which shows on your post header
- `dropcap` capitalizes the first character, optional

For example:
```
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

### Site's `_config.yml`

For best experience, make sure the following default generators have been **removed** from site's `package.json`.

- [hexo-generator-archive]
- [hexo-generator-category]
- [hexo-generator-tag]

And configure the site's `_config.yml` as follows.

```yaml
permalink: post/:title/index.html
default_layout: index
pagination_dir: page
```

### Theme's `_config.yml`

Full configuration of theme's `_config.yml` can be found [here](_config.yml).


[meta-theme-color]: https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#meta_theme_color_for_chrome_and_opera
[hexo-generator-archive]: https://github.com/hexojs/hexo-generator-archive
[hexo-generator-category]: https://github.com/hexojs/hexo-generator-category
[hexo-generator-index]: https://github.com/hexojs/hexo-generator-index
[hexo-generator-tag]: https://github.com/hexojs/hexo-generator-tag
[hexo-generator-feed]: https://github.com/hexojs/hexo-generator-feed
[hexo-renderer-ejs]: https://github.com/hexojs/hexo-renderer-ejs
[hexo-renderer-marked]: https://github.com/hexojs/hexo-renderer-marked

[root]: https://github.com/elmorec/hexo-theme-inside
[build-img]: https://travis-ci.org/elmorec/hexo-theme-inside.svg?branch=master
[license-img]: https://img.shields.io/dub/l/vibe-d.svg
[hexo]: https://hexo.io/
[meta-theme-color-img]: https://developers.google.com/web/updates/images/2014/11/theme-color-ss.png
[meta-theme-color-img-origin]: https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android