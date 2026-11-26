import { describe, it, expect, beforeEach, vi } from 'vitest';
import { define } from '../../src/core/define.js';
import '../../src/index.js';
import { toast } from '../../src/index.js';

const mount = html => { document.body.innerHTML = html; return document.body.firstElementChild; };
const tick = () => new Promise(r => setTimeout(r, 0));

describe('define', () => {
  it('second define of same tag does not throw', () => {
    class A extends HTMLElement {}
    define('sl-test-x', A);
    expect(() => define('sl-test-x', class extends HTMLElement {})).not.toThrow();
    expect(customElements.get('sl-test-x')).toBe(A);
  });
});

describe('sl-segmented', () => {
  it('click presses one button and emits sl-change', async () => {
    const el = mount('<sl-segmented class="sl-segmented"><button>A</button><button aria-pressed="true">B</button><button>C</button></sl-segmented>');
    const spy = vi.fn(); el.addEventListener('sl-change', e => spy(e.detail.value));
    el.querySelectorAll('button')[2].click();
    expect([...el.querySelectorAll('button')].map(b => b.getAttribute('aria-pressed'))).toEqual(['false', 'false', 'true']);
    expect(spy).toHaveBeenCalledWith('C');
  });
  it('ArrowRight moves selection', () => {
    const el = mount('<sl-segmented class="sl-segmented"><button aria-pressed="true">A</button><button>B</button></sl-segmented>');
    el.querySelector('button').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(el.querySelectorAll('button')[1].getAttribute('aria-pressed')).toBe('true');
  });
});

describe('sl-group', () => {
  it('head toggles data-collapsed and aria-expanded', async () => {
    const el = mount('<sl-group class="sl-group"><button class="sl-group__head">Г</button><div class="sl-row">x</div></sl-group>');
    const head = el.querySelector('.sl-group__head');
    await tick();
    expect(head.getAttribute('aria-expanded')).toBe('true');
    head.click();
    expect(el.hasAttribute('data-collapsed')).toBe(true);
    expect(head.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('sl-shell', () => {
  beforeEach(() => mount(`<sl-shell class="sl-shell"><header class="sl-topbar"><button data-sl-nav-toggle aria-expanded="false">≡</button></header>
    <nav class="sl-nav sl-shell__nav" id="n"><a class="sl-nav__item" href="#a">A</a></nav><div class="sl-shell__backdrop" data-sl-nav-close></div><main></main></sl-shell>`));
  it('toggle opens and Escape closes, focus returns', () => {
    const shell = document.querySelector('sl-shell'), btn = document.querySelector('[data-sl-nav-toggle]');
    btn.click();
    expect(shell.hasAttribute('data-nav-open')).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(shell.hasAttribute('data-nav-open')).toBe(false);
    expect(document.activeElement).toBe(btn);
  });
  it('backdrop and nav link close the menu', () => {
    const shell = document.querySelector('sl-shell');
    shell.open(); document.querySelector('[data-sl-nav-close]').click();
    expect(shell.hasAttribute('data-nav-open')).toBe(false);
    shell.open(); document.querySelector('.sl-nav__item').click();
    expect(shell.hasAttribute('data-nav-open')).toBe(false);
  });
});

describe('theme', () => {
  beforeEach(() => { localStorage.clear(); document.documentElement.removeAttribute('data-theme'); });
  it('toggle switches theme and persists to localStorage sl-theme', async () => {
    document.documentElement.dataset.theme = 'light';
    const el = mount('<sl-theme-toggle><button>т</button></sl-theme-toggle>');
    await tick();
    el.querySelector('button').click();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('sl-theme')).toBe('dark');
    expect(el.querySelector('button').getAttribute('aria-pressed')).toBe('true');
  });
  it('theme-init applies saved theme', async () => {
    localStorage.setItem('sl-theme', 'dark');
    const { applySavedTheme } = await import('../../src/theme-init.js');
    applySavedTheme();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
  it('theme-init survives throwing localStorage', async () => {
    const { applySavedTheme } = await import('../../src/theme-init.js');
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(() => applySavedTheme()).not.toThrow();
    spy.mockRestore();
  });
});

describe('sl-modal', () => {
  it('opens from data-sl-open, closes on data-sl-close and returns focus', async () => {
    mount('<div><button data-sl-open="m">open</button><sl-modal id="m"><dialog class="sl-modal"><button data-sl-close>x</button></dialog></sl-modal></div>');
    const opener = document.querySelector('[data-sl-open]'), dlg = document.querySelector('dialog');
    opener.focus(); opener.click(); await tick();
    expect(dlg.open).toBe(true);
    document.querySelector('[data-sl-close]').click(); await tick();
    expect(dlg.open).toBe(false);
    expect(document.activeElement).toBe(opener);
  });
});

describe('sl-modal pointer', () => {
  it('does not close when a press starts inside and is released on the backdrop', async () => {
    mount('<div><button data-sl-open="m2">open</button><sl-modal id="m2"><dialog class="sl-modal"><input id="i"></dialog></sl-modal></div>');
    document.querySelector('[data-sl-open]').click(); await tick();
    const dlg = document.querySelector('#m2 dialog');
    document.getElementById('i').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    dlg.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(dlg.open).toBe(true);
  });
  it('closes when press and release are both on the backdrop', async () => {
    mount('<div><button data-sl-open="m3">open</button><sl-modal id="m3"><dialog class="sl-modal"><input></dialog></sl-modal></div>');
    document.querySelector('[data-sl-open]').click(); await tick();
    const dlg = document.querySelector('#m3 dialog');
    dlg.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    dlg.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(dlg.open).toBe(false);
  });
});

describe('toast', () => {
  beforeEach(() => { document.body.innerHTML = ''; vi.useRealTimers(); });
  it('creates a live region if missing', () => {
    toast('Готово', { type: 'ok' });
    const region = document.querySelector('.sl-toast-region');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toContain('Готово');
  });
  it('crit toast has role=alert and stays', () => {
    vi.useFakeTimers();
    toast('Ошибка', { type: 'crit' });
    vi.advanceTimersByTime(20000);
    const t = document.querySelector('.sl-toast');
    expect(t.getAttribute('role')).toBe('alert');
    expect(document.body.contains(t)).toBe(true);
  });
  it('info toast disappears after 5000 ms', () => {
    vi.useFakeTimers();
    toast('Инфо');
    vi.advanceTimersByTime(5100);
    expect(document.querySelector('.sl-toast')).toBeNull();
  });
});
