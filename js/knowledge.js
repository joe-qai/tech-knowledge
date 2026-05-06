const Knowledge = {
  data: {
    knowledge: null,
    chatHistory: [],
    isLoading: false
  },

  async init() {
    await this.loadKnowledge();
    this.setupEventListeners();
    this.renderSuggestedQueries();
    this.loadChatHistory();
  },

  async loadKnowledge() {
    try {
      const response = await fetch('./js/data/knowledge.json');
      this.data.knowledge = await response.json();
    } catch (error) {
      console.error('Failed to load knowledge:', error);
      this.data.knowledge = { knowledge_chunks: [], faq_answers: {}, suggested_queries: [] };
    }
  },

  setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch();
        }
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.handleSearch());
    }
  },

  renderSuggestedQueries() {
    const container = document.getElementById('suggested-queries');
    if (!container || !this.data.knowledge?.suggested_queries) return;

    container.innerHTML = `
      <div class="suggested-title">试试这些问题：</div>
      <div class="suggested-chips">
        ${this.data.knowledge.suggested_queries.map(query => `
          <button class="chip" onclick="Knowledge.executeQuery('${this.escapeHtml(query)}')">
            ${this.escapeHtml(query)}
          </button>
        `).join('')}
      </div>
    `;
  },

  async handleSearch() {
    const input = document.getElementById('search-input');
    const query = input?.value.trim();

    if (!query) {
      App.showToast('请输入问题', 'error');
      return;
    }

    await this.executeQuery(query);
    input.value = '';
  },

  async executeQuery(query) {
    if (this.data.isLoading) return;

    this.data.isLoading = true;
    this.addMessage(query, 'user');
    this.showTypingIndicator();

    await this.simulateAIThinking(query);

    this.data.isLoading = false;
    this.removeTypingIndicator();
  },

  simulateAIThinking(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = this.generateResponse(query);
        this.addMessage(response.answer, 'ai', response.sources);
        this.saveChatHistory();
        resolve();
      }, 1500);
    });
  },

  generateResponse(query) {
    const lowerQuery = query.toLowerCase();
    const knowledge = this.data.knowledge;

    const faqMatch = Object.entries(knowledge.faq_answers).find(([key]) =>
      lowerQuery.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerQuery)
    );

    if (faqMatch) {
      const [key, answer] = faqMatch;
      const chunk = knowledge.knowledge_chunks.find(c => c.source_id === this.getSourceIdByKeyword(key));
      return {
        answer: answer,
        sources: chunk ? [{ ...chunk, relevance: 0.95 }] : []
      };
    }

    const scoredChunks = knowledge.knowledge_chunks.map(chunk => {
      let score = 0;
      chunk.keywords.forEach(keyword => {
        if (lowerQuery.includes(keyword.toLowerCase())) score += 0.3;
      });
      if (chunk.title.toLowerCase().includes(lowerQuery)) score += 0.4;
      if (chunk.content.toLowerCase().includes(lowerQuery)) score += 0.2;
      return { ...chunk, relevance: Math.min(score, 1) };
    });

    const relevantChunks = scoredChunks
      .filter(c => c.relevance > 0.1)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3);

    if (relevantChunks.length === 0) {
      return {
        answer: `抱歉，我没有找到与"${query}"直接相关的信息。不过我可以告诉你一些相关的知识点：\n\n` +
          knowledge.knowledge_chunks.slice(0, 2).map(c =>
            `• **${c.title}**：${c.content.substring(0, 100)}...`
          ).join('\n\n'),
        sources: knowledge.knowledge_chunks.slice(0, 2).map(c => ({ ...c, relevance: 0.3 }))
      };
    }

    const topChunk = relevantChunks[0];
    let answer = '';

    if (topChunk.relevance > 0.7) {
      answer = `根据我的知识库，关于"${query}"的信息如下：\n\n${topChunk.content}`;
    } else if (topChunk.relevance > 0.4) {
      answer = `我找到了一些相关信息，可能对你有帮助：\n\n${topChunk.content}\n\n此外，还有以下相关话题：\n` +
        relevantChunks.slice(1, 3).map(c => `• ${c.title}`).join('\n');
    } else {
      answer = `这个问题涉及多个知识领域，让我来解答：\n\n` +
        relevantChunks.map(c => `**${c.title}**：\n${c.content.substring(0, 150)}...`).join('\n\n');
    }

    return {
      answer: answer,
      sources: relevantChunks
    };
  },

  getSourceIdByKeyword(keyword) {
    const keywordMap = {
      'vue3 reactive vs ref': 1,
      'vue3 ref reactive': 1,
      '学习typescript': 3,
      'typescript入门': 3,
      'docker部署': 4,
      'docker compose': 4,
      'css grid': 5,
      'flexbox': 5,
      'git commit': 6
    };

    for (const [key, id] of Object.entries(keywordMap)) {
      if (keyword.includes(key)) return id;
    }
    return null;
  },

  addMessage(content, type, sources = []) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const messageHTML = `
      <div class="chat-message ${type}">
        <div class="message-bubble">${this.formatMessage(content)}</div>
        ${sources.length > 0 && type === 'ai' ? this.renderSources(sources) : ''}
      </div>
    `;

    container.insertAdjacentHTML('beforeend', messageHTML);
    container.scrollTop = container.scrollHeight;

    this.data.chatHistory.push({ type, content, sources });
  },

  formatMessage(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '<br>• ');
  },

  renderSources(sources) {
    return `
      <div class="chat-sources">
        <div class="chat-sources-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline; vertical-align: middle; margin-right: 4px;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          参考来源
        </div>
        <ul class="chat-sources-list">
          ${sources.map(s => `
            <li class="chat-sources-item">
              <a href="post.html?slug=${this.getPostSlug(s.source_id)}" class="chat-sources-link" target="_blank">
                ${this.escapeHtml(s.source)}
              </a>
              <span style="color: var(--color-text-secondary); font-size: 11px; margin-left: 8px;">
                相似度: ${Math.round(s.relevance * 100)}%
              </span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  },

  getPostSlug(sourceId) {
    const slugMap = {
      1: 'vue3-composition-api-best-practices',
      2: 'build-rag-knowledge-base-from-scratch',
      3: 'typescript-type-manipulation',
      4: 'docker-compose-orchestration',
      5: 'css-grid-layout-complete-guide',
      6: 'git-workflow-best-practices',
      7: 'nodejs-performance-optimization',
      8: 'react-server-components-deep-dive'
    };
    return slugMap[sourceId] || 'posts';
  },

  showTypingIndicator() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    container.insertAdjacentHTML('beforeend', `
      <div class="chat-message ai" id="typing-indicator">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `);
    container.scrollTop = container.scrollHeight;
  },

  removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  },

  saveChatHistory() {
    try {
      const recentHistory = this.data.chatHistory.slice(-10);
      localStorage.setItem('techblog_chat_history', JSON.stringify(recentHistory));
    } catch (e) {
      console.warn('Failed to save chat history:', e);
    }
  },

  loadChatHistory() {
    try {
      const saved = localStorage.getItem('techblog_chat_history');
      if (saved) {
        const history = JSON.parse(saved);
        history.forEach(msg => {
          const container = document.getElementById('chat-messages');
          if (container && msg.type === 'ai') {
            const messageHTML = `
              <div class="chat-message ${msg.type}">
                <div class="message-bubble">${this.formatMessage(msg.content)}</div>
                ${msg.sources?.length > 0 ? this.renderSources(msg.sources) : ''}
              </div>
            `;
            container.insertAdjacentHTML('beforeend', messageHTML);
          }
        });
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
  },

  clearHistory() {
    this.data.chatHistory = [];
    localStorage.removeItem('techblog_chat_history');
    const container = document.getElementById('chat-messages');
    if (container) container.innerHTML = '';
    App.showToast('聊天历史已清除', 'success');
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

window.Knowledge = Knowledge;
