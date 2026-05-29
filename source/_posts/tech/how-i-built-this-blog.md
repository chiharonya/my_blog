---
title: 我是怎么从 0 开始搭建这个博客的
date: 2026-05-28 22:00:00
categories:
  - tech
tags:
  - Hexo
  - Butterfly
  - Cloudflare Pages
  - Wrangler
  - 静态博客
description: 一份从架构、技术栈、开源项目、部署流程到日常写作命令的博客搭建复盘。
cover: /images/building-blog-cover.jpg
top_img: /images/building-blog-cover.jpg
---

![博客搭建封面](/images/building-blog-cover.jpg)

这篇文章不是一份“照着敲就完事”的零散命令记录，而是我给自己整理的一张建站地图：这个博客为什么这样搭、每一层承担什么职责、从本地写 Markdown 到线上访问中间发生了什么，以及以后我要新增文章、预览、构建、部署时该用哪些命令。

最后成品是一个静态博客：源码放在 Git 仓库里，文章用 Markdown 写，Hexo 负责生成静态页面，Butterfly 负责主题和交互，Cloudflare Pages 负责托管和 CDN 分发。

## 整体架构

这个博客的架构可以拆成四层：

| 层级 | 作用 | 当前选择 |
| --- | --- | --- |
| 内容层 | 管理文章、页面、图片和自定义样式 | Markdown + `source/` 目录 |
| 生成层 | 把内容和主题编译成静态网页 | Hexo |
| 主题层 | 提供首页、文章页、归档、分类、标签、搜索和视觉样式 | Butterfly |
| 托管层 | 部署 `public/` 目录并提供公网访问 | Cloudflare Pages |

这条链路很简单：

```text
Markdown 文章
  -> Hexo 读取配置和主题
  -> 生成 public/ 静态文件
  -> Cloudflare Pages 发布到公网
```

它的好处是维护成本低。线上没有数据库，没有后端服务常驻运行，也没有复杂的状态同步。只要源码还在，站点就可以重新生成；只要 `public/` 能被托管，网页就能打开。

## 技术栈与开源项目

这个博客主要用到这些项目和平台：

| 名称 | 用途 | 链接 |
| --- | --- | --- |
| Node.js | 运行 Hexo、安装依赖、执行构建脚本 | [nodejs.org](https://nodejs.org/) |
| Hexo | 静态博客生成器 | [hexo.io](https://hexo.io/) / [GitHub](https://github.com/hexojs/hexo) |
| Butterfly | Hexo 主题，提供博客的主要页面布局和交互 | [butterfly.js.org](https://butterfly.js.org/) / [GitHub](https://github.com/jerryc127/hexo-theme-butterfly) |
| hexo-generator-search | 生成本地搜索索引 | [GitHub](https://github.com/wzpan/hexo-generator-search) |
| Cloudflare Pages | 静态网站托管和部署 | [Cloudflare Pages](https://pages.cloudflare.com/) |
| Wrangler | Cloudflare 命令行工具，用来手动部署 Pages | [Docs](https://developers.cloudflare.com/workers/wrangler/) / [GitHub](https://github.com/cloudflare/workers-sdk) |

项目里的核心依赖写在 `package.json`。最重要的是：

```json
{
  "dependencies": {
    "hexo": "^7.0.0",
    "hexo-theme-butterfly": "^5.5.4",
    "hexo-server": "^3.0.0",
    "hexo-generator-search": "^2.4.3"
  }
}
```

我要求 Node.js 版本不低于 20：

```json
{
  "engines": {
    "node": ">=20"
  }
}
```

## 目录结构

当前项目里最需要理解的是这些文件和目录：

```text
.
├── _config.yml                 # Hexo 主配置
├── _config.butterfly.yml       # Butterfly 主题配置
├── package.json                # 依赖和常用脚本
├── source/
│   ├── _posts/                 # 博客文章
│   ├── about/                  # 关于页
│   ├── categories/             # 分类页入口
│   ├── tags/                   # 标签页入口
│   ├── css/custom.css          # 自定义样式
│   └── images/                 # 站点图片和文章封面
├── scaffolds/                  # Hexo 新建文章模板
└── public/                     # 构建产物，部署时上传这里
```

这里有一个重要原则：`source/` 是我写作和维护内容的地方，`public/` 是生成出来的结果。平时应该修改 `source/`、配置文件和主题配置，不应该手动改 `public/`，因为下一次构建会覆盖它。

## 初始化项目

如果从完全空白开始，先准备 Node.js，再安装 Hexo CLI：

```bash
npm install -g hexo-cli
```

创建项目：

```bash
hexo init blog
cd blog
npm install
```

安装 Butterfly 主题和搜索插件：

```bash
npm install hexo-theme-butterfly hexo-generator-search
```

在 `_config.yml` 里指定主题：

```yaml
theme: butterfly
```

然后增加 Butterfly 的独立配置文件 `_config.butterfly.yml`。把主题配置放到项目根目录，而不是直接改 `node_modules` 里的主题源码，后续升级主题会更省心。

## 站点配置

Hexo 主配置负责站点的基础信息、链接结构、目录和构建行为。这个博客的关键信息大概是这样：

```yaml
title: Chiron
subtitle: '我的博客小站'
description: 'Chiron 的个人博客，记录一切我觉得值得记录的。'
author: Chiron
language: zh-CN
timezone: Asia/Shanghai
url: https://chiron-blog.pages.dev
permalink: :year/:month/:day/:title/
theme: butterfly
```

其中 `url` 很重要。部署到 Cloudflare Pages 后，它应该是线上站点地址；如果以后绑定自定义域名，也要同步改成真实域名。

搜索索引配置如下：

```yaml
search:
  path: search.xml
  field: post
  content: true
  format: html
```

Butterfly 配置主要控制导航、头像、首页头图、文章封面、代码块、目录、社交链接等。比如导航：

```yaml
menu:
  首页: / || fas fa-home
  归档: /archives/ || fas fa-archive
  标签: /tags/ || fas fa-tags
  分类: /categories/ || fas fa-folder-open
  关于: /about/ || fas fa-user
```

站点默认头图和背景图：

```yaml
default_top_img: /images/site/chiron-hero-1800.jpg
index_img: /images/site/chiron-hero-1800.jpg
background: /images/site/chiron-hero-1800.jpg
```

## 本地开发

第一次拿到项目时，先安装依赖：

```bash
npm install
```

启动本地预览：

```bash
npm run preview
```

这个脚本实际执行的是：

```bash
hexo server --host 127.0.0.1 --port 4000
```

打开：

```text
http://127.0.0.1:4000
```

如果只是想用默认端口，也可以运行：

```bash
npm run server
```

## 构建静态网站

构建前可以先清理旧产物：

```bash
npm run clean
```

生成静态网页：

```bash
npm run build
```

这个脚本实际执行：

```bash
hexo clean && hexo generate
```

构建完成后，Hexo 会把结果写入：

```text
public/
```

部署平台不需要理解 Markdown，也不需要运行 Hexo 服务。它只需要把 `public/` 作为静态目录发布出去。

## 部署到 Cloudflare Pages

我给这个项目准备了两种部署方式。

第一种是 Git 集成部署：把仓库推到 GitHub，然后在 Cloudflare Pages 里连接仓库。Pages 配置如下：

| 配置项 | 值 |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `public` |
| Root directory | `/` |
| Node version | `22` |

之后每次推送到 `main`，Cloudflare Pages 会自动安装依赖、构建、发布。

第二种是手动命令部署，适合临时发布或排查问题：

```bash
npm run build
npx wrangler pages deploy public --project-name chiron-blog --branch main
```

项目里已经把第二条封装成脚本：

```bash
npm run deploy:pages
```

线上地址是：

```text
https://chiron-blog.pages.dev
```

如果后面绑定自定义域名，大致流程是：

1. 在 Cloudflare Pages 项目里添加 Custom domain。
2. 按照 Cloudflare 指引创建或确认 DNS 记录。
3. 等待 SSL 证书签发完成。
4. 修改 `_config.yml` 里的 `url` 为新域名。
5. 重新构建并部署。

## 新增一篇博客

最朴素的方法是在 `source/_posts/` 下新增 Markdown 文件。比如技术文章可以放在：

```text
source/_posts/tech/my-new-post.md
```

文章开头需要 front matter：

```markdown
---
title: 新文章标题
date: 2026-05-28 22:00:00
categories:
  - tech
tags:
  - Hexo
  - 博客
description: 这是一句话摘要，会出现在首页和搜索结果里。
cover: /images/example-cover.png
top_img: /images/example-cover.png
---

这里开始写正文。
```

如果文章需要封面，把图片放到：

```text
source/images/
```

然后在文章里引用：

```markdown
![图片说明](/images/example-cover.png)
```

`cover` 主要用于首页文章卡片和侧边栏，`top_img` 用于文章页顶部大图。两者可以用同一张，也可以分开。

也可以使用 Hexo 命令新建文章：

```bash
npx hexo new post "my-new-post"
```

不过我更喜欢直接创建文件，因为分类目录、文件名、front matter 都可以一次写清楚。

## 日常命令速查

安装依赖：

```bash
npm install
```

本地预览：

```bash
npm run preview
```

清理构建产物：

```bash
npm run clean
```

生成静态文件：

```bash
npm run build
```

手动部署到 Cloudflare Pages：

```bash
npm run deploy:pages
```

查看当前 Git 状态：

```bash
git status --short
```

提交一次文章更新：

```bash
git add source/_posts source/images
git commit -m "Add blog setup guide"
git push
```

## 我为什么喜欢这套方案

这套方案的关键不是“技术很酷”，而是边界清楚。

文章就是 Markdown 文件，图片就是静态资源，站点配置就是 YAML，样式覆盖集中在 `source/css/custom.css`。Hexo 只负责生成，Butterfly 只负责呈现，Cloudflare Pages 只负责托管。每一层都很薄，也就更容易定位问题。

对个人博客来说，这比一个复杂的内容管理系统更适合长期维护。想写东西的时候，打开 Markdown；想改外观的时候，改主题配置和少量 CSS；想发布的时候，构建并部署。整个路径足够短，短到不会阻碍写作本身。

也就是说，这个博客真正的目标不是“搭完一个网站”，而是建立一个以后能一直轻松写下去的地方。
