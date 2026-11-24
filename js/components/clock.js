/**
 * Real-time Dublin Time Formatter
 */

export function initClock(timeContainerEl) {
  if (!timeContainerEl) return;

  function update() {
    try {
      const formatter = new Intl.DateTimeFormat('en-IE', {
        timeZone: 'Europe/Dublin',
        hour: '2-digit',
        minute: '2-digit'
      });
      const parts = formatter.formatToParts(new Date());
      const hour = parts.find(p => p.type === 'hour')?.value || '--';
      const minute = parts.find(p => p.type === 'minute')?.value || '--';

      timeContainerEl.innerHTML = `<span class="muted">Dublin</span> ${hour}:${minute} <span class="muted"></span>`;
    } catch (e) {
      timeContainerEl.innerHTML = `<span class="muted">Dublin</span> 12:00`;
    }
  }

  update();
  setInterval(update, 30000);
}
