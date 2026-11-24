/**
 * Magnetic Button Attraction Physics
 * Elements with [data-magnetic="true"] attract toward the cursor when hovering nearby.
 */

export function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  const buttons = document.querySelectorAll('[data-magnetic="true"]');
  const MAX_OFFSET = 8; // px
  const RADIUS = 80;    // px

  buttons.forEach((btn) => {
    let curX = 0, curY = 0;
    let targetX = 0, targetY = 0;
    let raf = 0;

    function render() {
      curX += (targetX - curX) * 0.2;
      curY += (targetY - curY) * 0.2;
      btn.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0)`;

      if (Math.abs(targetX - curX) + Math.abs(targetY - curY) > 0.1) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0;
      }
    }

    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist < RADIUS) {
        const pull = 1 - dist / RADIUS;
        targetX = (dx / dist) * MAX_OFFSET * pull;
        targetY = (dy / dist) * MAX_OFFSET * pull;
      } else {
        targetX = 0;
        targetY = 0;
      }

      if (!raf) raf = requestAnimationFrame(render);
    });

    btn.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(render);
    });
  });
}
