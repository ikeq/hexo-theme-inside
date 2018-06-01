# Inside

[![build-img]][root]
[![release-img]][release]
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

- [/about]('')
- [/links]('')
- [/awesome-stuff]('')
- [/awesome-stuff/chapter-1]('')
- [/awesome-stuff/chapter-2]('')
- [/amazing-stuff]('')
- [/awesome-stuff/chapter-1]('')
- [/awesome-stuff/chapter-1/part-1]('')
- [/awesome-stuff/chapter-1/part-2]('')

Other built-in routes are as follows:

- home: [/]('')
- archives: [/archives]('')
- tags: [/tags]('')
- categories: [/categories]('')
- 404: [/404]('')

### Multiple languages

- :cn: Simplified Chinese & Traditional Chinese
- :us: English
- :jp: Japanese

Support 3 languages for now, default language is English.

Change `language` at site's `_config.yml` to take effects.

```yml
language: en
# language: zh-Hans
# language: zh-Hant
# language: ja
```

### Disqus comments

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

### Feed

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

### Web App Manifest

> The web app manifest is a simple JSON file that gives you, the developer, the ability to control how your app appears to the user in the areas that they would expect to see apps (for example the mobile home screen), direct what the user can launch and more importantly how they can launch it. See [here][manifest] for more information.

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

### Meta Theme Color

> To specify the theme color for Chrome on Android, use the meta theme color.

See [here][meta-theme-color] for more information.

Inside changes the meta theme color dynamicly by automatically extracting the color from the thumbnail of each post.

Note this only works for **Chrome on Android**.

### Sitemap

### Enhanced front matter

Inside extended the default front matter of your posts with the following properties:

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

[root]: https://github.com/elmorec/hexo-theme-inside
[release]: https://github.com/elmorec/hexo-theme-inside/releases
[build-img]: https://travis-ci.org/elmorec/hexo-theme-inside.svg?branch=master
[release-img]: https://img.shields.io/github/release/elmorec/hexo-theme-inside.svg
[license-img]: https://img.shields.io/github/license/elmorec/hexo-theme-inside.svg

[hexo]: https://hexo.io/
[hexo-generator-archive]: https://github.com/hexojs/hexo-generator-archive
[hexo-generator-category]: https://github.com/hexojs/hexo-generator-category
[hexo-generator-index]: https://github.com/hexojs/hexo-generator-index
[hexo-generator-tag]: https://github.com/hexojs/hexo-generator-tag
[hexo-generator-feed]: https://github.com/hexojs/hexo-generator-feed
[hexo-renderer-ejs]: https://github.com/hexojs/hexo-renderer-ejs
[hexo-renderer-marked]: https://github.com/hexojs/hexo-renderer-marked

[manifest]: https://www.w3.org/TR/appmanifest/
[meta-theme-color]: https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#meta_theme_color_for_chrome_and_opera
