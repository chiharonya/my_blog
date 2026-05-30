# 纯手动博客发布操作手册

本文说明如何在不使用 Codex skills 或自动化发布流程的情况下，手动撰写、预览并发布 Hexo + Butterfly 博客文章。

适用位置：博客仓库根目录。

## 1. 进入博客仓库

打开终端，进入本地克隆后的博客项目目录：

```bash
cd path/to/blog
```

确认当前目录正确：

```bash
pwd
```

应该看到你的博客仓库路径，例如：

```text
/path/to/blog
```

查看当前 Git 状态，避免误改已有内容：

```bash
git status
```

如果有未提交改动，先确认这些改动是否属于本次发布。

## 2. 确定文章路径

博客文章通常放在：

```text
source/_posts/
```

可以按分类建立子目录，例如技术文章：

```text
source/_posts/tech/
```

假设要写一篇新文章，文件名建议使用英文、拼音或短横线格式：

```text
source/_posts/tech/my-new-post.md
```

创建目录：

```bash
mkdir -p source/_posts/tech
```

创建文章文件：

```bash
touch source/_posts/tech/my-new-post.md
```

用编辑器打开，例如 VS Code：

```bash
code source/_posts/tech/my-new-post.md
```

## 3. 编写 Front Matter

每篇 Hexo 文章顶部需要 YAML front matter。示例：

```markdown
---
title: 我的文章标题
date: 2026-05-30 21:30:00
categories:
  - tech
tags:
  - Hexo
  - Blog
description: 这是一句话文章摘要。
cover: /images/my-new-post/cover.png
top_img: /images/my-new-post/cover.png
---

这里开始写正文。
```

常用字段说明：

```text
title       文章标题
date        发布时间，建议使用本地时间，格式为 YYYY-MM-DD HH:mm:ss
categories 文章分类
tags        文章标签
description 文章摘要
cover       文章封面图
top_img     文章顶部图
```

如果暂时没有封面图，可以去掉 `cover` 和 `top_img` 字段，或留空：

```yaml
cover:
top_img:
```

## 4. 撰写正文

正文使用 Markdown。常见写法：

````markdown
## 第一节标题

这里是正文内容。

### 小标题

- 列表项一
- 列表项二

```js
console.log("hello blog");
```

![图片说明](/images/my-new-post/example.png)
````

写中文文章时建议：

- 标题具体，不要太泛。
- 摘要控制在一句话。
- 段落不要过长。
- 代码块标明语言。
- 图片写清楚 alt 文本。

## 5. 手动添加图片

图片建议放在：

```text
source/images/
```

最好为每篇文章建一个独立目录：

```bash
mkdir -p source/images/my-new-post
```

把图片复制进去，例如：

```text
source/images/my-new-post/cover.png
source/images/my-new-post/example.png
```

文章中引用时，不要写 `source/`，要写站点根路径：

```markdown
![封面图](/images/my-new-post/cover.png)
```

Front Matter 中也是：

```yaml
cover: /images/my-new-post/cover.png
top_img: /images/my-new-post/cover.png
```

## 6. 本地构建检查

写完后先运行构建，检查 Markdown、Front Matter 和 Hexo 配置是否有问题：

```bash
npm run build
```

如果构建失败，优先检查：

- YAML front matter 缩进是否正确。
- 冒号后面是否有空格。
- 标题或摘要里是否有未转义的特殊字符。
- 图片路径是否写错。
- Markdown 代码块是否闭合。

## 7. 本地预览

启动本地预览：

```bash
npm run preview
```

一般会在：

```text
http://localhost:4000
```

打开浏览器访问该地址，检查：

- 首页是否能看到文章。
- 文章页标题是否正确。
- 分类和标签是否正常。
- 封面图是否显示。
- 正文排版是否正常。
- 代码块是否正常。
- 移动端是否大致可读。

预览服务不用时，可以在终端按 `Ctrl + C` 停止。

## 8. 查看改动

发布前查看 Git 状态：

```bash
git status
```

查看具体改动：

```bash
git diff
```

确认只包含本次要发布的文章和图片。

## 9. 提交到 Git

添加文章和图片：

```bash
git add source/_posts/tech/my-new-post.md source/images/my-new-post
```

如果确认所有改动都要提交，也可以：

```bash
git add .
```

提交：

```bash
git commit -m "新增博客：我的文章标题"
```

也可以使用英文提交信息：

```bash
git commit -m "Add blog post about my new post"
```

## 10. 推送发布

确认当前分支：

```bash
git branch --show-current
```

如果博客通过 GitHub 或 Cloudflare Pages 自动部署，推送到对应分支后通常会自动发布：

```bash
git push
```

如果当前分支没有设置 upstream，可能需要：

```bash
git push -u origin 当前分支名
```

例如：

```bash
git push -u origin main
```

推送后，到 GitHub 或 Cloudflare Pages 控制台查看部署状态。

## 11. 手动 Cloudflare Pages 部署

只有明确需要手动部署时，才运行：

```bash
npm run deploy:pages
```

如果 Cloudflare Pages 已经绑定 Git 仓库，通常不需要手动 deploy。推送代码后，远程流水线会自动构建并发布。

## 推荐完整流程

```bash
cd path/to/blog
git status

mkdir -p source/_posts/tech
mkdir -p source/images/my-new-post

code source/_posts/tech/my-new-post.md

npm run build
npm run preview

git status
git diff
git add source/_posts/tech/my-new-post.md source/images/my-new-post
git commit -m "新增博客：我的文章标题"
git push
```

完整手动流程可以概括为：写 Markdown、放图片、本地构建、本地预览、Git 提交、推送触发发布。
