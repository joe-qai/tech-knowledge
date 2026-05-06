# TechBlog - 个人技术博客与RAG知识库

## 1. Concept & Vision

一个充满个性的 Neo-Brutalist 技术博客，拒绝千篇一律的极简风格，用大胆的色块、粗犷的边框和原始的美学诠释程序员的代码世界。这里不仅是技术沉淀的空间，更是一个可以与AI对话的RAG知识库。整体感觉：**大胆、直接、有态度**。

## 2. Design Language

### Aesthetic Direction
**Neo-Brutalism** — 受早期互联网和印刷设计启发，大胆的色块、粗黑的边框、笨拙但真诚的阴影、不对称布局。高对比度、功能至上、拒绝装饰性虚伪。

### Color Palette
```
Primary:        #FF6B35 (活力橙 - 主强调色)
Secondary:      #4ECDC4 (薄荷绿 - 代码/科技感)
Accent:         #FFE66D (明黄 - 高亮/警示)
Background:     #FAFAFA (浅灰白)
Surface:        #FFFFFF (纯白卡片)
Dark:           #1A1A2E (深紫黑 - 深色区域)
Text Primary:   #1A1A2E
Text Secondary: #666666
Border:         #1A1A2E (3-4px粗边框)
Shadow:         4px 4px 0px #1A1A2E (硬阴影，无模糊)
Error:          #FF3366
Success:        #00D26A
```

### Typography
- **Headings**: `Space Grotesk` (粗犷几何感) / `Noto Sans SC` (中文备选)
- **Body**: `Inter` (清晰可读) / `Noto Sans SC` (中文)
- **Code**: `JetBrains Mono` (等宽代码字体)
- **Font Scale**: 14 / 16 / 18 / 24 / 32 / 48 / 64 px

### Spatial System
- Base unit: 8px
- Spacing scale: 8 / 16 / 24 / 32 / 48 / 64 / 96px
- Border radius: 0px (直角) 或 4px (微圆角)
- Border width: 3px (标准) / 4px (强调)
- Shadow offset: 4px 4px (标准) / 6px 6px (强调)

### Motion Philosophy
- **Duration**: 150-200ms (微交互) / 300ms (页面过渡)
- **Easing**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (自然退出)
- **Principles**:
  - Hover时元素位移 (-2px, -2px) + 阴影扩大
  - 点击时下沉效果 (+2px, +2px) + 阴影缩小
  - 页面元素使用staggered entrance (50ms间隔)
  - 禁止花哨的3D变换，保持2D平面感

### Visual Assets
- **Icons**: Lucide Icons (stroke-width: 2px, 风格粗犷)
- **Images**: Unsplash高质量技术/代码相关图片
- **Decorative**:
  - 斜条纹背景 (45deg, 4px间隔)
  - 圆点网格背景
  - 色块拼接
  - 手绘风格装饰线

## 3. Layout & Structure

### Page Structure

#### 首页 (/)
```
┌─────────────────────────────────────────────────────────┐
│  [HEADER] - Logo + Nav + 搜索图标                        │
├─────────────────────────────────────────────────────────┤
│  [HERO] - 标语 + 副标题 + CTA按钮                        │
│  大字号、粗边框卡片、不对称布局                          │
├─────────────────────────────────────────────────────────┤
│  [FEATURES] - 3列卡片展示核心功能                        │
│  "技术文章" | "RAG知识库" | "代码片段"                    │
├─────────────────────────────────────────────────────────┤
│  [RECENT POSTS] - 最新文章列表 (5篇)                     │
│  带编号的大胆卡片布局                                    │
├─────────────────────────────────────────────────────────┤
│  [FOOTER] - 社交链接 + 版权                              │
└─────────────────────────────────────────────────────────┘
```

#### 文章列表页 (/posts.html)
```
┌─────────────────────────────────────────────────────────┐
│  [HEADER] - Logo + Nav + 搜索图标                        │
├─────────────────────────────────────────────────────────┤
│  [PAGE TITLE] - "所有文章" + 文章总数                    │
├─────────────────────────────────────────────────────────┤
│  [FILTERS] - 标签筛选器 (水平滚动)                       │
├─────────────────────────────────────────────────────────┤
│  [POST GRID] - 2列网格布局                               │
│  每张卡片: 标题 + 摘要 + 日期 + 标签 + 阅读时间           │
├─────────────────────────────────────────────────────────┤
│  [PAGINATION] - 页码导航                                 │
└─────────────────────────────────────────────────────────┘
```

#### 文章详情页 (/post.html)
```
┌─────────────────────────────────────────────────────────┐
│  [HEADER] - Logo + Nav + 搜索图标                        │
├─────────────────────────────────────────────────────────┤
│  [POST HEADER] - 标题 + 元信息 + 标签                     │
├─────────────────────────────────────────────────────────┤
│  [POST CONTENT] - Markdown渲染的正文                      │
│  代码块高亮、表格、引用块等                               │
├─────────────────────────────────────────────────────────┤
│  [TABLE OF CONTENTS] - 文章目录 ( sticky sidebar)        │
├─────────────────────────────────────────────────────────┤
│  [RELATED POSTS] - 相关文章推荐                           │
└─────────────────────────────────────────────────────────┘
```

#### RAG知识库页 (/knowledge.html)
```
┌─────────────────────────────────────────────────────────┐
│  [HEADER] - Logo + Nav + 搜索图标                        │
├─────────────────────────────────────────────────────────┤
│  [PAGE TITLE] - "知识库" + 说明文字                      │
├─────────────────────────────────────────────────────────┤
│  [SEARCH BAR] - 大输入框 + AI搜索按钮                     │
├─────────────────────────────────────────────────────────┤
│  [CHAT INTERFACE] - 对话界面                            │
│  用户消息 + AI回复 + 来源引用                            │
├─────────────────────────────────────────────────────────┤
│  [SUGGESTED QUERIES] - 推荐问题chips                     │
└─────────────────────────────────────────────────────────┘
```

#### 关于页 (/about.html)
```
┌─────────────────────────────────────────────────────────┐
│  [HEADER] - Logo + Nav + 搜索图标                        │
├─────────────────────────────────────────────────────────┤
│  [PROFILE CARD] - 头像 + 简介 + 技能标签                 │
├─────────────────────────────────────────────────────────┤
│  [TIMELINE] - 技术成长时间线                             │
├─────────────────────────────────────────────────────────┤
│  [CONTACT] - 联系方式 + 社交链接                         │
└─────────────────────────────────────────────────────────┘
```

### Responsive Strategy
- **Desktop**: 1200px max-width, 3/2列网格
- **Tablet** (768px-1199px): 2列网格，侧栏折叠
- **Mobile** (<768px): 单列堆叠，底部固定导航

## 4. Features & Interactions

### 核心功能

#### 1. 文章系统
- **列表展示**: 卡片式布局，支持缩略图
- **标签筛选**: 点击标签过滤文章，支持多标签组合
- **搜索**: 实时搜索标题和内容关键词
- **分页**: 每页10篇，支持页码跳转

#### 2. RAG知识库
- **语义搜索**: 输入自然语言问题
- **AI对话**: 基于本地知识库的问答
- **来源追溯**: 显示答案引用的文章片段
- **历史记录**: 保存最近10次对话

#### 3. 代码片段库
- **分类浏览**: 按语言/框架分类
- **一键复制**: 点击复制代码
- **语法高亮**: 使用Prism.js

### Interaction Details

#### 卡片Hover
```
默认: shadow = 4px 4px 0 #1A1A2E
Hover: transform = translate(-2px, -2px)
       shadow = 6px 6px 0 #1A1A2E
       border-color = #FF6B35 (5ms过渡)
```

#### 按钮Click
```
默认: shadow = 4px 4px 0 #1A1A2E
Active: transform = translate(2px, 2px)
        shadow = 2px 2px 0 #1A1A2E
```

#### 搜索框Focus
- 边框变粗 (3px → 4px)
- 边框颜色变为 Primary (#FF6B35)
- 添加斜纹背景动画

### Edge Cases
- **空搜索结果**: 显示"没有找到相关文章，试试其他关键词？"
- **加载状态**: 骨架屏 + 脉冲动画
- **错误状态**: 红色边框 + 错误图标 + 重试按钮
- **文章不存在**: 404页面 + 返回首页链接

## 5. Component Inventory

### Header
- **默认**: 白色背景，底部3px黑色边框
- **滚动**: 添加轻微阴影
- **Mobile**: 汉堡菜单触发侧边抽屉

### Button (Primary)
- **Default**: bg=#FF6B35, text=white, border=3px solid #1A1A2E, shadow=4px 4px 0 #1A1A2E
- **Hover**: translate(-2px, -2px), shadow扩大为6px 6px
- **Active**: translate(2px, 2px), shadow缩小为2px 2px
- **Disabled**: opacity=0.5, cursor=not-allowed, 无阴影

### Card (Post Card)
- **Default**: bg=white, border=3px solid #1A1A2E, shadow=4px 4px 0
- **Hover**: translate(-2px, -2px), shadow=6px 6px 0, 边框变橙色
- **Tags**: 小号pill组件，border=2px

### Input
- **Default**: border=3px solid #1A1A2E, bg=white, p=12px 16px
- **Focus**: border-color=#FF6B35, 添加斜纹背景
- **Error**: border-color=#FF3366, 添加错误提示文字

### Tag
- **Default**: bg=#4ECDC4, text=#1A1A2E, border=2px solid #1A1A2E
- **Hover**: bg=#1A1A2E, text=white
- **Active**: bg=#FF6B35, text=white

### Chat Bubble
- **User**: 右对齐，bg=#FF6B35，text=white
- **AI**: 左对齐，bg=white，border=3px solid #1A1A2E
- **Loading**: 三个脉冲圆点动画

### Toast
- **Success**: bg=#00D26A, text=white, icon=check-circle
- **Error**: bg=#FF3366, text=white, icon=alert-circle
- **Info**: bg=#4ECDC4, text=#1A1A2E, icon=info

## 6. Technical Approach

### Architecture
- **纯前端**: HTML5 + CSS3 + Vanilla JavaScript
- **无构建依赖**: 直接浏览器运行
- **模块化CSS**: 使用CSS Custom Properties管理主题

### Data Storage
- **文章数据**: JSON文件存储 (posts.json)
- **知识库索引**: 本地向量搜索 (使用 Fuse.js 做模糊匹配)
- **用户偏好**: LocalStorage (主题、语言)

### External Dependencies
- **Icons**: Lucide Icons (CDN)
- **Fonts**: Google Fonts (Space Grotesk, Inter, JetBrains Mono, Noto Sans SC)
- **代码高亮**: Prism.js (CDN)
- **搜索**: Fuse.js (模糊搜索)

### 文件结构
```
tech-blog/
├── index.html          # 首页
├── posts.html          # 文章列表
├── post.html           # 文章详情
├── knowledge.html      # RAG知识库
├── about.html          # 关于页
├── css/
│   └── style.css       # 主样式文件
├── js/
│   ├── main.js         # 主逻辑
│   ├── posts.js        # 文章相关
│   ├── knowledge.js    # 知识库相关
│   └── data/
│       ├── posts.json  # 文章数据
│       └── knowledge.json # 知识库数据
└── assets/
    └── images/         # 图片资源
```

### RAG实现方案
1. **知识库构建**: 将文章内容分块，提取关键词和摘要
2. **语义匹配**: 使用TF-IDF + Fuse.js实现模糊匹配
3. **问答生成**: 基于匹配结果生成回答，引用来源
4. **交互界面**: 类似ChatGPT的对话UI

## 7. Content Strategy

### 文章分类
- **前端**: Vue, React, CSS, TypeScript
- **后端**: Node.js, Python, 数据库
- **工具**: Git, Docker, Linux
- **思想**: 架构、设计模式、技术领导力

### 示例文章数据
1. "Vue3 Composition API 最佳实践"
2. "从零构建RAG知识库系统"
3. "TypeScript类型体操入门"
4. "Docker Compose编排实战"
5. "CSS Grid布局完全指南"
