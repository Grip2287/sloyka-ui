// Шаблон = примерки из песочниц и редактора темы, собранные в один CSS.
// Черновик хранится в localStorage браузера; сохранённые шаблоны — файлы templates/<slug>.css|json в репозитории.

export const DRAFT_KEY = 'sloyka-template-draft';

/** Компонент → внешние элементы, к которым применяются размер и скругление. Ключ = папка в src/components. */
export const COMPONENTS = {
  button: { label: '01 · Кнопки', selector: '.sl-btn, .sl-btn-group' },
  field: { label: '02 · Поля ввода', selector: '.sl-field, .sl-compose, .sl-toolbar .sl-search, .sl-toolbar .sl-select' },
  toggle: { label: '03 · Переключатели', selector: '.sl-segmented, .sl-switch, .sl-check' },
  tag: { label: '04 · Теги и счётчики', selector: '.sl-tag, .sl-chip' },
  status: { label: '05 · Статусы', selector: '.sl-status, .sl-pill' },
  card: { label: '06 · Карточка объекта', selector: '.sl-card:not(.sl-link-card, .sl-step, :has(.sl-progress))' },
  metric: { label: '07 · Карточка показателя', selector: '.sl-card:has(.sl-progress)' },
  'link-card': { label: '08 · Карточки-ссылки и шаги', selector: '.sl-link-card, .sl-step' },
  banner: { label: '09 · Баннеры', selector: '.sl-banner' },
  stats: { label: '10 · Сводка цифрами', selector: '.sl-stats' },
  list: { label: '11 · Список с группами', selector: '.sl-list' },
  disclosure: { label: '12 · Раскрывающиеся разделы', selector: '.sl-disclosure' },
  table: { label: '13 · Таблица', selector: '.sl-table-wrap' },
  empty: { label: '14 · Пустое состояние', selector: '.sl-empty' },
  page: { label: '15 · Заголовок и фильтры', selector: '.sl-page-head, .sl-toolbar, .sl-section-title' },
  topbar: { label: '16 · Верхняя панель', selector: '.sl-topbar' },
  statusbar: { label: '17 · Строка состояния', selector: '.sl-statusbar, .sl-dock-btn' },
  menu: { label: '18 · Меню аккаунта', selector: '.sl-menu' },
  picker: { label: '19 · Выбор из плиток', selector: '.sl-picker' },
  window: { label: '20 · Плавающее окно', selector: '.sl-window' },
  modal: { label: '21 · Модальное окно', selector: '.sl-modal' },
  toast: { label: '22 · Уведомления', selector: '.sl-toast, .sl-tooltip' },
  login: { label: '23 · Карточка входа', selector: '.sl-login' },
  nav: { label: '24 · Боковое меню', selector: '.sl-nav' },
  shell: { label: 'Каркас · содержимое страницы', selector: '.sl-shell__main' },
};

/** Номер в заголовке истории → ключ компонента. */
export function componentFromTitle(title = '') {
  if (title.startsWith('Каркас/')) return 'shell';
  const n = title.match(/Компоненты\/(\d\d)/)?.[1];
  return Object.keys(COMPONENTS).find(k => COMPONENTS[k].label.startsWith(n + ' ')) || null;
}

export const THEME_DEFAULTS = { accentLight: '#16181c', accentDark: '#eef0f2', bgLight: '#e9ebee', bgDark: '#0c0e11', radius: 7, fontSize: 13, controlHeight: 34 };

const lum = hex => {
  const n = parseInt(String(hex).replace('#', '').slice(0, 6), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const onColor = hex => (lum(hex) > 0.18 ? '#0c0e11' : '#ffffff');

const radii = r => `--sl-r-xs: ${Math.max(0, r - 2)}px; --sl-r-sm: ${r}px; --sl-r-md: ${r + 3}px; --sl-r-lg: ${r + 7}px;`;

/** CSS темы (цвета, скругления, размеры) — то же, что показывает редактор темы. */
export function themeCSS(t, { light = ':root, [data-theme="light"]', dark = '[data-theme="dark"]', root = ':root', media = true } = {}) {
  const L = `--sl-inverse: ${t.accentLight}; --sl-on-inverse: ${onColor(t.accentLight)}; --sl-focus: ${t.accentLight}; --sl-bg: ${t.bgLight};`;
  const D = `--sl-inverse: ${t.accentDark}; --sl-on-inverse: ${onColor(t.accentDark)}; --sl-focus: ${t.accentDark}; --sl-bg: ${t.bgDark};`;
  return [
    `${light} { ${L} }`,
    `${dark} { ${D} }`,
    media ? `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ${D} } }` : '',
    `${root} { ${radii(t.radius)} --sl-fs-body: ${t.fontSize}px; --sl-fs-small: ${t.fontSize - 1}px; --sl-fs-strong: ${t.fontSize + 1}px; --sl-h-md: ${t.controlHeight}px; --sl-h-sm: ${t.controlHeight - 6}px; --sl-h-lg: ${t.controlHeight + 6}px; }`,
  ].filter(Boolean).join('\n');
}

/** CSS одной примерки компонента. scale — %, radius — px или -1 («как в теме»). */
export function componentCSS(key, { scale = 100, radius = -1 } = {}, scope = '') {
  const c = COMPONENTS[key];
  if (!c || (Number(scale) === 100 && Number(radius) < 0)) return '';
  const sel = c.selector.split(',').map(s => `${scope}${s.trim()}`).join(', ');
  const parts = [];
  if (Number(scale) !== 100) parts.push(`zoom: ${Number(scale) / 100};`);
  if (Number(radius) >= 0) parts.push(radii(Number(radius)));
  return `${sel} { ${parts.join(' ')} }`;
}

/** Полный CSS шаблона для проекта. */
export function templateCSS(draft, name = 'Шаблон') {
  const comps = Object.entries(draft.components || {}).map(([k, v]) => componentCSS(k, v)).filter(Boolean);
  const body = [draft.theme ? themeCSS(draft.theme) : '', ...comps].filter(Boolean).join('\n');
  return `/* Sloyka · ${name}. Подключайте после стилей библиотеки. */
@layer sl.reset, sl.tokens, sl.base, sl.components, sl.template;
@layer sl.template {
${body.split('\n').map(l => '  ' + l).join('\n')}
}
`;
}

/** «Шаблон 1» → template-1; прочее — латиница, цифры и дефис. */
export function slugify(name) {
  const n = String(name).trim().match(/^(шаблон|template)\s*[-_ ]?\s*(\d+)$/i);
  if (n) return `template-${n[2]}`;
  const map = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ы: 'y', э: 'e', ю: 'yu', я: 'ya' };
  return String(name).toLowerCase().split('').map(ch => map[ch] ?? ch).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'template';
}

export function loadDraft() {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY)) || { components: {} }; } catch { return { components: {} }; }
}
export function saveDraft(d) { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); }
export function addComponent(key, scale, radius) {
  const d = loadDraft(); d.components = d.components || {}; d.components[key] = { scale: Number(scale), radius: Number(radius) }; saveDraft(d); return d;
}
export function addTheme(theme) { const d = loadDraft(); d.theme = { ...THEME_DEFAULTS, ...theme }; saveDraft(d); return d; }
