# Tech Knowledge

Neo-Brutalist风格的个人技术博客，支持文章浏览和RAG知识库问答。

## 快速开始

```bash
python -m http.server 8081
# 访问 http://localhost:8081
```

## 项目结构

```
tech_knowledge/
├── *.html              # 页面 (index, posts, post, knowledge, about, tools, diagnostic)
├── css/style.css       # Neo-Brutalist样式
├── js/
│   ├── main.js        # 核心应用
│   ├── posts.js       # 文章系统
│   ├── knowledge.js   # RAG知识库
│   └── data/
│       ├── knowledge.json    # 知识库数据
│       └── sections/        # 文章分类 (agent.json, prompts.json, mcp.json等)
└── assets/images/
```

## 技术栈

- 纯前端：无构建依赖，浏览器直接运行
- 样式：CSS Custom Properties + Neo-Brutalist设计
- 数据：JSON文件存储
- 字体：Space Grotesk, Noto Sans SC, JetBrains Mono

## 页面说明

| 页面 | 功能 |
|------|------|
| index.html | 首页 |
| posts.html | 文章列表（支持筛选、搜索、分页） |
| post.html | 文章详情 |
| knowledge.html | RAG知识库（AI对话） |
| about.html | 关于 |
| tools.html | 工具 |
| diagnostic.html | 诊断 |

## 添加文章

在 `js/data/sections/` 目录下的对应分类JSON文件中添加文章，字段：
- `slug`: URL路径
- `title`: 标题
- `excerpt`: 摘要
- `date`: 日期
- `tags`: 标签数组
- `readTime`: 阅读时间
- `content`: 正文（Markdown格式）

## 设计规范

- 暗色主题：背景 `#0D1117`，主色 `#00FF88`，辅色 `#8B5CF6`
- 边框：2px solid，border-radius: 8px
- 硬阴影：无模糊
- 响应式：移动优先 (768px, 1024px)