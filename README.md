# ⭐ GitHub Star

一目了然的 GitHub 著名开源软件收录页：卡片浏览、分类筛选、关键词搜索，点卡片直达仓库。

- 站点：Next.js（App Router）构建，部署在 Vercel
- 数据：全部收录内容只维护一份 `data/projects.json`；star 数、主语言由服务端从 GitHub 公开接口拉取，每小时自动刷新（ISR）

## 添加一个软件

编辑 `data/projects.json`，按格式加一条，然后推送即可，页面会自动更新：

```json
{ "repo": "作者/仓库名", "blurb": "一句话中文简介", "category": "分类", "tags": ["标签"] }
```

分类现有一览：AI 工具、代理工具、开发工具、影音娱乐、系统工具、安卓工具、效率工具（也可新增）。

## 本地运行

```bash
npm install
npm run dev
```

## 部署

把本仓库导入 Vercel 即完成部署，之后每次推送到 master 自动重新上线。
