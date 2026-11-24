/**
 * Dark / Light Theme Manager
 */

export function initTheme(toggleButtons = []) {
  const root = document.documentElement;
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function getSavedTheme() {
    try {
      const saved = localStorage.getItem('theme.v1');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  }

  function applyTheme(theme, save = true) {
    if (theme === 'dark') {
      root.dataset.theme = 'dark';
      if (themeMeta) themeMeta.setAttribute('content', '#121211');
    } else {
      delete root.dataset.theme;
      if (themeMeta) themeMeta.setAttribute('content', '#F1F0EC');
    }

    if (save) {
      try { localStorage.setItem('theme.v1', theme); } catch (e) {}
    }

    window.dispatchEvent(new CustomEvent('theme:change', { detail: { theme } }));
  }

  // Initial load
  const current = getSavedTheme();
  applyTheme(current, false);

  window.toggleTheme = () => {
    const isDark = root.dataset.theme === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next, true);
    return next === 'dark';
  };

  return {
    isDark: () => root.dataset.theme === 'dark',
    setTheme: applyTheme
  };
}
