import { define } from '../../core/define.js';

/** <sl-shell class="sl-shell">: на телефоне меню открывает [data-sl-nav-toggle], закрывают фон, Esc и выбор пункта. */
export class SlShell extends HTMLElement {
  connectedCallback() {
    if (!this.wired) {
      this.wired = true;
      this.addEventListener('click', this);
    }
    this._onKey = e => { if (e.key === 'Escape' && this.isOpen) this.close(); };
    document.addEventListener('keydown', this._onKey);
  }

  disconnectedCallback() { document.removeEventListener('keydown', this._onKey); }

  get toggleBtn() { return this.querySelector('[data-sl-nav-toggle]'); }

  get isOpen() { return this.hasAttribute('data-nav-open'); }

  open() {
    this.#set(true);
    this.querySelector('.sl-shell__nav .sl-nav__item')?.focus();
  }

  close() {
    this.#set(false);
    this.toggleBtn?.focus();
  }

  handleEvent(e) {
    if (e.target.closest('[data-sl-nav-toggle]')) {
      e.preventDefault();
      if (this.isOpen) this.close(); else this.open();
      return;
    }
    if (this.isOpen && (e.target.closest('[data-sl-nav-close]') || e.target.closest('.sl-shell__nav .sl-nav__item'))) this.close();
  }

  #set(v) {
    this.toggleAttribute('data-nav-open', v);
    this.toggleBtn?.setAttribute('aria-expanded', String(v));
  }
}
define('sl-shell', SlShell);
