# Inside

[![build-img]][root]
[![release-img]][release]
[![license-img]](LICENSE)

SPA、扁平、干净的 hexo 主题 ❤️。

## 特色

### 嵌套的 page 路由

例如 page 这么写：

```css
ROOT
  |-source
    |-_posts
      ...
    |-about
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

路由会是这样：

- [/about]('') `about/index.md`
- [/awesome-stuff]('') `awesome-stuff/index.md`
- [/awesome-stuff/chapter-1]('') `awesome-stuff/chapter-1.md`
- [/awesome-stuff/chapter-2]('') `awesome-stuff/chapter-2.md`
- [/amazing-stuff]('') `amazing-stuff/index.md`
- [/amazing-stuff/chapter-1]('') `amazing-stuff/chapter-1/index.md`
- [/amazing-stuff/chapter-1/part-1]('') `amazing-stuff/chapter-1/part-1.md`
- [/amazing-stuff/chapter-1/part-2]('') `amazing-stuff/chapter-1/part-2.md`

其他内置路由如下：

- home: [/]('')
- archives: [/archives]('')
- tags: [/tags]('')
- categories: [/categories]('')
- 404: [/404]('')

路由可直接配置在侧边栏，例如：

```yml
menu:
  home: /
  about: /about
  很酷: /awesome-stuff
  很棒: /amazing-stuff
  开玩笑: /404
```

### 多语言

- :cn: 简体中文 & 繁體中文
- :us: English
- :jp: Japanese

目前支持三种语言，默认 English。
通过修改网站配置文件的 `language` 字段来设置语言。

```yml
language: en
# language: zh-Hans
# language: zh-Hant
# language: ja
```

### 评论

```yaml
comments:
  disqus:
    shortname: your_disqus_shortname
    autoload: true
```

设置 `autoload` 字段为 `true` 来自动加载 disqus，否则展示一个手动加载的按钮。

### 社交媒体

```yaml
# 通过改变键值顺序可自定义排序
sns:
  # 若 `email` 为空，会尝试取 `profile.email`
  email:
  # 若 `feed` 为空，会尝试取网站配置的 `feed.path`
  # `feed` 可能需要 hexo-generator-feed 的支持，详见 https://github.com/hexojs/hexo-generator-feed。
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

### 资源后缀

自动为博文中引用的资源添加域名和后缀，方便 CDN 设置。

```yaml
assets:
  prefix: 'https://cdn.example.com'
  suffix: '?m=webp&q=80'
```

举个栗子：

```markdown
![cat](images/cat.gif)
```

会转换成：

```html
<img src="https://cdn.example.com/images/cat.gif?m=webp&q=80" alt="cat">
```

### Google Analytics

```yaml
ga: UA-00000000-0
```

### Web App Manifest

为网站添加 manifest.json。

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

更多信息见[这里][manifest]。

### `theme-color` meta 标签

默认使用 `#2a2b33` 作为 `theme-color` 的值 ；如果设置了缩略图，则自动提取缩略图第一个像素的色值，动态设置 `theme-color`。

**注意** 这个特性目前只在安卓机的 Chrome 浏览器中生效。

更多信息见[这里][meta-theme-color]。

### Sitemap

为网站添加 `sitemap.xml` 文件。

### 增强的 front matter

默认的 front matter 多了如下几个由主题使用的字段：

- `author` 作者
- `thumbnail` 缩略图
- `dropcap` 首字母大写

都是不必须的。

栗子：

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

## 配置

### 网站配置 (`ROOT/_config.yml`)

配置以下字段：

```yaml
permalink: post/:title/index.html
```

### 主题配置 (`themes/inside/_config.yml`)

```yaml
# 侧边栏菜单
menu:
  home: /
  # about: /about
  # links: /links

# Profile
profile:
  ## 头像
  avatar: /avatar.jpg
  # 若未指定 `avatar`，此 Email 地址会被用来展示 gravatar(https://en.gravatar.com) 头像
  email: example@mail.com
  bio: Awesome guy.

# 社交媒体
# 通过改变键值顺序可自定义排序
sns:
  # 若 `email` 为空，会尝试取 `profile.email`
  email:
  # 若 `feed` 为空，会尝试取网站配置的 `feed.path`
  # `feed` 可能需要 hexo-generator-feed 的支持，详见 https://github.com/hexojs/hexo-generator-feed。
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
  # 自定义 copyright 信息，支持写 HTML，默认显示当前年份和作者，例如: ©2018 • Superman
  copyright:

  # 设置为 false 以隐藏 `由 Hexo 强力驱动`
  powered: true
  # 设置为 false 以隐藏 `主题 - Inside`
  theme: true

  # 自定义信息
  # custom: Hosted by <a target="_blank" rel="external nofollow" href="https://pages.coding.me"><b>Coding Pages</b></a>

# Post
post:
  # 分页大小
  per_page: 10
  # 目录
  # 设置为 false 以禁用
  toc:
    # 深度，即最多可显示的标题级别数，默认为 2，最大可到 4.
    # depth: 3
    # 标题前显示标号，如：1.1 标题
    index: true

# 分页大小
# 设为 0 以禁用分页
archive:
  per_page: 10
tag:
  per_page: 10
category:
  per_page: 10

# Favicon
# 默认 `favicon.ico`
favicon: favicon.ico

# Comments
comments:
  # disqus:
    # shortname: your_disqus_shortname
    # 设置为 true 以自动加载，设置为 false 显示为一个手动加载的按钮
    # autoload: false

# 资源前缀/后缀
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
