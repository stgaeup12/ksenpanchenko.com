/**
 * Selected Work Component
 * - Sticky scroll pinning & active project index tracking
 * - Animated ASCII glyph digits counter on canvas
 * - Video autoplay / pause management
 * - Animated mobile mockup screen scrolling
 */

const ASCII_NUMBERS = {
  "01": [
    "  .·:▓▓▒:·  ",
    " :▓▓▒==▒▓▓: ",
    " ▓▓*    #▓▓ ",
    " ▓▓      ▓▓ ",
    " ▓▓      ▓▓ ",
    " ▓▓*    #▓▓ ",
    " :▓▓▒==▒▓▓: ",
    "  ·:▓▓▒:·   "
  ],
  "02": [
    "  :▓▓▓▓▓:   ",
    " ▓▓▒   *▓▓* ",
    "        ▓▓▒ ",
    "     ·+▓▓=  ",
    "   :▒▓▓=    ",
    "  #▓▓*      ",
    " ▓▓▓▓▓▓▓▓▓▓ ",
    " ▓▓▓▓▓▓▓▓▓▓ "
  ],
  "03": [
    "  :▓▓▓▓▓:   ",
    " ▓▓▒   *▓▓* ",
    "        ▓▓▒ ",
    "    :▒▓▓▓:  ",
    "        ▓▓▒ ",
    " ▓▓▒   *▓▓* ",
    "  :▓▓▓▓▓:   ",
    "   *#%#*    "
  ],
  "04": [
    "    +▓▓:    ",
    "   #▓▓▓     ",
    "  *▓#▓▓     ",
    " =▓# ▓▓     ",
    " ▓▓▓▓▓▓▓▓▓▓ ",
    "     ▓▓     ",
    "     ▓▓     ",
    "     ▓▓     "
  ]
};

export class SelectedWork {
  constructor(sectionEl, casesData) {
    this.el = sectionEl;
    this.cases = casesData;
    this.activeIndex = 0;
    this.deskEl = this.el.querySelector('.sw__desk');
    this.stickyEl = this.el.querySelector('.sw__sticky');
    this.reels = [...this.el.querySelectorAll('.sw__stage .sw__reel')];
    this.indexItems = [...this.el.querySelectorAll('.sw__index li')];
    this.infoDesc = this.el.querySelector('.sw__desc');
    this.infoCat = this.el.querySelector('.sw__cat');
    this.hitLink = this.el.querySelector('.sw__hit');
    this.counterCanvas = this.el.querySelector('.sw__glyphs');

    this.initCanvasCounter();
    this.initScroll();
    this.initPhoneMockups();
    this.initMobileCards();
  }

  initCanvasCounter() {
    if (!this.counterCanvas) return;
    this.ctx = this.counterCanvas.getContext('2d');
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.resizeCanvas();
    this.renderCounter("01");

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      const numStr = `0${this.activeIndex + 1}`;
      this.renderCounter(numStr);
    });
  }

  resizeCanvas() {
    const rect = this.counterCanvas.getBoundingClientRect();
    const w = rect.width || 288;
    const h = rect.height || 231;
    this.counterCanvas.width = w * this.dpr;
    this.counterCanvas.height = h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  renderCounter(text) {
    if (!this.ctx) return;
    const rect = this.counterCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    this.ctx.clearRect(0, 0, w, h);

    const computed = getComputedStyle(document.documentElement);
    const color = computed.getPropertyValue('--color-illustration-ink-strong').trim() || '#2b2b2b';
    const monoFont = computed.getPropertyValue('--font-family-mono').trim() || 'monospace';

    const lines = ASCII_NUMBERS[text] || ASCII_NUMBERS["01"];
    const fontSize = 14;
    const lineHeight = 16;
    this.ctx.font = `500 ${fontSize}px ${monoFont}`;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';

    const startX = 20;
    const startY = Math.max(10, (h - lines.length * lineHeight) / 2);

    lines.forEach((line, i) => {
      this.ctx.fillText(line, startX, startY + i * lineHeight);
    });
  }

  setActive(idx) {
    if (idx === this.activeIndex || idx < 0 || idx >= this.cases.length) return;
    this.activeIndex = idx;

    // Update index list
    this.indexItems.forEach((li, i) => {
      li.classList.toggle('is-active', i === idx);
    });

    // Update Stage Reels
    this.reels.forEach((reel, i) => {
      const active = i === idx;
      reel.classList.toggle('is-active', active);
      reel.setAttribute('aria-hidden', String(!active));
      const video = reel.querySelector('video');
      if (video) {
        if (active) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });

    // Update info text
    const curCase = this.cases[idx];
    if (this.infoDesc) this.infoDesc.textContent = curCase.desc;
    if (this.infoCat) this.infoCat.textContent = curCase.category;
    if (this.hitLink) {
      this.hitLink.href = curCase.link;
      this.hitLink.setAttribute('aria-label', `View case — ${curCase.title}`);
    }

    // Update counter canvas
    const numStr = `0${idx + 1}`;
    this.renderCounter(numStr);
  }

  initScroll() {
    if (!this.deskEl || !this.stickyEl) return;

    const onScroll = () => {
      if (window.getComputedStyle(this.deskEl).display === 'none') return;
      const deskRect = this.deskEl.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(this.stickyEl).top) || 0;
      const totalScrollable = deskRect.height - this.stickyEl.offsetHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(0.999, Math.max(0, (stickyTop - deskRect.top) / totalScrollable));
      const nextIdx = Math.floor(progress * this.cases.length);
      this.setActive(nextIdx);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  initPhoneMockups() {
    const prStage = this.el.querySelector('.pr');
    if (!prStage) return;

    const tabs = [...prStage.querySelectorAll('.pr__tab')];
    const sets = [...prStage.querySelectorAll('.pr__set')];

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t, ti) => t.classList.toggle('is-on', ti === i));
        sets.forEach((s, si) => {
          const on = si === i;
          s.classList.toggle('is-on', on);
          s.setAttribute('aria-hidden', String(!on));
        });
      });
    });

    // Simulated phone content scrolling
    const screens = [...prStage.querySelectorAll('.pr__screen')];
    let start = performance.now();

    const loop = (now) => {
      const elapsed = (now - start) % 9000;
      const p = elapsed / 9000;
      const smoothP = p < 0.1 ? 0 : p < 0.7 ? (p - 0.1) / 0.6 : 1 - (p - 0.7) / 0.3;
      const offset = smoothP * 80;

      screens.forEach((scr) => {
        const content = scr.querySelector('.pr__content');
        if (content) {
          content.style.transform = `translate3d(0, -${offset.toFixed(1)}px, 0)`;
        }
      });

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  initMobileCards() {
    const mobCards = this.el.querySelectorAll('.sw__mob .sw__card');
    if (mobCards.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector('video');
        if (video) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      });
    }, { threshold: [0, 0.5] });

    mobCards.forEach((c) => observer.observe(c));
  }
}
