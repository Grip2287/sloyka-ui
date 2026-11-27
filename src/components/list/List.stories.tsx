import { List, Group, Row, Status } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/11 · Список с группами',
  tags: ['autodocs', 'progressive', 'ref-base'],
  parameters: { docs: { description: { component: 'Сворачиваемая группа со счётчиком, строки с названием и статусом, выбранная строка (инверсия), стрелка у строк с подробностями.' } }, progressiveText: ['Камера КПП-1', 'Шлюз-04'] },
};

export const Default = {
  name: 'Список с группами',
  render: () => (
    <div className="panel">
      <List>
        <Group title="Комплексные средства" count={4}>
          <Row title="Камера КПП-1" status={<Status tone="ok">Онлайн</Status>} />
          <Row title="Шлюз-2" current chevron status={<Status tone="ok">Онлайн</Status>} />
          <Row title="Датчик периметра" chevron status={<Status tone="ok">Онлайн</Status>} />
          <Row title="Шлюз-04" status={<Status tone="hollow" note="Нет связи">Офлайн</Status>} />
        </Group>
        <Group title="Радары" count={1} defaultCollapsed>
          <Row title="Радар-1" status={<Status tone="ok">Онлайн</Status>} />
        </Group>
      </List>
    </div>
  ),
};

const LBL: Record<string, string> = { ok: 'Онлайн', warn: 'Предупреждение', crit: 'Нет связи', off: 'Офлайн' };
export const Playground = {
  name: 'Песочница',
  args: { group: 'Комплексные средства', items: 'Камера КПП-1 | ok\nШлюз-2 | ok\nДатчик периметра | warn\nШлюз-04 | off', selected: 2, collapsed: false, chevrons: true },
  argTypes: {
    group: { name: 'Название группы', control: 'text' },
    items: { name: 'Строки «название | ok/warn/crit/off»', control: 'text' },
    selected: { name: 'Выбрана строка № (0 — нет)', control: { type: 'number', min: 0 } },
    collapsed: { name: 'Группа свёрнута', control: 'boolean' },
    chevrons: { name: 'Стрелки у строк', control: 'boolean' },
  },
  render: (a: Args) => {
    const rows = String(a.items).split('\n').filter(Boolean).map((r) => r.split('|').map((x) => x.trim()));
    return (
      <div className="panel" style={{ maxWidth: 380 }}>
        <List>
          <Group key={String(a.collapsed)} title={a.group} count={rows.length} defaultCollapsed={a.collapsed}>
            {rows.map(([t, s = 'ok'], i) => (
              <Row key={`${i}:${t}`} title={t} current={i + 1 === a.selected} chevron={a.chevrons}
                status={<Status tone={s === 'off' ? 'hollow' : (s as 'ok' | 'warn' | 'crit')}>{LBL[s] || s}</Status>} />
            ))}
          </Group>
        </List>
      </div>
    );
  },
};
