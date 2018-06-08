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

### Disqus 评论

```yaml
disqus:
  shortname: your_disqus_shortname
  autoload: true
```

设置 `autoload` 字段为 `true` 来自动加载 disqus，否则展示一个手动加载的按钮。

### 社交账号

```yaml
sns:
  # github
  github: your-github-url
  # twitter
  twitter: your-twitter-url
  # google plus
  gplus: your-google-plus-url
  # weibo
  weibo: your-weibo-url
```

### Feed

启用 feed 需要：

1. 安装 [hexo-generator-feed]:

   ```bash
   npm install hexo-generator-feed --save
   ```

2. 在网站配置文件中增加如下项：

   ```yaml
   feed:
     path: atom.xml
   ```

更多信息见 [hexo-generator-feed](hexo-generator-feed)。

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

因 hexo 官方提供的一部分组件不满足使用，故本主题使用了自己的实现，为避免冲突，墙裂建议将以下项从网站的 `package.json` 中移除。

- [hexo-generator-archive]
- [hexo-generator-category]
- [hexo-generator-tag]

同时配置以下字段：

```yaml
permalink: post/:title/index.html
default_layout: index
pagination_dir: page
```

### 主题配置 (`themes/inside/_config.yml`)

完整的配置见[这里](_config.yml)。

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
[hexo-generator-feed]: https://github.com/hexojs/hexo-generator-feed

[manifest]: https://www.w3.org/TR/appmanifest/
[meta-theme-color]: https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#meta_theme_color_for_chrome_and_opera
