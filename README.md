# Chiron Blog

Personal blog built with Hexo and Butterfly.

## Local Development

```bash
npm install
npm run preview
```

Open http://localhost:4000.

## Build

```bash
npm run build
```

The generated static site is written to `public/`.

## Deploy To Cloudflare Pages

Use GitHub as the source repository and connect it from Cloudflare Pages.

Cloudflare Pages settings:

| Option | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `public` |
| Root directory | `/` |
| Node version | `22` |

Before production launch, update `url` in `_config.yml` from `http://localhost:4000` to the real domain, for example:

```yaml
url: https://example.com
```

For a custom domain, add it in Cloudflare Pages after the first successful deployment. Cloudflare will guide the DNS record creation and SSL setup.
