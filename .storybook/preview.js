import '../src/index.css';
import './preview.css';
import { toast } from '../src/index.js';
import { slHydrateIcons } from '../src/icons.js';
import { slNavHTML } from './nav-data.js';
import { COMPONENTS, componentFromTitle, componentCSS, addComponent, addTheme } from './template-store.js';

const DEMO = { ok: ['Устройство добавлено', 'Камера КПП-2 появится на карте после размещения.'], warn: ['Связь нестабильна', 'Шлюз-04 отвечает с задержкой.'], crit: ['Не удалось загрузить журнал', 'Проверьте соединение и обновите страницу.'] };
document.addEventListener('click', e => { const b = e.target.closest('[data-demo-toast]'); if (b) { const [title, text] = DEMO[b.dataset.demoToast]; toast(text, { title, type: b.dataset.demoToast }); } });

export const TEMPLATE_STORY = '/?path=/story/основа-мой-шаблон--template';

const finish = root => {
  root.querySelectorAll('[data-nav]').forEach(n => { n.innerHTML = slNavHTML('devices'); });
  slHydrateIcons(root);
  return root;
};

const fill = (el, content) => {
  if (content instanceof Node) el.append(content); else el.innerHTML = content;
  return el;
};

const stage = (content, theme, label) => {
  const el = document.createElement('div');
  el.className = 'sb-stage sl-root';
  el.dataset.theme = theme;
  if (label) el.dataset.label = label;
  fill(el, content);
  el.querySelectorAll('input[type=radio]').forEach(r => { r.name += '-' + theme; });
  return finish(el);
};

/** Панель над примером: применить примерку размера/скругления и отправить её в «Мой шаблон». */
function templateBar(ctx) {
  const key = componentFromTitle(ctx.title);
  const isTheme = ctx.title === 'Основа/Редактор темы';
  if (!key && !isTheme) return null;
  const bar = document.createElement('div');
  bar.className = 'sb-tpl-bar';
  const what = isTheme ? 'тему' : `«${COMPONENTS[key].label.replace(/^\d+ · /, '')}»`;
  const detail = isTheme ? '' : ` — размер ${ctx.args.slScale ?? 100}%, скругление ${ctx.args.slRadius < 0 ? 'как в теме' : ctx.args.slRadius + 'px'}`;
  bar.innerHTML = `<button class="sl-btn sl-btn--sm sl-btn--primary" data-tpl-add>＋ В шаблон</button><span>Добавить ${what}${detail}</span><a class="sl-link" href="${TEMPLATE_STORY}" target="_blank" rel="noopener">Открыть «Мой шаблон» в новой вкладке ↗</a>`;
  bar.querySelector('[data-tpl-add]').addEventListener('click', () => {
    if (isTheme) addTheme(Object.fromEntries(Object.entries(ctx.args).filter(([k]) => !k.startsWith('sl'))));
    else addComponent(key, ctx.args.slScale ?? 100, ctx.args.slRadius ?? -1);
    toast(isTheme ? 'Тема добавлена в шаблон' : `${COMPONENTS[key].label} добавлен в шаблон`, { type: 'ok', title: 'Готово', duration: 2500 });
  });
  return bar;
}

/** Применяет примерку размера и скругления к компоненту истории. */
function tweakStyle(ctx) {
  const key = componentFromTitle(ctx.title);
  if (!key) return null;
  const css = componentCSS(key, { scale: ctx.args.slScale ?? 100, radius: ctx.args.slRadius ?? -1 }, '.sb-tweak ');
  if (!css) return null;
  const s = document.createElement('style');
  s.textContent = css;
  return s;
}

/** @type { import('@storybook/html-vite').Preview } */
export default {
  globalTypes: {
    theme: {
      description: 'Тема',
      toolbar: { title: 'Тема', icon: 'mirror', items: [
        { value: 'both', title: 'Обе рядом' }, { value: 'light', title: 'Светлая' }, { value: 'dark', title: 'Тёмная' }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'both', viewport: { value: undefined } },
  // Размер и скругление есть у каждого компонента; в шаблон они уходят кнопкой «＋ В шаблон».
  args: { slScale: 100, slRadius: -1 },
  argTypes: {
    slScale: { name: 'Размер компонента, %', control: { type: 'range', min: 60, max: 160, step: 5 }, table: { category: 'Размер и форма' } },
    slRadius: { name: 'Скругление, px (−1 — как в теме)', control: { type: 'range', min: -1, max: 24, step: 1 }, table: { category: 'Размер и форма' } },
  },
  parameters: {
    layout: 'padded',
    pair: true,
    viewport: { options: {
      phone: { name: 'Телефон 390', styles: { width: '390px', height: '844px' }, type: 'mobile' },
      tablet: { name: 'Планшет 768', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
      laptop: { name: 'Ноутбук 1024', styles: { width: '1024px', height: '768px' }, type: 'desktop' },
      desktop: { name: 'Монитор 1440', styles: { width: '1440px', height: '900px' }, type: 'desktop' },
      wide: { name: 'Монитор 1920', styles: { width: '1920px', height: '1080px' }, type: 'desktop' },
    } },
    a11y: { test: 'error' },
  },
  decorators: [
    (story, ctx) => {
      const content = story();
      const theme = ctx.globals.theme || 'both';
      const pair = ctx.parameters.pair !== false;
      document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
      document.body.style.background = 'var(--sl-bg)';
      const t = theme === 'dark' ? 'dark' : 'light';
      let view;
      if (pair && theme === 'both') {
        view = document.createElement('div');
        view.className = 'sb-pair';
        view.append(stage(content, 'light', 'Светлая тема'), stage(typeof content === 'string' ? content : content.cloneNode(true), 'dark', 'Тёмная тема'));
      } else if (!pair) {
        view = fill(document.createElement('div'), content);
        view.className = 'sl-root';
        view.dataset.theme = t;
        finish(view);
      } else view = stage(content, t);

      const bar = templateBar(ctx);
      const style = tweakStyle(ctx);
      if (!bar && !style) return view;
      const wrap = document.createElement('div');
      wrap.className = 'sb-tweak';
      if (style) wrap.append(style);
      if (bar) wrap.append(bar);
      wrap.append(view);
      return wrap;
    },
  ],
};
