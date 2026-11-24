/**
 * Application Entry Point
 * Initializes all animations, particle systems, interactive controls, and sound synthesis.
 */

import { siteConfig } from './config.js';
import { initTheme } from './components/theme.js';
import { initClock } from './components/clock.js';
import { initServices } from './components/services.js';
import { SelectedWork } from './components/selected-work.js';
import { LiquidToggle } from './effects/liquid-toggle.js';
import { GlyphScatter } from './effects/glyph-scatter.js';
import { initCustomCursor } from './effects/cursor.js';
import { initMagneticButtons } from './effects/magnetic.js';
import { initSoundTriggers, isSoundEnabled, setSoundEnabled } from './effects/sound.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Initialization
  const theme = initTheme();

  // 2. Clock in Navigation
  const clockEl = document.querySelector('.nav__time');
  initClock(clockEl);

  // 3. Sound Effects & Switches
  initSoundTriggers();

  // Desktop & Mobile Sound Toggles
  document.querySelectorAll('.nav__sound button').forEach((btn) => {
    new LiquidToggle(btn, {
      checked: isSoundEnabled(),
      onChange: (enabled) => setSoundEnabled(enabled)
    });
  });

  // Desktop & Mobile Theme Toggles
  document.querySelectorAll('.nav__theme button').forEach((btn) => {
    new LiquidToggle(btn, {
      checked: theme.isDark(),
      onChange: (isDark) => theme.setTheme(isDark ? 'dark' : 'light')
    });
  });

  // 4. Hero ASCII Glyph Particle Scatter Canvas (Branch)
  const heroGlyphEl = document.querySelector('.hero__glyph');
  if (heroGlyphEl) {
    new GlyphScatter(heroGlyphEl, {
      src: '/glyphs/branch.json',
      cols: 208,
      rows: 114,
      aspect: 1.2222,
      color: 'accent',
      opacity: 0.7,
      burst: true
    });
  }

  // Philosophy ASCII Glyph Canvas (Quote)
  const philoGlyphEl = document.querySelector('.philo__glyph');
  if (philoGlyphEl) {
    new GlyphScatter(philoGlyphEl, {
      src: '/glyphs/quote.json',
      cols: 208,
      rows: 114,
      aspect: 1.2222,
      color: 'accent',
      opacity: 0.65,
      burst: true
    });
  }

  // 5. Selected Work Slider & Mockups
  const swSection = document.getElementById('work');
  if (swSection) {
    new SelectedWork(swSection, siteConfig.cases);
  }

  // 6. Services 3D Sticker Tilt & Round Toggle
  initServices();

  // 7. Micro-Interactions: Magnetic Buttons & Custom Cursor
  initMagneticButtons();
  initCustomCursor();

  // 8. Mobile Navigation Menu Toggle
  const menuBtn = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      let mobileMenu = document.getElementById('site-menu');
      if (!mobileMenu) {
        mobileMenu = document.createElement('div');
        mobileMenu.id = 'site-menu';
        mobileMenu.className = 'menu';
        mobileMenu.innerHTML = `
          <ul>
            <li><a href="/work"><span>01</span><span>Work</span><span>↗</span></a></li>
            <li><a href="/about"><span>02</span><span>About</span><span>↗</span></a></li>
            <li><a href="mailto:${siteConfig.profile.email}"><span>03</span><span>Contact</span><span>↗</span></a></li>
          </ul>
          <div class="menu__foot">
            <p><span class="muted">Based in</span> ${siteConfig.profile.location}</p>
            <p><span class="nav__dot"></span> ${siteConfig.profile.statusText}</p>
          </div>
        `;
        document.body.appendChild(mobileMenu);
      }
      mobileMenu.style.display = expanded ? 'none' : 'flex';
    });
  }

  // 9. Scroll Reveal Animations (.reveal, .is-in)
  const revealTargets = document.querySelectorAll('.hero__facts > *, .hero__contact, .svc__card, .award, .fact');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach((t) => {
    t.classList.add('reveal');
    revealObserver.observe(t);
  });
});
