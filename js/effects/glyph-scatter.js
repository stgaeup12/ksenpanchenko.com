/**
 * Interactive ASCII Glyph Particle / Scatter Canvas Engine
 * Recreates the exact particle physics from ksenpanchenko.com:
 * - High-DPI canvas glyph caching
 * - Cursor proximity deflection & elastic return
 * - Shockwave burst physics on click / tap
 * - Character scrambling and twinkling
 * - Theme and reduce-motion support
 */

const GLYPH_CHARS = "#+=-:.*/%·";

export class GlyphScatter {
  constructor(container, options = {}) {
    this.container = container;
    this.canvas = container.querySelector('canvas') || document.createElement('canvas');
    if (!this.canvas.parentElement) {
      this.container.appendChild(this.canvas);
    }

    this.options = Object.assign({
      src: '/glyphs/branch.json',
      cols: 208,
      rows: 114,
      aspect: 1.2222,
      color: 'accent',
      opacity: 0.7,
      scrollScatter: false,
      burst: true,
      burstFrom: null
    }, options);

    this.ctx = this.canvas.getContext('2d');
    this.cache = new Map();
    this.lastSizeKey = 0;
    this.burstQueue = [];
    this.raf = 0;
    this.destroyed = false;

    this.data = null;
    this.init();
  }

  async init() {
    try {
      const res = await fetch(this.options.src);
      this.data = await res.json();
      this.setupPhysics();
      this.bindEvents();
      this.startLoop();
    } catch (err) {
      console.warn('GlyphScatter failed to load data:', err);
    }
  }

  setupPhysics() {
    const computed = getComputedStyle(document.documentElement);
    this.color = this.options.color === 'accent'
      ? (computed.getPropertyValue('--color-accent-default').trim() || '#FF5C2E')
      : (computed.getPropertyValue('--color-text-primary').trim() || '#141414');
    this.fontFamily = computed.getPropertyValue('--font-family-mono').trim() || 'monospace';

    this.dpr = Math.min(window.innerWidth < 768 ? 1.5 : 2, window.devicePixelRatio || 1);

    const cells = this.data.cells;
    const aspect = this.data.aspect || this.options.aspect;
    const cols = this.data.cols || this.options.cols;
    const rows = this.data.rows || this.options.rows;

    const rect = this.container.getBoundingClientRect();
    this.containerW = rect.width || 800;
    this.containerH = rect.height || (this.containerW / (cols / (rows * aspect)));

    // Scale & density
    const targetCols = Math.max(12, Math.round(this.containerW / (window.innerWidth < 768 ? 5 : 6.5)));
    const scale = targetCols / cols;
    const targetRows = Math.max(1, Math.round(rows * scale));

    const grid = new Map();
    for (const [cx, cy, ch, , alpha] of cells) {
      const scx = Math.floor(cx * scale);
      const ecx = Math.max(scx + 1, Math.floor((cx + 1) * scale));
      const scy = Math.floor(cy * scale);
      const ecy = Math.max(scy + 1, Math.floor((cy + 1) * scale));
      const cov = (alpha / 9) * Math.min(1, scale * scale);

      for (let y = scy; y < ecy; y++) {
        for (let x = scx; x < ecx; x++) {
          if (x < 0 || y < 0 || x >= targetCols || y >= targetRows) continue;
          const key = 4096 * y + x;
          const existing = grid.get(key);
          if (existing) {
            existing.cov += cov;
            if (alpha > existing.a) {
              existing.a = alpha;
              existing.ch = ch;
            }
          } else {
            grid.set(key, { a: alpha, ch, cov });
          }
        }
      }
    }

    const filtered = [];
    grid.forEach((val, key) => {
      const cov = Math.min(1, val.cov);
      if (cov < 0.08) return;
      const a = Math.max(1, Math.min(9, Math.round(val.a * (0.45 + 0.55 * Math.min(1, 1.6 * cov)))));
      filtered.push([key % 4096, Math.floor(key / 4096), val.ch, 0, a]);
    });

    this.cols = targetCols;
    this.rows = targetRows;
    this.aspect = aspect;
    this.count = filtered.length;

    this.posX = new Float32Array(this.count);
    this.posY = new Float32Array(this.count);
    this.alpha = new Float32Array(this.count);
    this.chars = new Array(this.count);
    this.origChars = new Array(this.count);

    // Physics velocities and drift
    this.velX = new Float32Array(this.count);
    this.velY = new Float32Array(this.count);
    this.drift = new Float32Array(this.count);
    this.springX = new Float32Array(this.count);
    this.springY = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      const [x, y, ch, , a] = filtered[i];
      this.posX[i] = x + 0.5;
      this.posY[i] = y + 0.5;
      this.alpha[i] = (a / 9) * this.options.opacity;
      this.chars[i] = this.origChars[i] = ch;

      const lx = x / this.cols - 0.5;
      const ly = y / this.rows - 0.42;
      const dist = Math.hypot(lx, ly);
      const angle = Math.atan2(ly, lx) + (Math.random() - 0.5) * 1.6;
      const speed = 0.5 + 0.9 * Math.random();

      this.velX[i] = Math.cos(angle) * speed;
      this.velY[i] = Math.sin(angle) * speed - 0.25 * Math.random();
      this.drift[i] = Math.max(0, Math.min(0.45, (0.62 - dist) * 0.5 + 0.22 * Math.random()));
    }

    this.resizeCanvas();
  }

  resizeCanvas() {
    const rect = this.container.getBoundingClientRect();
    this.containerW = rect.width;
    this.containerH = rect.height;

    this.canvasW = Math.ceil(this.containerW);
    this.canvasH = Math.ceil(this.containerH);

    this.canvas.width = this.canvasW * this.dpr;
    this.canvas.height = this.canvasH * this.dpr;
    this.canvas.style.width = `${this.canvasW}px`;
    this.canvas.style.height = `${this.canvasH}px`;

    this.cache.clear();
  }

  getGlyphSprite(char, size) {
    const key = `${char}_${size.toFixed(1)}`;
    let sprite = this.cache.get(key);
    if (!sprite) {
      const fontSize = 1.25 * size;
      const dprScale = 1.8 * this.dpr;
      const dim = Math.ceil(1.4 * fontSize * dprScale) + 2;

      sprite = document.createElement('canvas');
      sprite.width = sprite.height = dim;
      const sctx = sprite.getContext('2d');
      sctx.scale(dprScale, dprScale);
      sctx.fillStyle = this.color;
      sctx.textAlign = 'center';
      sctx.textBaseline = 'middle';
      sctx.font = `500 ${fontSize.toFixed(2)}px ${this.fontFamily}`;
      sctx.fillText(char, dim / dprScale / 2, dim / dprScale / 2);

      this.cache.set(key, sprite);
    }
    return sprite;
  }

  startLoop() {
    let pointerX = -10000;
    let pointerY = -10000;
    const startTime = performance.now();
    const enterDuration = 2200;

    this.onPointerMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
    };

    this.onPointerLeave = () => {
      pointerX = -10000;
      pointerY = -10000;
    };

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    this.container.addEventListener('pointerleave', this.onPointerLeave, { passive: true });

    const render = (now) => {
      if (this.destroyed) return;

      const elapsed = now - startTime;
      const introProgress = Math.min(1, elapsed / enterDuration);
      // Ease out cubic
      const introEase = 1 - Math.pow(1 - introProgress, 3);
      const scatterAmount = 1 - introEase;

      const cellW = this.containerW / this.cols;
      const cellH = cellW * this.aspect;

      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);

      // Clean old shockwaves
      while (this.burstQueue.length > 0 && now - this.burstQueue[0].time > 1300) {
        this.burstQueue.shift();
      }

      for (let i = 0; i < this.count; i++) {
        const homeX = this.posX[i] * cellW;
        const homeY = this.posY[i] * cellH;

        let deflectX = 0;
        let deflectY = 0;
        let maxBurstForce = 0;

        // Pointer repulsion (70px radius)
        if (pointerX > -1000) {
          const dx = homeX - pointerX;
          const dy = homeY - pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < 4900 && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 70) * 18;
            deflectX += (dx / dist) * force;
            deflectY += (dy / dist) * force;
          }
        }

        // Click / tap shockwaves
        for (const burst of this.burstQueue) {
          const dt = (now - burst.time) / 1000;
          const waveRadius = 1150 * dt;
          const dx = homeX - burst.x;
          const dy = homeY - burst.y;
          const dist = Math.hypot(dx, dy) || 1;
          const wave = 56 * Math.exp(-Math.pow((dist - waveRadius) / 90, 2)) * Math.pow(Math.max(0, 1 - dt / 1.3), 2);
          if (wave > 0.2) {
            deflectX += (dx / dist) * wave;
            deflectY += (dy / dist) * wave;
            maxBurstForce = Math.max(maxBurstForce, wave);
          }
        }

        // Smooth spring physics (0.25 smoothing)
        this.springX[i] += (deflectX - this.springX[i]) * 0.25;
        this.springY[i] += (deflectY - this.springY[i]) * 0.25;

        // Calculate final position
        const drawX = homeX + this.springX[i] + this.velX[i] * this.containerW * 0.75 * scatterAmount;
        const drawY = homeY + this.springY[i] + this.velY[i] * this.containerW * 0.75 * scatterAmount;

        let currentAlpha = Math.min(1, this.alpha[i] * Math.pow(1 - scatterAmount, 1.6) * (1 + maxBurstForce / 28));

        // Random character scrambling during burst
        if (scatterAmount > 0.02 || maxBurstForce > 7) {
          if (Math.random() < (maxBurstForce > 7 ? 0.25 : 0.07)) {
            this.chars[i] = GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)];
          }
        } else {
          this.chars[i] = this.origChars[i];
        }

        if (currentAlpha > 0.03 && drawX >= -20 && drawY >= -20 && drawX <= this.canvasW + 20 && drawY <= this.canvasH + 20) {
          const sprite = this.getGlyphSprite(this.chars[i], cellW);
          const halfSize = sprite.width / (1.8 * this.dpr) / 2 * (1 + 0.8 * scatterAmount);
          this.ctx.globalAlpha = currentAlpha;
          this.ctx.drawImage(sprite, drawX - halfSize, drawY - halfSize, halfSize * 2, halfSize * 2);
        }
      }

      this.ctx.globalAlpha = 1;
      this.raf = requestAnimationFrame(render);
    };

    this.raf = requestAnimationFrame(render);
  }

  triggerBurst(x, y) {
    if (this.burstQueue.length > 3) this.burstQueue.shift();
    this.burstQueue.push({ x, y, time: performance.now() });

    // Haptic vibration on mobile
    if ('vibrate' in navigator) {
      try { navigator.vibrate(8); } catch (e) {}
    }
  }

  bindEvents() {
    this.onPointerDown = (e) => {
      if (e.target.closest('a, button, [role="button"], input, select, textarea, label')) return;
      const rect = this.container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.triggerBurst(x, y);
    };

    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });

    this.onResize = () => {
      this.resizeCanvas();
    };
    window.addEventListener('resize', this.onResize, { passive: true });

    this.onThemeChange = () => {
      const computed = getComputedStyle(document.documentElement);
      this.color = this.options.color === 'accent'
        ? (computed.getPropertyValue('--color-accent-default').trim() || '#FF5C2E')
        : (computed.getPropertyValue('--color-text-primary').trim() || '#141414');
      this.cache.clear();
    };
    window.addEventListener('theme:change', this.onThemeChange);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onPointerMove);
    this.container.removeEventListener('pointerleave', this.onPointerLeave);
    window.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('theme:change', this.onThemeChange);
  }
}
