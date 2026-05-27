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

## Manual Deploy To Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy public --project-name chiron-blog --branch main
```

Production URL:

https://chiron-blog.pages.dev

Deployment previews use URLs like:

https://<deployment-id>.chiron-blog.pages.dev

## Git Deploy To Cloudflare Pages

Use GitHub as the source repository and connect it from Cloudflare Pages.

Cloudflare Pages settings:

| Option | Value |
| --- | --- |
| Production branch | `main` |
| Project name | `chiron-blog` |
| Build command | `npm run build` |
| Build output directory | `public` |
| Root directory | `/` |
| Node version | `22` |

If a custom domain is added later, update `url` in `_config.yml` from the Pages domain to the real domain, for example:

```yaml
url: https://example.com
```

For a custom domain, add it in Cloudflare Pages after the first successful deployment. Cloudflare will guide the DNS record creation and SSL setup.
