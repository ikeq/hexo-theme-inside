# hexo-theme-inside

## Install

Download via `git`

```bash
git clone https://github.com/elmorec/hexo-theme-inside.git inside
```

Or via `npm`

```bash
npm install hexo-theme-inside
```

then place it in your hexo theme folder, and change `theme` to `inside` at your `_config.yaml` file.

## Config
```yaml
# sidebar menu
menu:
  home: /
  archives: /archives
  about: /about
  # links: /links
  # page1: /page1
  # page2: /page2

# page routes
page:
  - about
  - links
  # multi-level route example
  - page1:
    - page1-1
  - page2:
    - page2-1:
      - page2-1-1
      - page2-1-2
    - page2-2

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
```
