// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/15 · Заголовок страницы и панель фильтров',
  tags: ["autodocs", "ref-base"],
  parameters: {"docs": {"description": {"component": "Заголовок раздела капсом с линией, ряд фильтров слева и главное действие справа, подзаголовок секции."}}},
};

export const Default = {
  name: 'Заголовок страницы и панель фильтров',
  render: () => `<div class="sl-page-head"><h1 class="sl-page-title">Устройства</h1><span class="lbl">Сервер работает 31 мин</span></div>
  <div class="sl-toolbar">
    <label class="sl-search"><i data-ic="search"></i><input class="sl-input" placeholder="Поиск по названию и адресу"></label>
    <select class="sl-select" aria-label="Все классы"><option>Все классы</option></select>
    <select class="sl-select" aria-label="Все состояния"><option>Все состояния</option></select>
    <div class="sl-toolbar__end"><button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>Добавить устройство</button></div>
  </div>
  <h2 class="sl-section-title">Использование ресурсов сервера</h2>`,
};

export const Playground = {
  name: 'Песочница',
  args: { title: 'Устройства', note: 'Сервер работает 31 мин', search: 'Поиск по названию и адресу', filters: 'Все классы, Все состояния', action: 'Добавить устройство', section: 'Использование ресурсов сервера' },
  argTypes: {
    title: { name: 'Заголовок страницы', control: 'text' },
    note: { name: 'Подпись справа', control: 'text' },
    search: { name: 'Поиск (пусто — без него)', control: 'text' },
    filters: { name: 'Фильтры через запятую', control: 'text' },
    action: { name: 'Главная кнопка', control: 'text' },
    section: { name: 'Подзаголовок секции', control: 'text' },
  },
  render: a => `<div class="col">
    <div class="sl-page-head"><h1 class="sl-page-title">${a.title}</h1>${a.note ? `<span class="lbl">${a.note}</span>` : ''}</div>
    <div class="sl-toolbar">${a.search ? `<label class="sl-search"><i data-ic="search"></i><input class="sl-input" placeholder="${a.search}"></label>` : ''}
      ${a.filters.split(',').map(s => s.trim()).filter(Boolean).map(f => `<select class="sl-select" aria-label="${f}"><option>${f}</option></select>`).join('')}
      ${a.action ? `<div class="sl-toolbar__end"><button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>${a.action}</button></div>` : ''}</div>
    ${a.section ? `<h2 class="sl-section-title">${a.section}</h2>` : ''}</div>`,
};
