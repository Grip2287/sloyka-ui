// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/19 · Выбор из плиток',
  tags: ["autodocs", "ref-base"],
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

export const Playground = {
  name: 'Песочница',
  args: { title: 'Подсистема', tiles: 'Центр\nВидеонаблюдение\nСвязь | В разработке\nПериметр', selected: 2 },
  argTypes: {
    title: { name: 'Заголовок', control: 'text' },
    tiles: { name: 'Плитки по строке («текст | пометка» — недоступна)', control: 'text' },
    selected: { name: 'Выбрана плитка №', control: { type: 'number', min: 0 } },
  },
  render: a => `<div class="sl-picker"><span class="sl-caps">${a.title}</span><div class="sl-picker__grid">${a.tiles.split('\n').filter(Boolean).map((t, i) => { const [name, note] = t.split('|').map(s => s.trim()); return note ? `<button class="sl-tile" disabled>${name}<small>${note}</small></button>` : `<button class="sl-tile"${i + 1 === a.selected ? ' aria-pressed="true"' : ''}>${name}</button>`; }).join('')}</div></div>`,
};
