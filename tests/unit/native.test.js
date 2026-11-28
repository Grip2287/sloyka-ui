// Нативные компоненты: разметка из React-примеров на каждый компонент и скрипты поведения.
// native/ собирается в global-setup (npm run build → scripts/gen-native.js).
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticToast } from '../../.storybook/static';

/** Те же исключения, что у правила native-no-inline-style в sloyka-check. */
const NATIVE_STYLE = / style="(width:\d+(\.\d+)?%|--c:var\(--sl-(ok|warn|crit)\))"/g;
const manifest = JSON.parse(readFileSync('components.json', 'utf8'));
const native = JSON.parse(readFileSync('native/components.json', 'utf8'));
const html = (file) => readFileSync(`native/${file}`, 'utf8');
/** Один вариант из файла компонента: разметка после комментария `<!-- title -->`. */
const sample = (file, title) => html(file).split(`<!-- ${title} -->\n`)[1].split('\n<!--')[0];
const run = (file) => { new Function(readFileSync(`native/${file}`, 'utf8'))(); };
const mount = (markup) => { document.body.innerHTML = markup; };
const key = (el, k, opts = {}) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...opts }));

describe('нативная разметка', () => {
  it('у каждого компонента есть нативный вариант', () => {
    expect(native.components.map((c) => c.name).sort()).toEqual(Object.keys(manifest.components).sort());
    for (const c of native.components) {
      expect(c.samples.length, c.name).toBeGreaterThan(0);
      expect(existsSync(`native/${c.file}`), c.file).toBe(true);
    }
  });

  it('у каждого скрипта есть файл, у каждого файла — компонент', () => {
    const declared = new Set(native.components.map((c) => c.script).filter(Boolean));
    for (const f of declared) expect(existsSync(`native/${f}`), f).toBe(true);
    for (const f of readdirSync('src/native/scripts')) expect(declared.has(f), f).toBe(true);
  });

  it('в разметке только классы из styles.css, без style и id из useId', () => {
    const css = readFileSync('dist/styles.css', 'utf8');
    for (const c of native.components) for (const s of c.samples) {
      // style ставят только сами компоненты, и только данные: шкала Metric и цвет цифры Stats
      expect(s.html.replace(NATIVE_STYLE, ''), `${c.name}: style`).not.toMatch(/\sstyle="/);
      expect(s.html, `${c.name}: useId`).not.toMatch(/="[^"]*(«|»|_R_)/);
      for (const cls of s.html.matchAll(/class="([^"]+)"/g)) for (const name of cls[1].split(/\s+/)) {
        if (name === 'is-open') continue;
        expect(css.includes(`.${name}`), `${c.name}: .${name} нет в styles.css`).toBe(true);
      }
    }
  });

  it('в скриптах нет меток иконок — они заменены разметкой Icon', () => {
    for (const f of readdirSync('native').filter((f) => f.endsWith('.js'))) expect(html(f), f).not.toMatch(/__SL_ICON_/);
  });

  it('справочник для агентов перечисляет все компоненты', () => {
    const md = readFileSync('agents/native-components.md', 'utf8');
    for (const name of Object.keys(manifest.components)) expect(md, name).toContain(`### ${name}\n`);
  });
});

describe('скрипты поведения', () => {
  beforeAll(() => { for (const f of ['modal.js', 'menu.js', 'theme.js', 'toast.js', 'group.js', 'segmented.js', 'compose.js', 'shell.js', 'window.js', 'tooltip.js']) run(f); });
  beforeEach(() => { document.body.innerHTML = ''; delete document.documentElement.dataset.theme; localStorage.clear(); });

  it('modal.js: кнопка открывает окно, «Отменить» и Esc закрывают, фокус возвращается', () => {
    mount(sample('modal.html', 'Модальное окно (кнопка + окно)'));
    const opener = document.querySelector('[data-sl-open]');
    const d = document.getElementById('user-modal');
    opener.focus();
    opener.click();
    expect(d.open).toBe(true);
    expect(document.activeElement).toBe(d.querySelector('.sl-modal__body input'));
    d.querySelector('[data-sl-close]').click();
    expect(d.open).toBe(false);
    expect(document.activeElement).toBe(opener);
    window.slModal.open('user-modal');
    expect(d.open).toBe(true);
    d.querySelector('.sl-modal__head .sl-btn').click();
    expect(d.open).toBe(false);
  });

  it('menu.js: кнопка открывает меню, Esc и щелчок снаружи закрывают', () => {
    mount(`<p id="out">снаружи</p>${sample('menu.html', 'Меню с кнопкой')}`);
    const btn = document.querySelector('.sl-menu__trigger');
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    expect(panel.hidden).toBe(true);
    btn.click();
    expect(panel.hidden).toBe(false);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    key(document.body, 'Escape');
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(btn);
    btn.click();
    document.getElementById('out').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(panel.hidden).toBe(true);
    btn.click();
    panel.querySelector('.sl-menu__item').click();
    expect(panel.hidden).toBe(true);
  });

  it('theme.js: переключает тему, запоминает и меняет иконку', () => {
    mount(sample('theme-toggle.html', 'Переключатель темы'));
    const b = document.querySelector('[data-sl-theme-toggle]');
    b.click();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('sl-theme')).toBe('dark');
    expect(b.getAttribute('aria-pressed')).toBe('true');
    expect(b.innerHTML).toContain('circle');
    b.click();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('theme-head.js: ставит сохранённую тему до отрисовки', () => {
    localStorage.setItem('sl-theme', 'dark');
    run('theme-head.js');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('toast.js: разметка уведомления совпадает с React', () => {
    for (const kind of ['ok', 'warn', 'crit', 'info']) {
      document.body.innerHTML = '';
      window.slToast[kind]('Данные сохранены', { title: 'Готово' });
      const el = document.querySelector('.sl-toast');
      const react = renderToStaticMarkup(createElement(StaticToast, { kind, title: 'Готово', text: 'Данные сохранены' }));
      const tpl = document.createElement('template');
      tpl.innerHTML = react;
      expect(el.outerHTML, kind).toBe(tpl.content.firstElementChild.outerHTML);
    }
    document.body.innerHTML = '';
    const h = window.slToast.crit('Авария');
    expect(document.querySelectorAll('.sl-toast')).toHaveLength(1);
    h.close();
    expect(document.querySelectorAll('.sl-toast')).toHaveLength(0);
  });

  it('group.js: сворачивает и разворачивает группу', () => {
    mount(sample('list.html', 'Список с группой'));
    const g = document.querySelector('.sl-group');
    const head = g.querySelector('.sl-group__head');
    head.click();
    expect(g.hasAttribute('data-collapsed')).toBe(true);
    expect(head.getAttribute('aria-expanded')).toBe('false');
    expect(head.querySelector('.sl-count').classList.contains('sl-count--solid')).toBe(false);
    head.click();
    expect(g.hasAttribute('data-collapsed')).toBe(false);
  });

  it('segmented.js: выбор щелчком и стрелкой, событие change', () => {
    mount(sample('segmented.html', 'Сегменты'));
    const group = document.querySelector('.sl-segmented');
    const [a, b, c] = group.querySelectorAll('button');
    const seen = [];
    group.addEventListener('change', (e) => seen.push(e.detail.value));
    b.click();
    expect(b.getAttribute('aria-pressed')).toBe('true');
    expect(a.getAttribute('aria-pressed')).toBe('false');
    key(b, 'ArrowRight');
    expect(c.getAttribute('aria-pressed')).toBe('true');
    expect(seen).toEqual(['week', 'month']);
  });

  it('compose.js: Enter отправляет текст и очищает поле, пустое не отправляется', () => {
    mount(sample('compose.html', 'Строка сообщения'));
    const box = document.querySelector('.sl-compose');
    const input = box.querySelector('.sl-input');
    const sent = [];
    box.addEventListener('sl-send', (e) => sent.push(e.detail.value));
    key(input, 'Enter');
    input.value = 'Привет';
    key(input, 'Enter');
    input.value = 'Ещё';
    box.querySelector('.sl-btn').click();
    expect(sent).toEqual(['Привет', 'Ещё']);
    expect(input.value).toBe('');
  });

  it('shell.js: кнопка открывает меню, Esc закрывает и возвращает фокус', () => {
    mount(sample('shell.html', 'Каркас админки'));
    const shell = document.querySelector('.sl-shell');
    const toggle = shell.querySelector('.sl-shell__toggle');
    toggle.click();
    expect(shell.hasAttribute('data-nav-open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    key(document.body, 'Escape');
    expect(shell.hasAttribute('data-nav-open')).toBe(false);
    expect(document.activeElement).toBe(toggle);
    toggle.click();
    shell.querySelector('.sl-shell__backdrop').click();
    expect(shell.hasAttribute('data-nav-open')).toBe(false);
  });

  it('window.js: «Закрыть» прячет окно', () => {
    mount(sample('window.html', 'Плавающее окно'));
    const w = document.querySelector('.sl-window');
    let closed = false;
    w.addEventListener('sl-close', () => { closed = true; });
    w.querySelector('.sl-window__head .sl-btn').click();
    expect(w.hidden).toBe(true);
    expect(closed).toBe(true);
  });

  it('tooltip.js: фокус показывает подсказку, Esc скрывает', () => {
    mount(sample('tooltip.html', 'Подсказка'));
    const host = document.querySelector('.sl-tooltip-host');
    const tip = host.querySelector('.sl-tooltip');
    expect(tip.hidden).toBe(true);
    host.querySelector('button').focus();
    expect(tip.hidden).toBe(false);
    expect(host.getAttribute('aria-describedby')).toBe(tip.id);
    key(document.body, 'Escape');
    expect(tip.hidden).toBe(true);
  });
});
