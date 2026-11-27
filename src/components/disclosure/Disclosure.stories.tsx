import { Disclosure } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/12 · Раскрывающиеся разделы',
  tags: ['autodocs', 'progressive', 'ref-base'],
  parameters: { docs: { description: { component: 'Разделы панели редактирования: стрелка поворачивается, содержимое раскрывается.' } }, progressiveText: ['Название, адрес, периметр объекта.'] },
};

export const Default = {
  name: 'Раскрывающиеся разделы',
  render: () => (
    <div className="panel" style={{ padding: '4px 14px' }}>
      <Disclosure title="Объект" defaultOpen>Название, адрес, периметр объекта.</Disclosure>
      <Disclosure title="Состав объекта" />
      <Disclosure title="Зоны охраны" />
      <Disclosure title="Палитра" />
    </div>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { sections: 'Объект\nСостав объекта\nЗоны охраны\nПалитра', body: 'Название, адрес, периметр объекта.', openFirst: true },
  argTypes: {
    sections: { name: 'Разделы, по строке', control: 'text' },
    body: { name: 'Текст внутри раздела', control: 'text' },
    openFirst: { name: 'Первый раздел открыт', control: 'boolean' },
  },
  render: (a: Args) => (
    <div className="panel" style={{ padding: '4px 14px', maxWidth: 420 }}>
      {String(a.sections).split('\n').filter(Boolean).map((s, i) => (
        <Disclosure key={`${i}:${s}:${a.openFirst}`} title={s} defaultOpen={i === 0 && a.openFirst}>{a.body}</Disclosure>
      ))}
    </div>
  ),
};
