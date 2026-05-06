const App = {
  data: {
    posts: [],
    knowledge: null,
    currentPage: 1,
    postsPerPage: 10,
    currentFilter: 'all',
    searchQuery: ''
  },

  async init() {
    await this.loadPosts();
    await this.loadKnowledge();
    this.setupNavigation();
    this.renderComponents();
  },

  async loadPosts() {
    try {
      const response = await fetch('./js/data/posts.json');
      this.data.posts = await response.json();
    } catch (error) {
      console.error('Failed to load posts:', error);
      this.data.posts = [];
    }
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

  setupNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }
  },

  renderComponents() {
    this.renderHeader();
    this.renderFooter();
  },

  renderHeader() {
    const header = document.getElementById('header');
    if (!header) return;
  },

  renderFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;
  },

  toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    if (nav) {
      nav.classList.toggle('mobile-open');
    }
  },

  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());

window.App = App;
