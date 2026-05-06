# Agent Guidelines for Tech Knowledge Repository

Static Neo-Brutalist tech blog with RAG knowledge base. No build system required.

## Project Structure
```
tech_knowledge/
├── *.html              # Pages (index, posts, post, knowledge, about, tools, diagnostic)
├── css/style.css       # Neo-Brutalist styles (dark theme with green/purple accent)
├── js/
│   ├── main.js        # Core app: App = { init, loadPosts, loadKnowledge }
│   ├── posts.js     # Posts + PostDetail (loads from sections/*.json)
│   ├── knowledge.js # RAG knowledge base (local JSON search)
│   └── data/
│       ├── posts.json      # Legacy (unused)
│       ├── knowledge.json  # Knowledge chunks + FAQ
│       └── sections/       # Article files (agent.json, prompts.json, etc.)
└── assets/images/
```

## Commands

### Run Development Server
```bash
python -m http.server 8081
# Access at http://localhost:8081
```

No test suite in repo. Manual browser testing required.

## Code Style

### CSS (actual `:root` from style.css)
- Dark theme: `--color-primary: #00FF88`, `--color-secondary: #8B5CF6`, `--color-accent: #06B6D4`
- `--color-bg: #0D1117`, `--color-surface: #161B22`
- Fonts: Space Grotesk (headings), Noto Sans SC (body), JetBrains Mono (code)
- Borders: 2px solid, border-radius: 8px, hard shadows (no blur)

### JavaScript Patterns
```javascript
const App = {
  async init() { await this.loadPosts(); },
  async loadPosts() {
    try {
      const res = await fetch('./js/data/posts.json');
      this.data.posts = await res.json();
    } catch (e) { console.error('Failed:', e); }
  }
};
window.App = App;  // Export for console access
```

- Use async/await, try/catch on all fetch operations
- Posts module reads from 11 JSON files in `js/data/sections/`:
  - `agent.json`, `prompts.json`, `mcp.json`, `skills.json`, `llm.json`
  - `ai-tools.json`, `agent-platform.json`, `performance.json`, `automation.json`
  - `interview.json`, `testing-theory.json`
- Each section has `categorySlug`, `category`, and `articles[]`

### Naming
| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `main.js`, `posts.json` |
| CSS Classes | BEM | `.post-card__title`, `.btn--primary` |
| JavaScript | camelCase | `currentPage`, `loadPosts()` |
| HTML IDs | kebab-case | `posts-container` |

## Common Tasks

### Adding a Post
1. Add to appropriate section file in `js/data/sections/` (e.g., `agent.json`)
2. Required fields: `slug`, `title`, `excerpt`, `date`, `tags`, `readTime`, `content`

### Debugging
- Open browser console to see logs from JS modules
- `window.Posts` and `window.PostDetail` available for testing
- Check Network tab for failed JSON fetch requests

## UI/UX (Neo-Brutalist)
- Bold borders (2-3px), hard shadows (no blur), high contrast
- Mobile-first responsive (breakpoints: 768px, 1024px)
- Touch targets: minimum 44px
- Follow SPEC.md for detailed design specs