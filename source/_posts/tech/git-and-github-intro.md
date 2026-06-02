---
title: Git 与 GitHub 入门：从本地版本管理到远程协作
date: 2026-06-02 00:00:00
updated: 2026-06-03 03:09:44
categories:
  - tech
tags:
  - Git
  - GitHub
  - 版本管理
  - 开发工具
description: 一篇面向初学者的 Git 与 GitHub 使用笔记：理解仓库、提交、分支、暂存区、远程同步，以及最常用的一组命令。
cover: /images/git-and-github-intro-cover.png
top_img: /images/git-and-github-intro-cover.png
---

![Git 与 GitHub 入门封面](/images/git-and-github-intro-cover.png)

Git 是一种版本管理工具。更具体地说，它是一个可以安装在本地电脑上的开源软件，用来记录项目在不同时间点的变化。

如果没有 Git，代码改坏以后，常见做法可能是到处复制文件夹：`project-v1`、`project-v2`、`project-final`、`project-final-final`。这种方式一开始看起来能用，但项目稍微复杂一点，就很难知道每个版本到底改了什么、什么时候改的、还能不能退回去。

Git 解决的就是这个问题。它会把项目的变化保存成一个个版本，每个版本叫一次 `commit`，也就是“提交”。每次提交都会形成一个清晰的时间点：这一刻项目是什么样、改了哪些文件、为什么要这样改。以后如果想回到当时的代码状态，就可以通过 Git 找回。

Git 管理的代码一般放在仓库里，仓库分为本地仓库和远程仓库。本地仓库就在自己的电脑上，远程仓库则托管在网站或服务器上。最常见的远程代码托管平台就是 GitHub。

所以可以简单理解：

- Git 是版本管理工具，负责记录代码变化。
- GitHub 是远程代码托管平台，负责把仓库放到网上，方便备份、展示和协作。

GitHub 上的仓库可以设置为公开或私有。公开仓库所有人都可以查看和下载代码，私有仓库则只有被授权的人能访问。

## 从 0 开始使用 Git 和 GitHub

如果你是第一次接触 Git，可以按下面这条路线走：

```text
安装 Git
  -> 注册 GitHub
  -> 配置本机 Git 身份
  -> 创建本地仓库
  -> 创建远程仓库
  -> 绑定本地和远程
  -> 提交并推送代码
```

这条链路走通以后，后面的大部分日常使用都只是重复“修改文件、提交版本、推送到远程”。

## 安装 Git

Windows 用户可以去 Git 官网下载安装包：

[https://git-scm.com/downloads](https://git-scm.com/downloads)

下载 Windows 版本后，按安装向导一路安装即可。大多数选项保持默认就能正常使用。

macOS 用户有两种常见方式。

第一种是安装 Xcode Command Line Tools：

```bash
xcode-select --install
```

安装完成后，在终端里输入：

```bash
git --version
```

如果能看到类似 `git version 2.x.x` 的输出，就说明 Git 已经可以使用。

第二种是通过 Homebrew 安装：

```bash
brew install git
```

如果你的电脑还没有 Homebrew，可以先访问官网按说明安装：

[https://brew.sh/](https://brew.sh/)

## 注册 GitHub

打开 GitHub 官网：

[https://github.com/](https://github.com/)

使用邮箱注册账号即可。GitHub 在中国大陆的访问有时不太稳定，可能会出现页面加载慢、图片打不开、推送失败等情况。遇到这种情况时，可以检查网络环境，必要时使用合适的网络代理工具。

注册完成后，建议先做两件事：

1. 设置头像和用户名，方便别人识别你。
2. 打开邮箱验证邮件，完成账号验证。

## 配置 Git 身份

第一次使用 Git 时，需要告诉 Git：以后提交代码时，作者是谁。

在终端里执行：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

这里的邮箱建议使用 GitHub 账号绑定的邮箱。配置完成后，可以用下面的命令查看：

```bash
git config --global --list
```

如果看到 `user.name` 和 `user.email`，说明配置成功。

## 绑定 Git 和 GitHub

本地 Git 想要把代码推送到 GitHub，通常需要完成身份认证。常见方式有两种：HTTPS 和 SSH。

### 方式一：HTTPS

HTTPS 地址长这样：

```text
https://github.com/用户名/仓库名.git
```

现在 GitHub 不再支持用账号密码直接推送代码，通常需要使用 Personal Access Token，也就是个人访问令牌。初学时可以先知道这件事：如果推送时要求输入密码，不是填 GitHub 登录密码，而是填 GitHub 生成的 token。

### 方式二：SSH

SSH 地址长这样：

```text
git@github.com:用户名/仓库名.git
```

SSH 的好处是配置完成后，日常推送更顺手，不需要每次输入 token。

生成 SSH key：

```bash
ssh-keygen -t ed25519 -C "你的邮箱"
```

一路回车即可。生成后，查看公钥内容：

```bash
cat ~/.ssh/id_ed25519.pub
```

复制输出内容，打开 GitHub：

```text
Settings -> SSH and GPG keys -> New SSH key
```

把公钥粘贴进去保存。

然后在终端测试连接：

```bash
ssh -T git@github.com
```

如果看到类似欢迎信息，就说明本机已经和 GitHub 绑定好了。

## 初始化一个 Git 项目

想要对一个项目进行 Git 管理，先进入项目文件夹：

```bash
cd your-project
```

然后初始化仓库：

```bash
git init
```

初始化完成后，项目目录里会出现一个隐藏文件夹 `.git`。这个文件夹里存放了 Git 的所有版本数据。只要 `.git` 还在，这个项目就是一个 Git 仓库；如果把 `.git` 删除，这个项目就不再被 Git 管理。

可以用下面的命令查看当前状态：

```bash
git status
```

`git status` 是 Git 里最常用的命令之一。只要不确定现在发生了什么，就先运行它。

## .gitignore 是什么

有些文件不应该被提交到仓库里，比如：

- API key、密码、token 等敏感信息。
- `node_modules/` 这类第三方依赖目录。
- `.env` 这类本地配置文件。
- 构建产物、缓存文件、系统临时文件。

这时可以在项目根目录创建一个 `.gitignore` 文件，把不想提交的文件或目录写进去：

```gitignore
node_modules/
.env
dist/
.DS_Store
```

Git 会忽略这些文件，不把它们加入版本管理。

这里有一个重要提醒：如果敏感文件已经被提交过，再写进 `.gitignore` 并不会自动把历史记录里的敏感内容删除。所以 API key 一类内容最好一开始就不要提交。

## 第一次提交代码

Git 提交通常分两步：先加入暂存区，再生成提交。

添加全部修改：

```bash
git add .
```

提交版本：

```bash
git commit -m "初始化项目"
```

`-m` 后面是提交说明。它应该简短说明这次提交做了什么，比如：

```bash
git commit -m "添加登录页面"
git commit -m "修复视频上传失败问题"
git commit -m "更新 README 安装说明"
```

不要写成 `update`、`fix`、`111` 这种很难回忆的说明。提交信息是写给未来的自己和队友看的。

## 绑定远程仓库并推送

想要实现本地与远端仓库同步，需要先在 GitHub 上创建一个新仓库。创建完成后，GitHub 会给出仓库地址。

如果使用 SSH 地址，可以这样绑定：

```bash
git remote add origin git@github.com:用户名/仓库名.git
```

如果使用 HTTPS 地址，可以这样绑定：

```bash
git remote add origin https://github.com/用户名/仓库名.git
```

查看远程仓库：

```bash
git remote -v
```

第一次推送到远程：

```bash
git branch -M main
git push -u origin main
```

这里的 `main` 是主分支名。`-u` 的作用是建立本地分支和远程分支的默认关联。设置好以后，后续再推送通常只需要：

```bash
git push
```

如果以后想从远程拉取最新代码，可以运行：

```bash
git pull
```

## GitHub 仓库页面怎么看

会把代码推到 GitHub 之后，下一步就是学会读一个仓库页面。GitHub 仓库的网址通常可以拆成三部分：

```text
https://github.com/开发者名/仓库名
```

比如：

```text
https://github.com/cli/cli
```

这里的 `github.com` 是网站域名，前一个 `cli` 是开发者或组织名，后一个 `cli` 是仓库名。很多开源项目都会放在组织账号下面，比如一个团队、公司或社区组织。

进入仓库后，最先看到的通常是文件列表。这里可以点开文件夹和文件，查看项目的源代码。文件列表里常见的两列信息很有用：一列是最近一次提交的说明，另一列是最近更新时间。它们可以帮你初步判断这个项目是否还在维护。

![GitHub 仓库首页和文件列表](/images/tutorial/g1.jpg)

如果一个项目最近更新时间停留在很多年前，Issues 里也没人回复，就要谨慎依赖它；如果最近仍然有人提交代码、处理问题，说明项目还比较活跃。

仓库页面往下滚，通常会看到 README。GitHub 会自动读取并展示仓库里的 `README.md` 文件。README 就像项目说明书，一般会介绍：

- 这个项目解决什么问题。
- 如何安装和运行。
- 有哪些核心功能。
- 如何配置环境变量。
- 如何参与贡献或反馈问题。

所以第一次看一个陌生项目，不要急着先翻源代码，应该先读 README。一个维护良好的项目，通常会把最重要的使用方式写在这里。

## 下载或克隆 GitHub 项目

如果只是想看看代码，可以直接在网页上浏览文件。如果想把项目拿到自己电脑上，有两种常见方式。

第一种是下载 ZIP 压缩包。点击仓库右上方的 `Code` 按钮，再选择 `Download ZIP`。这种方式适合“我只是想拿一份源码看看”，不需要保留 Git 历史，也不打算继续和远程仓库同步。

第二种是通过仓库地址克隆。点击 `Code` 按钮后，可以复制 HTTPS 或 SSH 地址，然后在终端运行：

```bash
git clone 仓库地址
```

![GitHub Code 菜单里的克隆地址和 Download ZIP](/images/tutorial/g2.jpg)

克隆和下载 ZIP 的区别在于：`git clone` 会把完整 Git 仓库下载到本地，包括提交历史、分支信息和远程地址。后续你可以继续 `git pull` 拉取更新，也可以在自己的分支上开发。

所以可以这样选择：

| 场景 | 推荐方式 |
| --- | --- |
| 只想临时查看源码 | Download ZIP |
| 想学习项目历史或继续同步更新 | git clone |
| 想参与项目开发或提交修改 | git clone |

## Releases：下载作者打包好的版本

有些项目不只是提供源码，还会在 Releases 里提供已经打包好的软件。仓库右侧或页面导航里经常能看到 `Releases` 入口，点进去后可以看到不同版本的发布记录。

在 Release 页面里，`Assets` 区域通常就是下载区。这里可能会有适用于 Windows、macOS、Linux 的不同安装包，也可能有校验文件、压缩包或源码包。

![GitHub Releases 里的 Assets 下载区](/images/tutorial/g3.jpg)

对普通用户来说，如果只是想安装软件，优先看 Releases；对开发者来说，如果想研究代码或参与开发，再去看源码和分支。

下载 Release 时要注意版本号。一般来说：

- `Latest` 表示当前最新稳定版本。
- `Pre-release` 表示预发布版本，可能还在测试。
- 文件名里常见的 `macOS`、`windows`、`linux`、`amd64`、`arm64` 表示不同系统和 CPU 架构。

如果不确定自己该下哪个版本，可以先看 README 或官方文档的安装说明。

## Star、Fork 和 Issues 是什么

GitHub 仓库页面上还有几个很常见的按钮和入口。

`Star` 可以理解成收藏或点赞。你觉得一个项目有用，就可以点 Star。它会出现在你的收藏列表里，也能让项目作者知道这个项目被更多人关注。Star 数量不是判断项目质量的唯一标准，但能反映项目的受欢迎程度。

`Fork` 是把别人的仓库复制一份到自己的 GitHub 账号下面。Fork 后，你可以在自己的副本里自由修改，不会影响原仓库。如果你希望把修改贡献回原项目，通常会先 Fork，再修改，再向原仓库提交 Pull Request。

`Issues` 是问题讨论区。用户可以在这里反馈 bug、提出功能建议、询问使用问题。看一个开源项目是否活跃，Issues 也很有参考价值：如果问题有人回复、有人关闭、有人持续跟进，说明维护状态比较健康；如果大量问题长期没人管，使用时就要多留一点余地。

简单总结一下：

| 功能 | 用途 |
| --- | --- |
| Star | 收藏、关注、表示认可 |
| Fork | 复制一份仓库到自己的账号下 |
| Issues | 提 bug、问问题、讨论需求 |
| Pull Request | 请求把自己的修改合并回项目 |
| Releases | 下载作者发布的正式版本或安装包 |

## Git 的三个分区

Git 初学时最容易卡住的地方，是它不是“改了文件就自动生成版本”。Git 里常见的状态可以理解成三个区域：

| 区域 | 英文 | 作用 |
| --- | --- | --- |
| 工作区 | Working Tree | 你正在编辑的项目文件夹 |
| 暂存区 | Staging Area / Index | 准备放进下一次提交的修改 |
| 仓库区 | Repository | 已经提交成功的版本历史 |

一次标准提交流程是：

```text
修改文件
  -> git add 放入暂存区
  -> git commit 生成版本
```

为什么要多一个暂存区？因为它允许你选择“这次提交到底包含哪些修改”。

比如你同时改了登录页面和 README，但这两件事没有关系。你可以先只把登录页面相关文件加入暂存区，提交一次；再把 README 加入暂存区，单独提交一次。这样版本历史会更清楚。

## 分支：另一条时间线

分支就像多元宇宙，是另一条时间线。你在分支上修改代码，不会直接影响 `main` 里的代码。

这在多人合作开发中非常有用。比如要开发一个新功能，可以先创建一个分支，在分支里实现功能。无论中间改成什么样，都不会影响主分支。等功能完善、测试通过以后，再合并回 `main`。

创建并切换到新分支：

```bash
git switch -c feature-login
```

查看所有分支：

```bash
git branch
```

切回主分支：

```bash
git switch main
```

把功能分支合并到当前分支：

```bash
git merge feature-login
```

删除已经合并的分支：

```bash
git branch -d feature-login
```

常见团队协作流程一般是：

```text
从 main 拉出功能分支
  -> 在功能分支开发
  -> 提交并推送分支
  -> 在 GitHub 上创建 Pull Request
  -> 代码审查和测试
  -> 合并回 main
```

Pull Request 通常简称 PR。它不是一个 Git 命令，而是 GitHub 等平台提供的协作功能，用来讨论、审查和合并代码。

## 常用命令合集

下面这些命令覆盖了最常见的 Git 日常使用。

### 查看状态和历史

```bash
git status
git log
git log --oneline
git diff
```

含义分别是：

- `git status`：查看当前有哪些修改、哪些文件在暂存区。
- `git log`：查看提交历史。
- `git log --oneline`：用更简洁的方式查看提交历史。
- `git diff`：查看工作区里还没暂存的具体修改。

### 提交代码

```bash
git add .
git add 文件名
git commit -m "提交说明"
```

含义分别是：

- `git add .`：把当前目录下的所有修改加入暂存区。
- `git add 文件名`：只暂存指定文件。
- `git commit -m "提交说明"`：生成一次提交。

### 远程同步

```bash
git remote -v
git pull
git push
git clone 仓库地址
```

含义分别是：

- `git remote -v`：查看远程仓库地址。
- `git pull`：从远程拉取最新代码并合并到本地。
- `git push`：把本地提交推送到远程。
- `git clone 仓库地址`：把远程仓库下载到本地。

### 分支操作

```bash
git branch
git switch 分支名
git switch -c 新分支名
git merge 分支名
git branch -d 分支名
```

含义分别是：

- `git branch`：查看本地分支。
- `git switch 分支名`：切换分支。
- `git switch -c 新分支名`：创建并切换到新分支。
- `git merge 分支名`：把指定分支合并到当前分支。
- `git branch -d 分支名`：删除已经合并的本地分支。

### 撤销和回退

撤销工作区中某个文件的修改：

```bash
git restore 文件名
```

把文件从暂存区移出来，但保留文件内容：

```bash
git restore --staged 文件名
```

查看某次提交的内容：

```bash
git show 提交ID
```

回到某个历史版本需要更谨慎。初学阶段可以先记住：回退历史前，先用 `git status` 和 `git log --oneline` 看清楚当前状态，不要随手执行会改写历史的命令。

## 一个完整例子

假设你新建了一个项目 `my-app`，想把它放到 GitHub，可以这样做：

```bash
cd my-app
git init
git add .
git commit -m "初始化项目"
git branch -M main
git remote add origin git@github.com:your-name/my-app.git
git push -u origin main
```

以后每次修改代码，大部分时候只需要：

```bash
git status
git add .
git commit -m "说明这次修改"
git push
```

如果是从远程项目开始，则可以先克隆：

```bash
git clone git@github.com:your-name/my-app.git
cd my-app
```

然后再修改、提交、推送。

## 写在最后

Git 一开始会显得有点绕，因为它不是简单的“保存文件”，而是在帮你维护项目的时间线。

但只要先理解几个核心概念，后面就会顺很多：

- 仓库：被 Git 管理的项目。
- 提交：项目在某个时间点的版本。
- 暂存区：下一次提交的准备区。
- 分支：另一条开发时间线。
- 远程仓库：放在 GitHub 等平台上的代码仓库。

刚开始不需要记住所有命令。最重要的是先熟悉这组日常循环：

```bash
git status
git add .
git commit -m "提交说明"
git push
```

能稳定走完这个循环，就已经掌握了 Git 和 GitHub 的核心用法。
