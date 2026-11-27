import { Picker, Tile } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/19 · Выбор из плиток',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Всплывающая панель выбора подсистемы: выбранная плитка инвертирована, недоступные с пометкой.' } } },
};

export const Default = {
  name: 'Выбор из плиток',
  render: () => (
    <Picker title="Подсистема">
      <Tile>Центр</Tile>
      <Tile selected>Видеонаблюдение</Tile>
      <Tile disabled note="В разработке">Связь</Tile>
      <Tile disabled note="В разработке">Разведка</Tile>
      <Tile>Периметр</Tile>
      <Tile disabled note="В разработке">Склад</Tile>
    </Picker>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { title: 'Подсистема', tiles: 'Центр\nВидеонаблюдение\nСвязь | В разработке\nПериметр', selected: 2 },
  argTypes: {
    title: { name: 'Заголовок', control: 'text' },
    tiles: { name: 'Плитки по строке («текст | пометка» — недоступна)', control: 'text' },
    selected: { name: 'Выбрана плитка №', control: { type: 'number', min: 0 } },
  },
  render: (a: Args) => (
    <Picker title={a.title}>
      {String(a.tiles).split('\n').filter(Boolean).map((t, i) => {
        const [name, note] = t.split('|').map((s) => s.trim());
        return note
          ? <Tile key={i} disabled note={note}>{name}</Tile>
          : <Tile key={i} selected={i + 1 === a.selected ? true : undefined}>{name}</Tile>;
      })}
    </Picker>
  ),
};
