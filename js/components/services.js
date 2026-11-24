/**
 * Services Component
 * Interactive stickers with 3D tilt, bounce spring, and Round 1 / Round 2 toggle.
 */

export function initServices() {
  const cards = document.querySelectorAll('.svc__card');

  cards.forEach((card) => {
    const ill = card.querySelector('.svc-ill');
    if (!ill) return;

    // Desktop hover state
    card.addEventListener('mouseenter', () => {
      ill.classList.add('is-play');
    });

    card.addEventListener('mouseleave', () => {
      ill.classList.remove('is-play');
    });

    // Subtle 3D tilt on mousemove
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotX = -y * 6;
      const rotY = x * 6;
      ill.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      ill.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });

  // Mobile intersection trigger for touch devices
  if (!window.matchMedia('(pointer: fine)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const ill = entry.target.querySelector('.svc-ill');
        if (ill) {
          if (entry.intersectionRatio >= 0.5) {
            ill.classList.add('is-play');
          } else if (entry.intersectionRatio < 0.2) {
            ill.classList.remove('is-play');
          }
        }
      });
    }, { threshold: [0, 0.2, 0.5] });

    cards.forEach((c) => observer.observe(c));
  }
}
