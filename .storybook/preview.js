import '../src/index.css';
import './preview.css';
import { toast } from '../src/index.js';

const DEMO = { ok: ['Устройство добавлено', 'Камера КПП-2 появится на карте после размещения.'], warn: ['Связь нестабильна', 'Шлюз-04 отвечает с задержкой.'], crit: ['Не удалось загрузить журнал', 'Проверьте соединение и обновите страницу.'] };
document.addEventListener('click', e => { const b = e.target.closest('[data-demo-toast]'); if (b) { const [title, text] = DEMO[b.dataset.demoToast]; toast(text, { title, type: b.dataset.demoToast }); } });
import { slHydrateIcons } from '../src/icons.js';
import { slNavHTML } from './nav-data.js';

const finish = root => {
  root.querySelectorAll('[data-nav]').forEach(n => { n.innerHTML = slNavHTML('devices'); });
  slHydrateIcons(root);
  return root;
};

const stage = (html, theme, label) => {
  const el = document.createElement('div');
  el.className = 'sb-stage sl-root';
  el.dataset.theme = theme;
  if (label) el.dataset.label = label;
  el.innerHTML = html;
  el.querySelectorAll('input[type=radio]').forEach(r => { r.name += '-' + theme; });
  return finish(el);
};

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
      const html = story();
      const theme = ctx.globals.theme || 'both';
      const pair = ctx.parameters.pair !== false;
      document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
      document.body.style.background = 'var(--sl-bg)';
      if (pair && theme === 'both') {
        const wrap = document.createElement('div');
        wrap.className = 'sb-pair';
        wrap.append(stage(html, 'light', 'Светлая тема'), stage(html, 'dark', 'Тёмная тема'));
        return wrap;
      }
      const t = theme === 'dark' ? 'dark' : 'light';
      if (!pair) { const el = document.createElement('div'); el.className = 'sl-root'; el.dataset.theme = t; el.innerHTML = html; return finish(el); }
      return stage(html, t);
    },
  ],
};
