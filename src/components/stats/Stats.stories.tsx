import { Stats } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/10 · Сводка цифрами',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Счётчики над списком: онлайн, предупреждения, офлайн, всего.' } } },
};

const items = (a: Args) => [
  { label: 'Онлайн', value: a.online, tone: 'ok' as const },
  { label: 'Предупр.', value: a.warn, tone: 'warn' as const },
  { label: 'Офлайн', value: a.offline },
  { label: 'Всего', value: a.total },
];

export const Default = {
  name: 'Сводка цифрами',
  render: () => <Stats items={items({ online: 10, warn: 0, offline: 1, total: 11 })} />,
};

export const Playground = {
  name: 'Песочница',
  args: { online: 10, warn: 0, offline: 1, total: 11 },
  argTypes: {
    online: { name: 'Онлайн', control: { type: 'number', min: 0 } },
    warn: { name: 'Предупреждения', control: { type: 'number', min: 0 } },
    offline: { name: 'Офлайн', control: { type: 'number', min: 0 } },
    total: { name: 'Всего', control: { type: 'number', min: 0 } },
  },
  render: (a: Args) => <div style={{ maxWidth: 420 }}><Stats items={items(a)} /></div>,
};
