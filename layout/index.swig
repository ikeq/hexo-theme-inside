<!doctype html>
<html lang="{{ config.language }}">
<head>
<meta charset="utf-8">
<title>{{ title }}</title>
<base href="{{ config.root }}">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
<link rel="canonical" href="{{ url_trim(url) }}">
<link rel="icon" type="image/x-icon" href="{{ url_for(theme.favicon) }}">
{% if theme.pwa.manifest %}
<link rel="manifest" href="{{ url_for('manifest.json') }}">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
{% endif %}
{{ open_graph({ image: page.thumbnail || theme.profile.avatar }) | safe }}
{% if theme.seo.structured_data %}
{{ structured_data(page) | safe }}
{% endif %}
{% if config.feed and config.feed.path %}
<link rel="alternate" type="application/atom+xml" title="{{ config.title }}" href="{{ url_for(config.feed.path) }}">
{% endif %}
{{ theme.styles | safe }}
{{ css('theme.' + theme.runtime.themeHash) | safe }}
{{ js('config.' + theme.runtime.configHash) | safe }}
{% if theme.ga %}
{{ ga(theme.ga) | safe }}
{% endif %}
</head>
<body lang="{{ config.language }}">
<{{ theme.runtime.selector }}></{{ theme.runtime.selector }}>
{{ theme.scripts | safe }}
</body>
</html>
