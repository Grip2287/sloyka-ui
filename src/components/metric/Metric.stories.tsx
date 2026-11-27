import { Metric } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/07 · Карточка показателя',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Нагрузка процессора, памяти, диска: значение, оценка, полоса заполнения.' } } },
};

export const Default = {
  name: 'Карточка показателя',
  render: () => (
    <div className="g3">
      <Metric label="Процессор" value={5.3} note="Ядер: 12" />
      <Metric label="Память" value={78.2} note="Доступно 3,4 из 15,7 ГБ" />
      <Metric label="Диск" value={93.4} note="Свободно 61 из 931 ГБ" />
    </div>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { label: 'Память', value: 78, note: 'Доступно 3,4 из 15,7 ГБ' },
  argTypes: {
    label: { name: 'Название', control: 'text' },
    value: { name: 'Значение, %', control: { type: 'range', min: 0, max: 100, step: 1 } },
    note: { name: 'Пояснение', control: 'text' },
  },
  render: (a: Args) => <div style={{ maxWidth: 340 }}><Metric label={a.label} value={Number(a.value)} note={a.note || undefined} /></div>,
};
