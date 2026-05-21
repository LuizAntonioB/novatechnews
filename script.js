
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggle = document.querySelectorAll('[data-theme-toggle]');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const searchForms = document.querySelectorAll('[data-search-form]');
  const articleCards = document.querySelectorAll('[data-article-card]');
  const readingBar = document.getElementById('readingBar');
  const sidebarProgress = document.getElementById('sidebarProgress');
  const readTimeLeft = document.getElementById('readTimeLeft');
  const now = new Date();
  const opts = { weekday:'long', day:'numeric', month:'long', year:'numeric' };
  const dateText = now.toLocaleDateString('pt-BR', opts);
  const dateEls = document.querySelectorAll('[data-current-date]');
  dateEls.forEach(el => {
    el.textContent = dateText.charAt(0).toUpperCase() + dateText.slice(1);
    if (el.tagName === 'TIME') el.dateTime = now.toISOString().slice(0,10);
  });
  const yearEls = document.querySelectorAll('[data-footer-year]');
  yearEls.forEach(el => el.textContent = now.getFullYear());

  const savedTheme = localStorage.getItem('novatech-theme');
  if (savedTheme === 'light') root.classList.add('light');

  const updateThemeIcon = () => {
    themeToggle.forEach(btn => {
      const isLight = root.classList.contains('light');
      btn.setAttribute('aria-pressed', String(isLight));
      btn.innerHTML = isLight
        ? '<span class="inline-flex items-center gap-2"><span>🌙</span><span class="hidden sm:inline">Modo escuro</span></span>'
        : '<span class="inline-flex items-center gap-2"><span>☀️</span><span class="hidden sm:inline">Modo claro</span></span>';
    });
  };
  updateThemeIcon();

  themeToggle.forEach(btn => btn.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('novatech-theme', root.classList.contains('light') ? 'light' : 'dark');
    updateThemeIcon();
  }));

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const hidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(hidden));
    });
  }

  searchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (!input) return;
      const q = input.value.trim().toLowerCase();
      if (!articleCards.length) return;
      let visible = 0;
      articleCards.forEach(card => {
        const text = (card.dataset.search || '').toLowerCase();
        const match = !q || text.includes(q);
        card.classList.toggle('hidden', !match);
        if (match) visible++;
      });
      const empty = document.getElementById('searchEmpty');
      if (empty) empty.classList.toggle('hidden', visible !== 0);
    });
  });

  const article = document.querySelector('[data-article-page]');
  if (article && readingBar) {
    const totalWords = Number(article.dataset.words || 900);
    const wpm = 200;
    const updateProgress = () => {
      const articleTop = article.getBoundingClientRect().top + window.scrollY;
      const articleHeight = article.offsetHeight;
      const scrolled = Math.max(0, window.scrollY - articleTop);
      const maxScrollable = Math.max(1, articleHeight - window.innerHeight);
      const pct = Math.min(100, Math.round((scrolled / maxScrollable) * 100));
      readingBar.style.width = pct + '%';
      if (sidebarProgress) sidebarProgress.style.width = pct + '%';
      if (readTimeLeft) {
        const remaining = Math.ceil(totalWords * ((100 - pct) / 100) / wpm);
        readTimeLeft.textContent = remaining > 0 ? `~${remaining} min restantes` : '✓ Leitura concluída!';
      }
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = document.getElementById('contactFeedback');
      if (feedback) {
        feedback.textContent = 'Mensagem enviada com sucesso! Em um projeto local, este formulário pode ser conectado a um back-end ou serviço de e-mail.';
        feedback.classList.remove('hidden');
      }
      contactForm.reset();
    });
  }

  const newsletterButtons = document.querySelectorAll('[data-newsletter]');
  newsletterButtons.forEach(btn => btn.addEventListener('click', () => {
    const wrapper = btn.closest('[data-newsletter-box]');
    const input = wrapper ? wrapper.querySelector('input[type="email"]') : null;
    if (!input || !input.value.includes('@')) {
      if (input) {
        input.value = '';
        input.placeholder = 'Digite um e-mail válido';
      }
      return;
    }
    input.value = '';
    input.placeholder = '✓ Cadastro realizado!';
  }));
});
