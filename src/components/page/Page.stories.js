// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/15 · Заголовок страницы и панель фильтров',
  tags: ["autodocs"],
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
