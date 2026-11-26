import { define, whenParsed } from '../../core/define.js';

export const THEME_KEY = 'sl-theme';

/** <sl-theme-toggle><button>…</button></sl-theme-toggle> — переключает data-theme на <html> и запоминает выбор. */
export class SlThemeToggle extends HTMLElement {
  connectedCallback() {
    if (this.wired) return;
    this.wired = true;
    this.addEventListener('click', e => { if (e.target.closest('button') === this.btn) this.toggle(); });
    whenParsed(() => this.#sync());
  }

  get btn() { return this.querySelector('button'); }

  get current() {
    const t = document.documentElement.dataset.theme;
    if (t === 'light' || t === 'dark') return t;
    return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggle() {
    const next = this.current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch { /* хранилище закрыто — тема просто не запомнится */ }
    this.#sync();
    this.dispatchEvent(new CustomEvent('sl-theme-change', { bubbles: true, detail: { theme: next } }));
  }

  #sync() { this.btn?.setAttribute('aria-pressed', String(this.current === 'dark')); }
}
define('sl-theme-toggle', SlThemeToggle);
