# Inside

[![build-img]][root] [![release-img]][release] [![license-img]](LICENSE)

SPA、扁平、干净的 hexo 主题 ❤️。

## 特色

### 嵌套的 page 路由

如 page 这么写：

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

生成的路由如下：

- [/about]('') `about/index.md`
- [/awesome-stuff]('') `awesome-stuff/index.md`
- [/awesome-stuff/chapter-1]('') `awesome-stuff/chapter-1.md`
- [/awesome-stuff/chapter-2]('') `awesome-stuff/chapter-2.md`
- [/amazing-stuff]('') `amazing-stuff/index.md`
- [/amazing-stuff/chapter-1]('') `amazing-stuff/chapter-1/index.md`
- [/amazing-stuff/chapter-1/part-1]('') `amazing-stuff/chapter-1/part-1.md`
- [/amazing-stuff/chapter-1/part-2]('') `amazing-stuff/chapter-1/part-2.md`

其他内置路由：

- home: [/]('')
- archives: [/archives]('')
- tags: [/tags]('')
- categories: [/categories]('')
- 404: [/404]('')

路由可直接配置在侧边栏：

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

默认 English。修改 `HEXO/_config.yaml` 的 `language` 字段来设置语言。

```yml
language: en
# language: zh-Hans
# language: zh-Hant
# language: ja
```

### 评论 (disqus)

```yaml
comments:
  disqus:
    shortname: your_disqus_shortname
    autoload: true
```

设置 `autoload` 字段为 `true` 以自动加载，否则展示一个手动加载的按钮。

### 社交媒体

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

### 资源后缀

自动为博文中引用的图片添加前后缀，方便 CDN 设置。

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

### PWA

#### Web App Manifest

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

更多信息见 [manifest]。

#### 离线缓存

使用 Workbox 缓存加速。

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

更多信息见 [workbox]。

#### `theme-color` meta 标签

默认使用 `#2a2b33` 作为 `theme-color` 的值 ；如果设置了缩略图，则自动提取缩略图第一个像素的色值，动态设置 `theme-color`。

**注意** 这个特性目前只在安卓机的 Chrome 浏览器中生效。

更多信息见 [theme-color][meta-theme-color]。

### SEO

#### Sitemap

为网站添加 `sitemap.xml`。

#### Structured Data

```yaml
seo:
  structured_data: true
```

更多信息见 [Structured Data](https://developers.google.com/search/docs/guides/intro-structured-data)。

### 增强的 front matter

默认的 front matter 多了如下几个由主题使用的字段：

- `author` 作者，optional
- `thumbnail` 缩略图，optional
- `dropcap` 首字母大写，optional

如：

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

### Google Analytics

```yaml
ga: UA-00000000-0
```


## 配置

### 网站配置 (HEXO/_config.yml)

配置以下字段：

```yaml
permalink: post/:title/
```

### 主题配置 (HEXO/themes/inside/_config.yml)

完整配置见[这里](_config.yml)。

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
