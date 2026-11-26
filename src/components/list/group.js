import { define, whenParsed } from '../../core/define.js';

/** <sl-group class="sl-group"> — кнопка .sl-group__head сворачивает строки. Без JS группа раскрыта. */
export class SlGroup extends HTMLElement {
  connectedCallback() {
    if (this.wired) return;
    this.wired = true;
    this.addEventListener('click', e => {
      const head = e.target.closest('.sl-group__head');
      if (head && head.parentElement === this) this.toggle();
    });
    whenParsed(() => this.#sync());
  }

  get head() { return this.querySelector(':scope > .sl-group__head'); }

  toggle(force) {
    this.toggleAttribute('data-collapsed', force);
    this.#sync();
  }

  #sync() { this.head?.setAttribute('aria-expanded', String(!this.hasAttribute('data-collapsed'))); }
}
define('sl-group', SlGroup);
