import { StatusBar, DockButton } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/17 · Строка состояния и плавающие кнопки',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Часы и «Система в норме» поверх карты, выбор подсистемы, кнопка нижней панели «Силы и средства».' } } },
};

export const Default = {
  name: 'Строка состояния и плавающие кнопки',
  render: () => (
    <>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <StatusBar items={[{ label: 'Астрономическое', value: '11:04:18' }, { label: 'Оперативное', value: '11:04:18 · 26 ноя 2026' }]}
          system={{ tone: 'ok', text: 'В норме' }} />
        <DockButton icon="grid" chevron="down">Центр</DockButton>
      </div>
      <div className="row"><DockButton chevron="up">Силы и средства</DockButton></div>
    </>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { blocks: 'Астрономическое: 11:04:18\nОперативное: 11:04:18 · 26 ноя 2026', system: 'В норме', systemKind: 'ok', dock: 'Силы и средства' },
  argTypes: {
    blocks: { name: 'Блоки «подпись: значение», по строке', control: 'text' },
    system: { name: 'Состояние системы', control: 'text' },
    systemKind: { name: 'Цвет состояния', control: 'inline-radio', options: ['ok', 'warn', 'crit'] },
    dock: { name: 'Кнопка снизу (пусто — нет)', control: 'text' },
  },
  render: (a: Args) => {
    const items = String(a.blocks).split('\n').filter(Boolean).map((b) => { const [k, ...v] = b.split(':'); return { label: k.trim(), value: v.join(':').trim() }; });
    return (
      <div className="col">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <StatusBar items={items} system={{ tone: a.systemKind, text: a.system }} />
        </div>
        {a.dock && <div className="row"><DockButton chevron="up">{a.dock}</DockButton></div>}
      </div>
    );
  },
};
