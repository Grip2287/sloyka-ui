// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/19 · Выбор из плиток',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Всплывающая панель выбора подсистемы: выбранная плитка инвертирована, недоступные с пометкой."}}},
};

export const Default = {
  name: 'Выбор из плиток',
  render: () => `<div class="sl-picker">
    <span class="sl-caps">Подсистема</span>
    <div class="sl-picker__grid">
      <button class="sl-tile">Центр</button>
      <button class="sl-tile" aria-pressed="true">Видеонаблюдение</button>
      <button class="sl-tile" disabled>Связь<small>В разработке</small></button>
      <button class="sl-tile" disabled>Разведка<small>В разработке</small></button>
      <button class="sl-tile">Периметр</button>
      <button class="sl-tile" disabled>Склад<small>В разработке</small></button>
    </div>
  </div>`,
};
