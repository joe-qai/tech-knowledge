const CATEGORY_MAP = {
  'agent': 'Agent',
  'prompts': 'Prompts',
  'mcp': 'MCP',
  'skills': 'Skills',
  'llm': 'LLM',
  'ai-tools': 'AI工具',
  'agent-platform': '智能体平台',
  'performance': '性能测试',
  'automation': '自动化测试',
  'testing-theory': '测试理论',
  'interview': '面试题库'
};

const Posts = {
  data: {
    allPosts: [],
    filteredPosts: [],
    currentPage: 1,
    postsPerPage: 6
  },

  async init() {
    console.log('[Posts] Initializing...');
    await this.loadPosts();
    console.log('[Posts] allPosts loaded:', this.data.allPosts.length);
    this.setupFilters();
    this.applyUrlFilter();
    console.log('[Posts] filteredPosts after filter:', this.data.filteredPosts.length);
    this.renderPosts();
    this.setupPagination();
  },

  async loadPosts() {
    try {
      const allPosts = [];
      const sectionFiles = [
        './js/data/sections/agent.json',
        './js/data/sections/prompts.json',
        './js/data/sections/mcp.json',
        './js/data/sections/skills.json',
        './js/data/sections/llm.json',
        './js/data/sections/ai-tools.json',
        './js/data/sections/agent-platform.json',
        './js/data/sections/performance.json',
        './js/data/sections/automation.json',
        './js/data/sections/testing-theory.json',
        './js/data/sections/interview.json'
      ];

      console.log('[Posts] Starting to load posts...');

      for (const file of sectionFiles) {
        try {
          const response = await fetch(file);
          if (!response.ok) {
            console.warn('[Posts] File not found or error:', file, response.status);
            continue;
          }
          const data = await response.json();
          if (data.articles && Array.isArray(data.articles)) {
            const categorySlug = data.categorySlug || '';
            const categoryName = data.category || '';
            console.log(`[Posts] Loaded ${data.articles.length} from ${categorySlug}`);
            data.articles.forEach(article => {
              allPosts.push({
                ...article,
                _categorySlug: categorySlug,
                _categoryName: categoryName
              });
            });
          }
        } catch (e) {
          console.warn('[Posts] Error loading', file, ':', e.message);
        }
      }

      console.log('[Posts] Total posts loaded:', allPosts.length);

      this.data.allPosts = allPosts;
      this.data.filteredPosts = allPosts;
    } catch (error) {
      console.error('[Posts] Critical error in loadPosts:', error);
      this.data.allPosts = [];
      this.data.filteredPosts = [];
    }
  },

  async loadAllPostsForDetail() {
    const allPosts = [];
    const sectionFiles = [
      './js/data/sections/agent.json',
      './js/data/sections/prompts.json',
      './js/data/sections/mcp.json',
      './js/data/sections/skills.json',
      './js/data/sections/llm.json',
      './js/data/sections/ai-tools.json',
      './js/data/sections/agent-platform.json',
      './js/data/sections/performance.json',
      './js/data/sections/automation.json',
      './js/data/sections/testing-theory.json',
      './js/data/sections/interview.json'
    ];

    for (const file of sectionFiles) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          const data = await response.json();
          if (data.articles && Array.isArray(data.articles)) {
            const categorySlug = data.categorySlug || '';
            const categoryName = data.category || '';
            const articlesWithCategory = data.articles.map(article => ({
              ...article,
              _categorySlug: categorySlug,
              _categoryName: categoryName
            }));
            allPosts.push(...articlesWithCategory);
          }
        }
      } catch (e) {
        console.warn('Failed to load:', file, e);
      }
    }

    if (allPosts.length === 0) {
      try {
        const response = await fetch('./js/data/posts.json');
        return await response.json();
      } catch (e) {
        return [];
      }
    }

    return allPosts;
  },

  applyUrlFilter() {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    if (tag) {
      const filterBtns = document.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tag && btn.dataset.tag.toLowerCase() === tag.toLowerCase()) {
          btn.classList.add('active');
        }
      });
      this.filterByTag(tag);
    }
  },

  setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tag = btn.dataset.tag || 'all';
        this.filterByTag(tag);
      });
    });
  },

  filterByTag(tag) {
    if (tag === 'all') {
      this.data.filteredPosts = [...this.data.allPosts];
    } else {
      const lowerTag = tag.toLowerCase();
      this.data.filteredPosts = this.data.allPosts.filter(post => {
        if (post._categoryName && post._categoryName.toLowerCase() === lowerTag) return true;
        if (post._categorySlug && post._categorySlug.toLowerCase() === lowerTag) return true;
        if (post.tags && post.tags.some(t => t.toLowerCase() === lowerTag)) return true;
        const mappedName = CATEGORY_MAP[lowerTag];
        if (mappedName && post.tags && post.tags.some(t => t.toLowerCase() === mappedName.toLowerCase())) return true;
        return false;
      });
    }
    this.data.currentPage = 1;
    this.renderPosts();
    this.setupPagination();
  },

  searchPosts(query) {
    if (!query.trim()) {
      this.data.filteredPosts = [...this.data.allPosts];
    } else {
      const lowerQuery = query.toLowerCase();
      this.data.filteredPosts = this.data.allPosts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(lowerQuery)))
      );
    }
    this.data.currentPage = 1;
    this.renderPosts();
    this.setupPagination();
  },

  renderPosts() {
    const container = document.getElementById('posts-container');
    if (!container) {
      console.error('[Posts] posts-container not found');
      return;
    }

    try {
      const start = (this.data.currentPage - 1) * this.data.postsPerPage;
      const end = start + this.data.postsPerPage;
      const postsToShow = this.data.filteredPosts.slice(start, end);

      console.log('[Posts] Rendering', postsToShow.length, 'posts, total filtered:', this.data.filteredPosts.length);

      if (postsToShow.length === 0) {
        container.innerHTML = this.renderEmptyState();
        return;
      }

      const html = postsToShow.map((post, index) => {
        const categoryName = post._categoryName || '';
        const categorySlug = post._categorySlug || '';
        const categoryColor = this.getCategoryColor(categorySlug);
        return `
          <article class="post-item">
            <div class="post-item-number">${String(start + index + 1).padStart(2, '0')}</div>
            <div class="post-item-content">
              ${categoryName ? `<span class="post-category-badge" style="background: ${categoryColor}20; color: ${categoryColor}; border: 1px solid ${categoryColor}40;">${categoryName}</span>` : ''}
              <h3 class="post-item-title">
                <a href="post.html?slug=${post.slug}">${this.escapeHtml(post.title || '')}</a>
              </h3>
              <div class="post-item-meta">
                <span>${this.formatDate(post.date)}</span>
                <span>&middot;</span>
                <span>${post.author || '测试工程师'}</span>
              </div>
              <p class="post-item-excerpt">${this.escapeHtml(post.excerpt || '')}</p>
              <div class="post-tags">
                ${post.tags ? post.tags.slice(0, 3).map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('') : ''}
              </div>
            </div>
          </article>
        `;
      }).join('');

      container.innerHTML = html;
    } catch (error) {
      console.error('[Posts] Error rendering posts:', error);
      container.innerHTML = '<div class="empty-state"><p>渲染错误，请刷新页面</p></div>';
    }
  },

  getCategoryColor(slug) {
    const colors = {
      'agent': '#8b5cf6',
      'prompts': '#ec4899',
      'mcp': '#06b6d4',
      'skills': '#f59e0b',
      'llm': '#3b82f6',
      'ai-tools': '#10b981',
      'agent-platform': '#6366f1',
      'performance': '#ef4444',
      'automation': '#22c55e',
      'testing-theory': '#f97316',
      'interview': '#a855f7'
    };
    return colors[slug] || 'var(--color-primary)';
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 class="empty-title">没有找到相关文章</h3>
        <p class="empty-desc">试试其他关键词，或者浏览全部文章</p>
        <button class="btn btn-secondary" onclick="Posts.filterByTag('all')">
          浏览全部文章
        </button>
      </div>
    `;
  },

  setupPagination() {
    const totalPages = Math.ceil(this.data.filteredPosts.length / this.data.postsPerPage);
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let paginationHTML = `
      <button class="page-btn" ${this.data.currentPage === 1 ? 'disabled' : ''} onclick="Posts.goToPage(${this.data.currentPage - 1})">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.data.currentPage - 1 && i <= this.data.currentPage + 1)) {
        paginationHTML += `
          <button class="page-btn ${i === this.data.currentPage ? 'active' : ''}" onclick="Posts.goToPage(${i})">
            ${i}
          </button>
        `;
      } else if (i === this.data.currentPage - 2 || i === this.data.currentPage + 2) {
        paginationHTML += `<span class="page-ellipsis">...</span>`;
      }
    }

    paginationHTML += `
      <button class="page-btn" ${this.data.currentPage === totalPages ? 'disabled' : ''} onclick="Posts.goToPage(${this.data.currentPage + 1})">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `;

    paginationContainer.innerHTML = paginationHTML;
  },

  goToPage(page) {
    const totalPages = Math.ceil(this.data.filteredPosts.length / this.data.postsPerPage);
    if (page < 1 || page > totalPages) return;
    this.data.currentPage = page;
    this.renderPosts();
    this.setupPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const PostDetail = {
  data: {
    post: null
  },

  async init() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
      window.location.href = 'posts.html';
      return;
    }

    await this.loadPost(slug);
    if (this.data.post) {
      this.renderPost();
      this.renderRelatedPosts();
      this.renderTOC();
    }
  },

  async loadPost(slug) {
    try {
      const posts = await Posts.loadAllPostsForDetail();
      this.data.post = posts.find(p => p.slug === slug);

      if (!this.data.post) {
        this.render404();
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      this.render404();
    }
  },

  renderPost() {
    const post = this.data.post;

    document.title = `${post.title} | Tech Knowledge`;

    const header = document.querySelector('.post-detail-header');
      if (header) {
        const categoryName = post._categoryName || post.category || '未分类';
        const categorySlug = post._categorySlug || post.categorySlug || '';
        const categoryTag = categorySlug ? `?tag=${encodeURIComponent(categorySlug)}` : `?tag=${encodeURIComponent(categoryName)}`;
        header.innerHTML = `
          <div class="post-detail-breadcrumb">
            <a href="posts.html" class="breadcrumb-item">文章</a>
            <span class="breadcrumb-separator">&gt;</span>
            <a href="posts.html${categoryTag}" class="breadcrumb-item breadcrumb-category">${categoryName}</a>
          </div>
          <h1 class="post-detail-title">${this.escapeHtml(post.title)}</h1>
          <div class="post-detail-meta">
            <span class="meta-item">📅 ${Posts.formatDate(post.date)}</span>
            <span class="meta-divider">·</span>
            <span class="meta-item">👤 ${post.author || '测试工程师'}</span>
          </div>
          <div class="post-detail-tags">
            ${post.tags ? post.tags.map(tag => `<span class="tag">#${this.escapeHtml(tag)}</span>`).join(' ') : ''}
          </div>
        `;
      }

    const content = document.getElementById('post-content');
    if (content) {
      content.innerHTML = this.renderMarkdown(post.content);
      // Trigger Prism syntax highlighting after content is rendered
      if (typeof Prism !== 'undefined') {
        Prism.highlightAllUnder(content);
      }
    }
  },

  renderMarkdown(text) {
    if (!text) return '';
    let html = text;

    html = this.renderTable(html);

    // Step 1: Replace fenced code blocks with placeholders to protect content
    const blocks = [];
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const idx = blocks.length;
      blocks.push({ lang: lang || 'plaintext', code: this.escapeHtml(code.trim()) });
      return `\n{{CODEBLOCK_${idx}}}\n`;
    });

    // Step 2: Process markdown (safe — code blocks are now placeholders)
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ordered">$1</li>');

    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    html = html.replace(/^---$/gm, '<hr>');

    html = this.renderLists(html);

    // Paragraph wrapping
    const paragraphs = html.split('\n\n');
    html = paragraphs.map(p => {
      if (!p.trim()) return '';
      if (/^<(h|ul|ol|blockquote|hr|table)/.test(p)) return p;
      return `<p>${p.trim()}</p>`;
    }).join('\n');

    // Step 3: Restore code blocks
    html = html.replace(/\{\{CODEBLOCK_(\d+)\}\}/g, (match, idx) => {
      const { lang, code } = blocks[parseInt(idx)];
      return `<div class="code-block"><div class="code-block-header"><span class="code-lang-label">${lang}</span><button class="copy-btn" onclick="PostDetail.copyCode(this)">复制</button></div><pre><code class="language-${lang}">${code}</code></pre></div>`;
    });

    return html;
  },

  renderLists(text) {
    const lines = text.split('\n');
    const result = [];
    let inUnorderedList = false;
    let inOrderedList = false;
    let listItems = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const unorderedMatch = line.match(/^<li>(?!class="ordered")(.+)<\/li>$/);
      const orderedMatch = line.match(/^<li class="ordered">(.+)<\/li>$/);

      if (unorderedMatch && !inOrderedList) {
        if (inUnorderedList) {
          listItems.push(unorderedMatch[1]);
        } else {
          if (inOrderedList) {
            result.push('<ol>' + listItems.map(item => `<li>${item.replace(/<li class="ordered">|<\/li>/g, '')}</li>`).join('') + '</ol>');
            inOrderedList = false;
          }
          inUnorderedList = true;
          listItems = [unorderedMatch[1]];
        }
      } else if (orderedMatch && !inUnorderedList) {
        if (inOrderedList) {
          listItems.push(orderedMatch[1]);
        } else {
          if (inUnorderedList) {
            result.push('<ul>' + listItems.map(item => `<li>${item}</li>`).join('') + '</ul>');
            inUnorderedList = false;
          }
          inOrderedList = true;
          listItems = [orderedMatch[1]];
        }
      } else {
        if (inUnorderedList) {
          result.push('<ul>' + listItems.map(item => `<li>${item}</li>`).join('') + '</ul>');
          inUnorderedList = false;
          listItems = [];
        } else if (inOrderedList) {
          result.push('<ol>' + listItems.map(item => `<li>${item}</li>`).join('') + '</ol>');
          inOrderedList = false;
          listItems = [];
        }
        result.push(line);
      }
    }

    if (inUnorderedList) {
      result.push('<ul>' + listItems.map(item => `<li>${item}</li>`).join('') + '</ul>');
    } else if (inOrderedList) {
      result.push('<ol>' + listItems.map(item => `<li>${item}</li>`).join('') + '</ol>');
    }

    return result.join('\n');
  },

  renderTable(text) {
    const tableRegex = /^\|(.+)\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/gm;
    return text.replace(tableRegex, (match, headerRow, bodyRows) => {
      const headers = headerRow.split('|').map(h => h.trim()).filter(h => h);
      const rows = bodyRows.trim().split('\n').map(row => {
        return row.split('|').map(cell => cell.trim()).filter(cell => cell);
      });

      let thead = '<thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead>';
      let tbody = '<tbody>' + rows.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('') + '</tbody>';

      return `<table>${thead}${tbody}</table>`;
    });
  },

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  copyCode(btn) {
    const code = btn.previousElementSibling.textContent;
    navigator.clipboard.writeText(code).then(() => {
      btn.textContent = '已复制!';
      setTimeout(() => btn.textContent = '复制', 2000);
    });
  },

  renderTOC() {
    const tocContainer = document.getElementById('toc-list');
    if (!tocContainer || !this.data.post) return;

    const headings = document.querySelectorAll('.post-body h2, .post-body h3');
    if (headings.length === 0) {
      document.querySelector('.toc-sidebar')?.remove();
      return;
    }

    tocContainer.innerHTML = Array.from(headings).map((h, i) => {
      const level = h.tagName === 'H2' ? '' : 'level-3';
      const id = h.id || `heading-${i}`;
      if (!h.id) h.id = id;
      return `<li class="toc-item"><a href="#${id}" class="toc-link ${level}">${h.textContent}</a></li>`;
    }).join('');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.toc-link').forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-100px 0px -80% 0px' });

    headings.forEach(h => observer.observe(h));
  },

  renderRelatedPosts() {
    const container = document.getElementById('related-posts');
    if (!container || !this.data.post) return;

    const currentTags = this.data.post.tags || [];
    Posts.loadAllPostsForDetail().then(allPosts => {
      const related = allPosts
        .filter(p => p.slug !== this.data.post.slug)
        .map(p => ({
          ...p,
          relevance: (p.tags || []).filter(t => currentTags.includes(t)).length
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 3);

      if (related.length === 0) {
        document.querySelector('.related-posts')?.remove();
        return;
      }

      container.innerHTML = related.map(post => `
        <a href="post.html?slug=${post.slug}" class="related-card">
          <h4 class="related-card-title">${this.escapeHtml(post.title)}</h4>
          <span class="related-card-date">${Posts.formatDate(post.date)}</span>
        </a>
      `).join('');
    });
  },

  render404() {
    document.body.innerHTML = `
      <div class="container" style="padding: 100px 0; text-align: center;">
        <h1 style="font-size: 80px; margin-bottom: 24px;">404</h1>
        <p style="font-size: 24px; margin-bottom: 32px;">文章不存在或已被删除</p>
        <a href="posts.html" class="btn btn-primary">返回文章列表</a>
      </div>
    `;
  }
};

window.Posts = Posts;
window.PostDetail = PostDetail;
