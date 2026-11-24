/**
 * Liquid Toggle Switch Component
 * Fluid physics with SVG Gooey filter (#lt-goo) and drag gesture support.
 */

export class LiquidToggle {
  constructor(element, options = {}) {
    this.el = element;
    this.options = Object.assign({
      checked: false,
      onChange: () => {}
    }, options);

    this.isChecked = !!this.options.checked;
    this.busy = false;
    this.complete = this.isChecked ? 100 : 0;
    this.raf = 0;
    this.drag = null;

    this.render();
    this.bindEvents();
  }

  render() {
    this.el.setAttribute('role', 'switch');
    this.el.setAttribute('aria-checked', String(this.isChecked));
    this.el.style.setProperty('--complete', String(this.complete));
  }

  setComplete(val) {
    this.complete = val;
    this.el.style.setProperty('--complete', val.toFixed(1));
  }

  animateTo(target, duration = 300, onDone) {
    cancelAnimationFrame(this.raf);
    const start = this.complete;
    const diff = target - start;
    const startTime = performance.now();

    const loop = (now) => {
      const p = Math.min(1, (now - startTime) / duration);
      // Cubic ease out
      const ease = 1 - Math.pow(1 - p, 3);
      this.setComplete(start + diff * ease);

      if (p < 1) {
        this.raf = requestAnimationFrame(loop);
      } else {
        this.setComplete(target);
        if (onDone) onDone();
      }
    };
    this.raf = requestAnimationFrame(loop);
  }

  toggle(forceState) {
    const nextState = typeof forceState === 'boolean' ? forceState : !this.isChecked;
    if (nextState === this.isChecked && typeof forceState === 'boolean') return;

    this.isChecked = nextState;
    this.el.setAttribute('aria-checked', String(this.isChecked));
    const target = this.isChecked ? 100 : 0;

    this.animateTo(target, 320, () => {
      this.options.onChange(this.isChecked);
    });
  }

  bindEvents() {
    const el = this.el;

    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      el.setPointerCapture(e.pointerId);
      this.drag = {
        x: e.clientX,
        start: this.complete,
        moved: false,
        width: Math.max(40, el.getBoundingClientRect().width * 0.6)
      };
      this.busy = true;
      el.dataset.active = 'true';
      el.dataset.pressed = 'true';
    });

    el.addEventListener('pointermove', (e) => {
      if (!this.drag) return;
      const dx = e.clientX - this.drag.x;
      if (Math.abs(dx) > 3) this.drag.moved = true;

      if (this.drag.moved) {
        cancelAnimationFrame(this.raf);
        const val = Math.max(0, Math.min(100, this.drag.start + (dx / this.drag.width) * 100));
        this.setComplete(val);
        el.style.setProperty('--delta', Math.min(Math.abs(e.movementX || 0), 12).toFixed(1));
      }
    });

    const onPointerEnd = () => {
      if (!this.drag) return;
      const moved = this.drag.moved;
      this.drag = null;
      this.busy = false;
      delete el.dataset.active;
      delete el.dataset.pressed;
      el.style.setProperty('--delta', '0');

      if (moved) {
        // Snap to nearest side
        const shouldCheck = this.complete >= 50;
        this.isChecked = shouldCheck;
        this.el.setAttribute('aria-checked', String(this.isChecked));
        this.animateTo(shouldCheck ? 100 : 0, 240, () => {
          this.options.onChange(this.isChecked);
        });
      } else {
        // Simple click toggle
        this.toggle();
      }
    };

    el.addEventListener('pointerup', onPointerEnd);
    el.addEventListener('pointercancel', onPointerEnd);

    el.addEventListener('click', (e) => e.preventDefault());

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
  }
}
