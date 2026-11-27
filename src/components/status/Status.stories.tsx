import { Status, StatusPill } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/05 · Статусы',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Точка + подпись капсом: на связи, предупреждение, нет связи, отключён, офлайн (полая точка). Обычный текстовый статус и плашка «Система в норме».' } } },
};

export const Default = {
  name: 'Статусы',
  render: () => (
    <>
      <div className="row" style={{ gap: 22 }}>
        <Status tone="ok">На связи</Status>
        <Status tone="warn">Предупреждение</Status>
        <Status tone="crit">Нет связи</Status>
        <Status>Отключён</Status>
        <Status tone="hollow" note="Нет связи">Офлайн</Status>
      </div>
      <div className="row" style={{ gap: 22 }}>
        <Status tone="ok" plain>Работает</Status>
        <Status tone="warn" plain>Повышенная нагрузка</Status>
        <StatusPill tone="ok">В норме</StatusPill>
      </div>
    </>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { text: 'На связи', kind: 'ok', style: 'капсом', note: '' },
  argTypes: {
    text: { name: 'Текст', control: 'text' },
    kind: { name: 'Состояние', control: 'inline-radio', options: ['ok', 'warn', 'crit', 'off', 'hollow'] },
    style: { name: 'Начертание', control: 'inline-radio', options: ['капсом', 'обычный'] },
    note: { name: 'Пояснение', control: 'text' },
  },
  render: (a: Args) => <Status tone={a.kind} plain={a.style === 'обычный'} note={a.note || undefined}>{a.text}</Status>,
};
