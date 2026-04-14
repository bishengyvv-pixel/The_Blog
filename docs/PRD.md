# 技术博客产品需求文档 (PRD)

## 1. 项目概述

### 1.1 项目基本信息
- **项目名称**: 个人技术博客
- **项目类型**: 公网静态技术博客
- **核心目标**: 沉淀技术文章，作为个人知识库长期维护

### 1.2 项目约束
- 输出方式为 **Static Export**（纯静态 HTML/CSS/JS，无服务端运行时）
- 部署方式: 自有服务器 + 已有域名
- 无 CMS / 后台管理，文章通过 Git 管理

---

## 2. 技术架构

### 2.1 架构分层

```
┌─────────────────────────────────────────────────┐
│                 Content Layer                    │
│   posts/*.md                                    │
│   → Vite import.meta.glob (构建时静态读取)        │
│   → src/utils/posts.ts (frontmatter 解析)        │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│               Rendering Layer                    │
│   react-markdown    → Markdown → React 组件      │
│   remark-gfm        → GFM 语法支持               │
│   rehype-highlight  → 代码语法高亮               │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│            Text Layout Layer                     │
│   @chenglou/pretext                             │
│   ├── prepare / layout        文本高度测量       │
│   ├── layoutWithLines         Canvas 行布局      │
│   ├── measureLineStats        行数统计           │
│   ├── layoutNextLineRange     变宽文字绕排        │
│   └── prepareRichInline       富文本内联流        │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│                  UI Layer                        │
│   React 19          框架                        │
│   Tailwind CSS v4   样式                        │
│   React Router v7   路由                        │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│                 Build Layer                      │
│   Vite 6 + @tailwindcss/vite                   │
│   TypeScript 5.7                               │
│   输出: dist/ (纯静态文件)                       │
└─────────────────────────────────────────────────┘
```

### 2.2 依赖清单

| 包 | 版本 | 用途 |
|----|------|------|
| react | ^19.0.0 | UI 框架 |
| react-dom | ^19.0.0 | DOM 渲染 |
| react-router-dom | ^7.1.0 | 客户端路由 |
| react-markdown | ^9.0.0 | Markdown → React 渲染 |
| remark-gfm | ^4.0.0 | GitHub 风格 Markdown 扩展 |
| rehype-highlight | ^7.0.0 | 代码块语法高亮 |
| rehype-slug | ^6.0.0 | 标题自动生成锚点 id |
| @chenglou/pretext | latest | 文本测量与布局引擎 |
| vite | ^6.0.0 | 构建工具 |
| @tailwindcss/vite | ^4.0.0 | Tailwind CSS v4 Vite 插件 |
| tailwindcss | ^4.0.0 | 原子化 CSS |
| typescript | ^5.7.0 | 类型系统 |

### 2.3 关于 @chenglou/pretext

**定位**: 纯 JS/TS 多行文本测量与布局引擎，绕过 DOM layout reflow，用 Canvas `measureText` 作为字体引擎。

**在本项目中的具体应用**:

| 组件 / 功能 | pretext API | 作用 |
|------------|------------|------|
| `PostCard` 文章卡片 | `prepare` + `layout` | 精确计算摘要文本高度，统一卡片高度，消除 CLS |
| 阅读时长估算 | `measureLineStats` | 按实际渲染行数估算阅读时间，比纯字数统计更准 |
| 标签云 `TagCloud` | `measureNaturalWidth` | 精确获取标签文字宽度，用于 Canvas 渲染标签云特效 |
| 文章列表虚拟滚动 | `prepare` + `layout` | 预计算每条卡片高度，支持大量文章时的精准虚拟滚动 |
| 文字绕图排版 | `layoutNextLineRange` | 文章正文图片旁的文字按变宽折行排版 |
| 富文本标签行 | `prepareRichInline` | 分类/标签组合行的精确内联流布局 |

---

## 3. 内容规划

### 3.1 内容方向
| 序号 | 内容方向 | 说明 |
|------|----------|------|
| 1 | 前端开发 | React、工程化、性能优化等 |
| 2 | 运维 | 服务器配置、Docker、CI/CD 等 |
| 3 | JS 逆向 | 浏览器调试、混淆分析、实战案例 |
| 4 | Python | 爬虫、自动化、数据分析等 |
| 5 | 其他技术 | 根据学习进度扩展 |

### 3.2 内容组织方式
- **分类**: 按技术领域划分
- **标签**: 按具体技术点划分
- **时间线**: 按发布日期归档
- **专题**: 系列文章聚合，支持学习路径

### 3.3 写作与发布流程
1. 在 `posts/` 目录下新建 `.md` 文件（文件名即为 URL slug）
2. 顶部写 frontmatter 元数据
3. 正文使用标准 Markdown / GFM 语法
4. `draft: true` 可设为草稿，构建时自动跳过
5. Git 提交 → `npm run build` → 上传 `dist/` 到服务器

---

## 4. 文章元数据 (Frontmatter)

### 4.1 基础字段（必填）
```yaml
---
title: "文章标题"
date: "2024-01-01"
category: "前端"
tags: ["React", "Hook"]
draft: false
---
```

### 4.2 扩展字段（可选）
```yaml
---
summary: "文章摘要，用于列表卡片展示"
cover: "/images/cover.png"
updatedAt: "2024-01-15"
top: false
seoTitle: "SEO 专用标题"
seoDescription: "SEO 专用描述"
series: "JS 逆向入门"
seriesOrder: 1
---
```

---

## 5. 页面规划

### 5.1 首页 (/)
- 个人简介横幅
- 最新文章列表（5 篇）
- 分类浏览入口

### 5.2 文章列表页 (/posts)
- 所有文章卡片列表
- 支持分类 / 标签筛选
- 分页

### 5.3 文章详情页 (/posts/[slug])
| 元素 | 说明 |
|------|------|
| 标题 | 文章主标题 |
| 发布 / 更新时间 | 日期展示 |
| 分类 + 标签 | 可点击跳转 |
| 阅读时长 | pretext 行数统计估算 |
| 目录导航 (TOC) | 自动提取标题，滚动高亮 |
| 正文 | react-markdown 渲染 |
| 代码块 | 语法高亮 + 行号 + 复制按钮 |
| 文字绕图 | pretext 变宽排版（可选增强） |
| 上一篇 / 下一篇 | 文章间导航 |
| 版权声明 | 底部固定 |

### 5.4 分类页 (/categories)
- 分类卡片网格，显示文章数量

### 5.5 分类详情页 (/categories/[category])
- 该分类下文章列表

### 5.6 标签页 (/tags)
- Canvas 渲染标签云（pretext 精确宽度 + 按频率缩放）

### 5.7 标签详情页 (/tags/[tag])
- 该标签下文章列表

### 5.8 专题列表页 (/series)
- 专题卡片，显示简介和文章数

### 5.9 专题详情页 (/series/[series])
- 专题简介
- 按 `seriesOrder` 排序的文章列表
- 完成状态标记（localStorage）

### 5.10 时间线页 (/timeline)
- 按年月分组，倒序展示所有文章

### 5.11 关于页 (/about)
- 个人介绍、技术栈、联系方式、社交链接

---

## 6. 导航与布局

### 6.1 顶部导航栏
- 导航项: 首页 / 文章 / 分类 / 标签 / 专题 / 时间线 / 关于
- 深浅色主题切换按钮
- 移动端汉堡菜单
- 不主动展示 RSS 入口，但 `/rss.xml` 可访问

### 6.2 布局原则
- 无侧边栏，全宽内容
- 响应式，适配桌面 / 平板 / 手机

### 6.3 底部 Footer
- 版权声明
- 社交链接（GitHub / 邮箱）
- 网站运行时长（从首次部署日期计算）

---

## 7. 视觉设计

### 7.1 色彩方案
- 手动切换深浅色模式
- 浅色: 白底黑字，清爽
- 深色: 黑底白字，护眼

### 7.2 风格
- 技术感为主（代码元素、等宽字体）+ 杂志风为辅（图文混排）

### 7.3 字体
- 中文: 思源宋体（Noto Serif SC）
- 代码: JetBrains Mono

### 7.4 代码块
- VS Code 深色主题
- 语法高亮（rehype-highlight）
- 行号 + 复制按钮

---

## 8. 功能需求

### 8.1 Markdown 渲染
- 标准 Markdown + GFM（表格、任务列表、删除线等）
- 图片懒加载
- 外链自动 `target="_blank"`

### 8.2 代码高亮
- 语言自动识别
- VS Code 深色主题
- 行号显示
- 一键复制

### 8.3 目录导航 (TOC)
- 自动提取 h2 / h3 标题（rehype-slug 生成 id）
- 点击平滑滚动
- 滚动时高亮当前章节（IntersectionObserver）

### 8.4 阅读时长估算
- pretext `measureLineStats` 统计实际渲染行数
- 中文按 300 字/分钟，代码块按行数折算

### 8.5 标签云
- pretext `measureNaturalWidth` 获取精确文字宽度
- Canvas 渲染，频率越高字号越大
- 点击跳转对应标签详情页

### 8.6 文章卡片高度一致性
- pretext `prepare` + `layout` 预测摘要文本高度
- 保证网格卡片等高，消除 CLS（布局偏移）

### 8.7 RSS 订阅
- 构建时生成 `/rss.xml`
- 包含最新 20 篇文章

### 8.8 网站运行时长
- Footer 实时计算，从写死的首次部署日期起算

---

## 9. 项目结构

```
the_Blog/
├── docs/
│   ├── PRD.md
│   └── pretext-readme.md
├── posts/                        # Markdown 文章（文件名 = slug）
│   └── hello-world.md
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── components/
│   │   ├── Header.tsx            # 顶部导航 + 主题切换
│   │   ├── Footer.tsx            # 底部信息 + 运行时长
│   │   ├── PostCard.tsx          # 文章卡片（pretext 等高）
│   │   ├── TagCloud.tsx          # Canvas 标签云（pretext）
│   │   ├── TOC.tsx               # 目录导航（滚动高亮）
│   │   ├── CodeBlock.tsx         # 代码块（高亮 + 复制）
│   │   └── ThemeToggle.tsx       # 深浅色切换
│   ├── layouts/
│   │   └── BaseLayout.tsx        # Header + Outlet + Footer
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── PostList.tsx
│   │   ├── PostDetail.tsx
│   │   ├── Categories.tsx
│   │   ├── CategoryDetail.tsx
│   │   ├── Tags.tsx
│   │   ├── TagDetail.tsx
│   │   ├── SeriesList.tsx
│   │   ├── SeriesDetail.tsx
│   │   ├── Timeline.tsx
│   │   └── About.tsx
│   ├── styles/
│   │   └── global.css            # Tailwind 入口 + CSS 变量
│   ├── utils/
│   │   ├── posts.ts              # import.meta.glob 读取 + frontmatter 解析
│   │   ├── readingTime.ts        # pretext 行数估算阅读时长
│   │   └── rss.ts                # RSS XML 生成
│   └── vite-env.d.ts
├── dist/                         # 构建输出（不提交 Git）
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 10. 构建与部署

### 10.1 构建流程
```
1. Vite 启动构建
2. import.meta.glob 读取 posts/*.md 原始文本
3. posts.ts 解析 frontmatter，过滤 draft
4. react-markdown + rehype-highlight 渲染 Markdown
5. @chenglou/pretext 在组件内执行文本测量
6. Tailwind CSS v4 扫描类名生成样式
7. 输出 dist/（HTML / CSS / JS / rss.xml）
```

### 10.2 部署流程
```
1. git push 触发（或手动执行）npm run build
2. 将 dist/ 上传到自有服务器
3. Nginx 配置 try_files $uri $uri/ /index.html
4. 绑定已有域名，配置 HTTPS
```

---

## 11. 里程碑

### Phase 1: 基础搭建 ✅
- [x] React 19 + Vite 6 项目初始化
- [x] Tailwind CSS v4 接入
- [x] 基础布局（Header / Footer / BaseLayout）
- [x] 深浅色主题切换
- [x] Markdown frontmatter 解析（import.meta.glob）
- [x] React Router v7 路由配置

### Phase 2: 内容渲染 ✅
- [x] 安装 react-markdown + remark-gfm + rehype-highlight + rehype-slug + @chenglou/pretext
- [x] PostDetail 接入 react-markdown，替换 dangerouslySetInnerHTML
- [x] CodeBlock 组件：语法高亮 + 行号 + 复制按钮
- [x] TOC 组件：标题提取 + 锚点滚动 + IntersectionObserver 高亮
- [x] readingTime.ts：@chenglou/pretext measureLineStats 行数估算阅读时长
- [x] prose-content 排版样式（标题、列表、表格、引用、图片）

### Phase 3: 列表与索引页 ✅
- [x] PostList 分页（每页 10 篇）+ 分类/标签筛选器
- [x] Categories / CategoryDetail（已有，功能完整）
- [x] Tags 页：Canvas 标签云（pretext measureNaturalWidth 精确宽度 + 频率缩放）
- [x] TagDetail（已有，功能完整）
- [x] SeriesList（已有）/ SeriesDetail 进度条 + localStorage 完成状态
- [x] Timeline：年 → 月两级分组，含分类/标签展示

### Phase 4: 高级功能 ✅
- [x] PostCard 等高（pretext `prepare` + `layout` 测量 2 行摘要高度，设 `minHeight`）
- [x] RSS 生成（`vite-plugin-rss.ts`：构建 `closeBundle` 钩子写入 `dist/rss.xml`，最新 20 篇）
- [x] SEO：`useSEO` hook 动态更新 `<title>` / `<meta description>`，已应用至全部页面
- [ ] 文字绕图排版（pretext `layoutNextLineRange`，选做，暂缓）

### Phase 5: 优化与部署 ✅
- [x] 响应式全面适配（移动端字号收缩、card padding 缩减、PostDetail 间距调整）
- [x] 图片懒加载（PostDetail `<img loading="lazy">`）
- [ ] 性能审计（Lighthouse，需部署后执行）
- [ ] Nginx 配置 + HTTPS + 域名绑定（参见 §12.3，部署时执行）

---

## 12. 附录

### 12.1 命名规范
- Markdown 文件名: `kebab-case.md`（即 URL slug）
- React 组件: `PascalCase.tsx`
- 工具函数 / 变量: `camelCase`

### 12.2 URL 规范
| 页面 | URL |
|------|-----|
| 首页 | `/` |
| 文章列表 | `/posts` |
| 文章详情 | `/posts/[slug]` |
| 分类列表 | `/categories` |
| 分类详情 | `/categories/[category]` |
| 标签列表 | `/tags` |
| 标签详情 | `/tags/[tag]` |
| 专题列表 | `/series` |
| 专题详情 | `/series/[series]` |
| 时间线 | `/timeline` |
| 关于 | `/about` |
| RSS | `/rss.xml` |

### 12.3 Nginx 参考配置
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    root /var/www/the_blog/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|svg|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

**文档版本**: v2.2
**创建日期**: 2026-04-14
**最后更新**: 2026-04-14
