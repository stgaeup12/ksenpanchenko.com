/**
 * Custom Cursor Component (kcursor)
 * Features:
 * - Smooth inertia follower with 0.22 spring easing
 * - Letter scramble decrypt animation ("View", "Next", "Look")
 * - Scale down on pointerdown
 */

const SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

export function initCustomCursor() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  const cursor = document.createElement('div');
  cursor.className = 'kcursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="kcursor__label"></span>';
  document.body.appendChild(cursor);

  const label = cursor.firstElementChild;
  let curX = -100, curY = -100;
  let targetX = -100, targetY = -100;
  let rafId = 0;
  let textRaf = 0;
  let currentMode = '';
  let active = false;

  function setMode(mode, text = '') {
    const key = mode + text;
    if (key === currentMode) return;
    currentMode = key;
    cursor.dataset.mode = mode;

    if (mode === 'view') {
      scrambleTo(text);
    } else {
      label.textContent = '';
    }
  }

  function scrambleTo(targetText) {
    cancelAnimationFrame(textRaf);
    const start = performance.now();
    const duration = 380;

    const frame = (now) => {
      const p = Math.min(1, (now - start) / duration);
      label.textContent = [...targetText].map((char, i) => {
        return i / targetText.length < p ? char : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join('');

      if (p < 1) {
        textRaf = requestAnimationFrame(frame);
      }
    };
    textRaf = requestAnimationFrame(frame);
  }

  function update() {
    curX += (targetX - curX) * 0.22;
    curY += (targetY - curY) * 0.22;
    cursor.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0)`;

    if (Math.abs(targetX - curX) + Math.abs(targetY - curY) > 0.3) {
      rafId = requestAnimationFrame(update);
    } else {
      rafId = 0;
    }
  }

  function checkTarget(target) {
    if (!target) return;
    const stageTarget = target.closest('.sw__stage, .wcard, .cs-shot, .cs-next, .sw__tile');
    if (stageTarget) {
      if (stageTarget.matches('.cs-next')) {
        setMode('view', 'Next');
      } else if (stageTarget.matches('.cs-shot')) {
        setMode('view', 'Look');
      } else {
        setMode('view', 'View');
      }
      return;
    }

    if (target.closest('a, button, [role=button], input, select, textarea, label')) {
      setMode('link');
      return;
    }

    setMode('');
  }

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    targetX = e.clientX;
    targetY = e.clientY;

    if (!active) {
      active = true;
      curX = targetX;
      curY = targetY;
      cursor.classList.add('is-on');
    }

    checkTarget(e.target);

    if (!rafId) {
      rafId = requestAnimationFrame(update);
    }
  }, { passive: true });

  window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  document.documentElement.addEventListener('pointerleave', () => {
    active = false;
    cursor.classList.remove('is-on');
  });

  document.documentElement.classList.add('has-kcursor');
}
