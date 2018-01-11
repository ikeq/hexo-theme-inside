# hexo-theme-inside

## Install

```bash
git clone https://github.com/elmorec/hexo-theme-inside.git inside
```

## Config
```yaml
# sidebar menu
menu:
  home: /
  archives: /archives
  # about: /about
  # links: /links
  # page1: /page1
  # page2: /page2

# routes
# page:
  # - about
  # - links
  # multi-level route example
  # - page1:
  #   - page1-1
  # - page2:
  #   - page2-1:
  #     - page2-1-1
  #     - page2-1-2
  #   - page2-2

profile:
  email: example@mail.com
  bio: Awesome guy.

# sns accounts
sns:
  github: https://github.com/yourname
  twitter: https://twitter.com/yourname
  gplus: https://plus.google.com/u/0/xxx
  weibo: http://weibo.com/yourname

# copyright info at site footer
copyright: ©2017

# disqus
disqus:
  shortname: your_disqus_shortname
  # set to true to auto load disqus, otherwise will display a button
  autoload: true

# prefix/suffix post assets with assets filter
# for example, `![cat](images/cat.gif)` will convert to
# `![cat](https://cdn.example.com/images/cat.gif?m=webp&q=80)`
assets:
  prefix: 'https://cdn.example.com'
  suffix: '?m=webp&q=80'
```

## Changelog
- 0.1.5 support disqus
- 0.1.6 prefix/suffix post assets with assets filter
- 0.1.7 amend style & fix table style
- 0.1.8 redesign post header
- 0.1.9 hash based cache control