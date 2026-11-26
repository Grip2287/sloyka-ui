import { slIcon } from '../../icons.js';

const ICON = { ok: 'check', warn: 'alert', crit: 'alert', info: 'info' };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function region() {
  let r = document.querySelector('.sl-toast-region');
  if (!r) {
    r = document.createElement('div');
    r.className = 'sl-toast-region';
    r.setAttribute('aria-live', 'polite');
    document.body.append(r);
  }
  return r;
}

/** Показывает уведомление. type: 'info' | 'ok' | 'warn' | 'crit'. Ошибки (crit) не исчезают сами и читаются сразу. */
export function toast(message, { title, type = 'info', duration } = {}) {
  const el = document.createElement('div');
  el.className = 'sl-toast';
  el.style.setProperty('--c', `var(--sl-${type === 'info' ? 'text-2' : type})`);
  el.setAttribute('role', type === 'crit' ? 'alert' : 'status');
  const head = title ? `<span class="sl-toast__title">${esc(title)}</span><span class="sl-toast__text">${esc(message)}</span>` : `<span class="sl-toast__title">${esc(message)}</span>`;
  el.innerHTML = `${slIcon(ICON[type] || 'info', 'sl-toast__icon')}<div class="sl-toast__body">${head}</div>`
    + `<button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть">${slIcon('x')}</button>`;
  const remove = () => el.remove();
  el.querySelector('button').addEventListener('click', remove);
  region().append(el);
  const ms = duration ?? (type === 'crit' ? 0 : 5000);
  if (ms > 0) setTimeout(remove, ms);
  return { close: remove, element: el };
}
