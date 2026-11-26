import { define, whenParsed } from '../../core/define.js';

/** <sl-segmented class="sl-segmented"> с кнопками внутри: одна нажата, ←/→ переключают. Событие sl-change {value}. */
export class SlSegmented extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'group');
    if (!this.wired) {
      this.wired = true;
      this.addEventListener('click', this);
      this.addEventListener('keydown', this);
    }
    whenParsed(() => this.#sync(this.buttons.find(b => b.getAttribute('aria-pressed') === 'true') || this.buttons[0], false));
  }

  get buttons() { return [...this.querySelectorAll(':scope > button')]; }

  get value() {
    const b = this.buttons.find(x => x.getAttribute('aria-pressed') === 'true');
    return b ? (b.value || b.textContent.trim()) : null;
  }

  handleEvent(e) {
    const btns = this.buttons;
    const cur = e.target.closest('button');
    if (!cur || !btns.includes(cur)) return;
    if (e.type === 'click') { this.#sync(cur, true); return; }
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = btns[(btns.indexOf(cur) + step + btns.length) % btns.length];
    next.focus();
    this.#sync(next, true);
  }

  #sync(active, emit) {
    if (!active) return;
    for (const b of this.buttons) {
      b.setAttribute('aria-pressed', String(b === active));
      b.tabIndex = b === active ? 0 : -1;
    }
    if (emit) this.dispatchEvent(new CustomEvent('sl-change', { bubbles: true, detail: { value: this.value } }));
  }
}
define('sl-segmented', SlSegmented);
