---
title: 我的博客搭建记录：从 Hexo 到 Butterfly
date: 2026-05-27 14:00:00
categories:
  - tech
tags:
  - Hexo
  - Butterfly
  - 博客搭建
description: 参考 233002.xyz 的建站方式，搭一个属于自己的静态博客。
---

今天开始搭建自己的个人博客。

我参考了 233002.xyz 的路线：用 Hexo 生成静态网站，用 Butterfly 作为主题，后续再接入 GitHub、Cloudflare Pages 和图片存储。

## 当前技术栈

| 层级 | 选择 |
| --- | --- |
| 博客框架 | Hexo |
| 主题 | Butterfly |
| 写作格式 | Markdown |
| 本地预览 | hexo server |
| 后续部署 | Cloudflare Pages |

## 为什么先选静态博客

静态博客生成出来就是 HTML、CSS 和 JavaScript，不需要自己维护数据库，也不需要长期运行服务器。对个人博客来说，这条路线轻、稳、便宜，也方便以后迁移。

## 下一步

接下来要继续完成站点视觉、文章分类、GitHub 仓库、Cloudflare Pages 自动部署，以及图片管理方案。
