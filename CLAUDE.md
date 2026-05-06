# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tech Knowledge** — A Neo-Brutalist dark-theme personal tech blog focused on software testing & AI engineering. Pure frontend (HTML/CSS/Vanilla JS), no build system, deployed to GitHub Pages.

## Commands

### Run Dev Server
```bash
python -m http.server 8081
# Access at http://localhost:8081
```

### Deploy
Push to `main` branch — GitHub Actions (`.github/workflows/static.yml`) auto-deploys to GitHub Pages.

### Testing
No test suite in repo. Manual browser testing required.

## Architecture

### Module System
Three independent JS modules, each exposed on `window` for console debugging:

| Module | Global | Entry Point | Responsibility |
|--------|--------|-------------|----------------|
| `js/main.js` | `window.App` | `App.init()` | Core app: data store, navigation, toast notifications, utility functions |
| `js/posts.js` | `window.Posts`, `window.PostDetail` | `Posts.init()` / `PostDetail.init()` | Article listing, filtering, search, pagination, detail view with Markdown rendering |
| `js/knowledge.js` | `window.Knowledge` | `Knowledge.init()` | RAG knowledge base chat UI with local keyword-based search |

### Data Flow
- **Articles**: Stored as JSON in `js/data/sections/` (11 files). Each file has `{ categorySlug, category, articles[] }`. `Posts.loadPosts()` fetches 10 section files via `fetch()`; `testing-theory.json` is only loaded by `PostDetail` (mapped to category "面试题库").
- **Knowledge Base**: `js/data/knowledge.json` with `{ knowledge_chunks[], faq_answers{}, suggested_queries[] }`.
- **Category Index**: `js/data/sections/index.json` defines all 11 categories with metadata.

### Page-to-Module Mapping
| Page | Scripts Loaded | Modules Used |
|------|---------------|--------------|
| `index.html` | `main.js` + inline | `App`, `CATEGORIES`, `TECH_STACK` |
| `posts.html` | `main.js` + `posts.js` | `App`, `Posts` |
| `post.html` | `main.js` + `posts.js` | `App`, `PostDetail` |
| `knowledge.html` | `main.js` + `knowledge.js` | `App`, `Knowledge` |
| `about.html` | `main.js` | `App` |
| `tools.html` | `main.js` + inline | `App` |

### Post Detail Rendering
`PostDetail.renderMarkdown()` is a custom (non-library) Markdown parser handling: headings, bold/italic, code blocks, inline code, lists (ordered/unordered), blockquotes, tables, links, horizontal rules. It is **not** a full Markdown spec implementation — complex Markdown may render incorrectly.

## Design System (Dark Theme)

### Colors (from `css/style.css`)
```
Primary:   #00FF88 (green)
Secondary: #8B5CF6 (purple)
Accent:    #06B6D4 (cyan)
Bg:        #0D1117
Surface:   #161B22
Card:      #1C2128
Border:    #30363D
```

### Typography
- Headings: `Space Grotesk`
- Body: `Noto Sans SC`
- Code: `JetBrains Mono`

### Category Colors
Each article category has a fixed color (defined in `Posts.getCategoryColor()` and `index.html` `CATEGORIES`):
- `agent`: #8b5cf6, `prompts`: #ec4899, `mcp`: #06b6d4, `skills`: #f59e0b, `llm`: #3b82f6, `ai-tools`: #10b981, `agent-platform`: #6366f1, `performance`: #ef4444, `automation`: #22c55e, `interview`: #a855f7, `testing-theory`: #f97316

## Adding Content

### New Article
1. Add entry to the appropriate file in `js/data/sections/`
2. Required fields: `slug`, `title`, `excerpt`, `date`, `tags`, `readTime`, `content` (Markdown)
3. The `slug` becomes the URL parameter: `post.html?slug=<slug>`

### New Category
1. Create `js/data/sections/<new-slug>.json` with `{ categorySlug, category, articles[] }`
2. Add to `sectionFiles` array in both `Posts.loadPosts()` and `Posts.loadAllPostsForDetail()`
3. Add to `CATEGORIES` array in `index.html`
4. Add color mapping in `Posts.getCategoryColor()`
5. Update `CATEGORY_MAP` in `posts.js` if needed

## Naming Conventions
- Files: `kebab-case` (`main.js`, `posts.json`)
- CSS Classes: BEM-style (`.post-card__title`, `.btn--primary`)
- JavaScript: `camelCase` (`currentPage`, `loadPosts()`)
- HTML IDs: `kebab-case` (`posts-container`)

## Key Notes
- No CDN dependencies — all code is self-contained (no external Markdown library, no Fuse.js, no Lucide Icons CDN despite what SPEC.md says)
- `js/data/posts.json` is a legacy file, not actively used
- The knowledge base uses **keyword-based matching**, not true RAG/semantic search
- Mobile menu toggled via `.mobile-open` class on `.nav`
- GitHub Pages deployment: entire repo root is uploaded as static content
