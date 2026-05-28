# Chiron Blog

[中文](#中文) | [English](#english)

## 中文

Chiron 的个人博客，基于 Hexo 7.3.0 与 Butterfly 5.5.4，部署在 Cloudflare Pages。

### 技术栈

| 工具 | 版本 / 配置 |
| --- | --- |
| Node.js | 本地 `>=20`，Cloudflare Pages `22` |
| Hexo | `7.3.0` |
| 主题 | `hexo-theme-butterfly` `5.5.4` |
| 生产地址 | https://chiron-blog.pages.dev |

### 本地开发

```bash
npm ci
npm run preview
```

打开 http://localhost:4000。

### 构建

```bash
npm run build
```

生成的静态站点会输出到 `public/`。

### 手动部署到 Cloudflare Pages

```bash
npm run build
npm run deploy:pages
```

生产地址：

https://chiron-blog.pages.dev

部署预览地址格式：

```text
https://<deployment-id>.chiron-blog.pages.dev
```

### 通过 Git 部署到 Cloudflare Pages

在 Cloudflare Pages 中连接 GitHub 仓库作为源码。

Cloudflare Pages 配置：

| 选项 | 值 |
| --- | --- |
| 生产分支 | `main` |
| 项目名称 | `chiron-blog` |
| 构建命令 | `npm run build` |
| 构建输出目录 | `public` |
| 根目录 | `/` |
| Node 版本 | `22` |

如果之后添加自定义域名，需要把 `_config.yml` 里的 `url` 从 Pages 域名改成真实域名，例如：

```yaml
url: https://example.com
```

自定义域名建议在首次部署成功后到 Cloudflare Pages 中添加，Cloudflare 会引导完成 DNS 记录和 SSL 配置。

## English

Chiron Blog is a personal blog built with Hexo 7.3.0 and Butterfly 5.5.4, deployed on Cloudflare Pages.

### Stack

| Tool | Version / setting |
| --- | --- |
| Node.js | `>=20` locally, `22` on Cloudflare Pages |
| Hexo | `7.3.0` |
| Theme | `hexo-theme-butterfly` `5.5.4` |
| Production URL | https://chiron-blog.pages.dev |

### Local Development

```bash
npm ci
npm run preview
```

Open http://localhost:4000.

### Build

```bash
npm run build
```

The generated static site is written to `public/`.

### Manual Deploy To Cloudflare Pages

```bash
npm run build
npm run deploy:pages
```

Production URL:

https://chiron-blog.pages.dev

Deployment previews use URLs like:

```text
https://<deployment-id>.chiron-blog.pages.dev
```

### Git Deploy To Cloudflare Pages

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
