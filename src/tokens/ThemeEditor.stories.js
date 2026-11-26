// Редактор темы: меняйте цвета и размеры в панели «Элементы управления» — пример пересобирается сразу,
// а внизу появляется готовый CSS, который можно вставить в проект.
export default {
  title: 'Основа/Редактор темы',
  parameters: {
    docs: { description: { component: 'Подберите главный цвет, фон, скругления и размеры. Скопируйте CSS из блока внизу в стили проекта — библиотеку менять не нужно.' } },
  },
};

const lum = hex => {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
// текст на главном цвете — белый или почти чёрный, что контрастнее
const onColor = hex => (lum(hex) > 0.18 ? '#0c0e11' : '#ffffff');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const css = a => `/* Sloyka — настройки темы проекта. Вставьте после подключения библиотеки, вне @layer. */
:root, [data-theme="light"] {
  --sl-inverse: ${a.accentLight}; --sl-on-inverse: ${onColor(a.accentLight)}; --sl-focus: ${a.accentLight};
  --sl-bg: ${a.bgLight};
}
[data-theme="dark"] {
  --sl-inverse: ${a.accentDark}; --sl-on-inverse: ${onColor(a.accentDark)}; --sl-focus: ${a.accentDark};
  --sl-bg: ${a.bgDark};
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --sl-inverse: ${a.accentDark}; --sl-on-inverse: ${onColor(a.accentDark)}; --sl-focus: ${a.accentDark};
    --sl-bg: ${a.bgDark};
  }
}
:root {
  --sl-r-xs: ${Math.max(0, a.radius - 2)}px; --sl-r-sm: ${a.radius}px; --sl-r-md: ${a.radius + 3}px; --sl-r-lg: ${a.radius + 7}px;
  --sl-fs-body: ${a.fontSize}px; --sl-fs-small: ${a.fontSize - 1}px; --sl-fs-strong: ${a.fontSize + 1}px;
  --sl-h-md: ${a.controlHeight}px; --sl-h-sm: ${a.controlHeight - 6}px; --sl-h-lg: ${a.controlHeight + 6}px;
}`;

const preview = `
  <div class="row"><button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>Добавить устройство</button><button class="sl-btn"><i data-ic="refresh"></i>Обновить</button><button class="sl-btn sl-btn--ghost">Отмена</button></div>
  <div class="g2">
    <label class="sl-field"><span class="sl-label">Имя пользователя</span><input class="sl-input" placeholder="Введите логин"></label>
    <label class="sl-field"><span class="sl-label">Класс</span><select class="sl-select" aria-label="Класс"><option>Все классы</option></select></label>
  </div>
  <div class="row"><sl-segmented class="sl-segmented"><button>Схема</button><button aria-pressed="true">Спутник</button></sl-segmented>
    <label class="sl-switch"><input type="checkbox" checked>Зоны охраны</label><span class="sl-tag">Администратор</span><span class="sl-count sl-count--solid">4</span></div>
  <article class="sl-card" data-accent="ok" style="max-width:380px"><div class="sl-card__head"><div><div class="sl-card__title">Камера КПП-1</div><div class="sl-card__sub">Видео · V-200</div></div><span class="sl-tag">2 устройства</span></div>
    <dl class="sl-kv"><dt>Адрес</dt><dd>10.20.6.88:18080</dd><dt>Последний ответ</dt><dd>10:33</dd></dl><div class="sl-card__foot"><span class="sl-status sl-status--ok">На связи</span></div></article>
  <div class="sl-list panel" style="max-width:380px"><div class="sl-row" aria-current="true"><div class="sl-row__main"><span class="sl-row__title">Шлюз-2</span><span class="sl-status sl-status--ok">Онлайн</span></div></div><div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Шлюз-04</span><span class="sl-status sl-status--hollow">Офлайн</span></div></div></div>`;

export const Editor = {
  name:'Редактор темы',
  args:{ accentLight: '#16181c', accentDark: "#f9f9f9", bgLight: '#e9ebee', bgDark: '#0c0e11', radius: 9, fontSize: 13, controlHeight: 34 },
  argTypes:{
    accentLight:{ name: 'Главный цвет · светлая', control: 'color' },
    accentDark:{ name: 'Главный цвет · тёмная', control: 'color' },
    bgLight:{ name: 'Фон страницы · светлая', control: 'color' },
    bgDark:{ name: 'Фон страницы · тёмная', control: 'color' },
    radius:{ name: 'Скругление кнопок и полей, px', control: { type: 'range', min: 0, max: 16, step: 1 } },
    fontSize:{ name: 'Основной текст, px', control: { type: 'range', min: 12, max: 16, step: 1 } },
    controlHeight:{ name: 'Высота кнопок и полей, px', control: { type: 'range', min: 28, max: 44, step: 2 } },
  },
  render:a => {
    const scoped = css(a).replace(/:root, \[data-theme="light"\]/g, '[data-theme="light"] .sb-tune').replace(/\[data-theme="dark"\] \{/g, '[data-theme="dark"] .sb-tune {').replace(/@media[\s\S]*?\n}\n/, '').replace(/^:root \{/m, '.sb-tune {');
    return `<style>${scoped}</style>
<div class="sb-tune" style="display:grid;gap:16px;padding:16px;border-radius:var(--sl-r-lg);background:var(--sl-bg);font-size:var(--sl-fs-body)">${preview}</div>
<div class="sl-field"><span class="sl-label">CSS для проекта</span><pre style="margin:0;padding:12px;border-radius:var(--sl-r-md);background:var(--sl-surface);border:1px solid var(--sl-border-soft);font:12px/1.5 ui-monospace,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere;user-select:all">${esc(css(a))}</pre></div>`;
  },
};
