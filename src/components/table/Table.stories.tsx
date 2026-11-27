import { Table, Status, Text, type TableColumn } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/13 · Таблица',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Журнал: заголовки капсом, статус в ячейке, действия справа. На телефоне строки превращаются в карточки. Ниже — пустая таблица.' } } },
};

interface LogRow { id: number; time: string; user: string; tone: 'ok' | 'crit' | 'off'; event: string; ip: string; details: string; muted?: boolean }
const LOG: LogRow[] = [
  { id: 1, time: '26.11.2026, 11:04', user: 'ivanov', tone: 'ok', event: 'Вход', ip: '127.0.0.1', details: 'Chrome 156 · Windows', muted: true },
  { id: 2, time: '26.11.2026, 10:40', user: 'admin', tone: 'crit', event: 'Ошибка входа', ip: '127.0.0.1', details: 'Пользователь не найден' },
  { id: 3, time: '26.11.2026, 09:49', user: 'petrov', tone: 'off', event: 'Изменение', ip: '10.0.0.12', details: 'Яндекс Браузер 26', muted: true },
];
const COLUMNS: TableColumn<LogRow>[] = [
  { key: 'time', title: 'Время' },
  { key: 'user', title: 'Пользователь', render: (r) => <Text inline weight="strong">{r.user}</Text> },
  { key: 'event', title: 'Событие', render: (r) => <Status tone={r.tone}>{r.event}</Status> },
  { key: 'ip', title: 'IP-адрес' },
  { key: 'details', title: 'Подробности', render: (r) => (r.muted ? <Text inline tone="muted">{r.details}</Text> : r.details) },
];
const EMPTY_COLUMNS: TableColumn<LogRow>[] = ['Время', 'Категория', 'Уровень', 'Сообщение'].map((title, i) => ({ key: `c${i}`, title }));

export const Default = {
  name: 'Таблица',
  render: () => (
    <>
      <Table columns={COLUMNS} rows={LOG} rowKey="id" />
      <Table columns={EMPTY_COLUMNS} rows={[]} rowKey="id" stack={false} empty="Событий нет" />
    </>
  ),
};

type Cells = { id: number; cells: string[] };
export const Playground = {
  name: 'Песочница',
  args: { columns: 'Время, Пользователь, Событие, Подробности', rows: '26.11.2026, 11:04 | ivanov | ok:Вход | Chrome · Windows\n26.11.2026, 10:40 | admin | crit:Ошибка входа | Пользователь не найден\n26.11.2026, 09:49 | petrov | off:Изменение | Яндекс Браузер', stack: true, empty: false },
  argTypes: {
    columns: { name: 'Колонки через запятую', control: 'text' },
    rows: { name: 'Строки: ячейки через |, статус как «ok:Текст»', control: 'text' },
    stack: { name: 'На телефоне — карточками', control: 'boolean' },
    empty: { name: 'Пустая таблица', control: 'boolean' },
  },
  render: (a: Args) => {
    const cols = String(a.columns).split(',').map((s) => s.trim());
    const cell = (v = '') => {
      const m = v.match(/^(ok|warn|crit|off):(.*)$/);
      return m ? <Status tone={m[1] as 'ok' | 'warn' | 'crit' | 'off'}>{m[2]}</Status> : v;
    };
    const columns: TableColumn<Cells>[] = cols.map((title, i) => ({ key: `c${i}`, title, render: (r) => cell(r.cells[i]) }));
    const rows: Cells[] = a.empty ? [] : String(a.rows).split('\n').filter(Boolean).map((r, id) => ({ id, cells: r.split('|').map((s) => s.trim()) }));
    return <Table columns={columns} rows={rows} rowKey="id" stack={a.stack} empty="Событий нет" />;
  },
};
