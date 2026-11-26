import { define } from '../../core/define.js';

/** <sl-modal id="x"><dialog class="sl-modal">…</dialog></sl-modal>.
 *  Открыть — кнопка [data-sl-open="x"], закрыть — [data-sl-close], Esc или клик по фону. Фокус возвращается на кнопку. */
export class SlModal extends HTMLElement {
  connectedCallback() {
    if (this.wired) return;
    this.wired = true;
    this.addEventListener('click', e => {
      if (e.target.closest('[data-sl-close]') || e.target === this.dialog) this.close();
    });
  }

  get dialog() { return this.querySelector('dialog'); }

  open(opener = document.activeElement) {
    const d = this.dialog;
    if (!d || d.open) return;
    this.opener = opener;
    // Esc закрывает нативный диалог сам — ловим это, чтобы вернуть фокус
    d.addEventListener('close', () => this.#restore(), { once: true });
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    this.dispatchEvent(new CustomEvent('sl-open', { bubbles: true }));
  }

  close() {
    const d = this.dialog;
    if (!d?.open) return;
    if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
    this.#restore();
  }

  #restore() {
    if (!this.opener) return;
    if (this.opener.isConnected) this.opener.focus();
    this.opener = null;
    this.dispatchEvent(new CustomEvent('sl-close', { bubbles: true }));
  }
}
define('sl-modal', SlModal);

if (typeof document !== 'undefined' && !document.slModalListener) {
  document.slModalListener = true;
  document.addEventListener('click', e => {
    const btn = e.target.closest?.('[data-sl-open]');
    if (btn) document.getElementById(btn.dataset.slOpen)?.open?.(btn);
  });
}
