// Каркас админки: полное меню ≥1200, рейл 768–1199, выезжающее меню <768.
import type { ReactNode } from 'react';
import {
  Shell, Topbar, Button, ThemeProvider, ThemeToggle, PageHeader, Toolbar, Search, Select, Banner, Grid, Card, KeyValue,
  Status, Tag, Text, Table, type TableColumn,
} from '../../react';
import { DemoNav } from '../../../.storybook/nav-data';

type Args = Record<string, any>;
const one = (label: string) => [{ value: label, label }];

export default {
  title: 'Каркас/Админка',
  tags: ['progressive', 'ref-base'],
  parameters: {
    layout: 'fullscreen', pair: false, progressiveText: ['Устройства', 'Журнал изменений'],
    docs: { description: { component: 'Верхняя панель, боковое меню и основная область. Сузьте окно, чтобы увидеть рейл и выезжающее меню.' } },
  },
};

interface LogRow { id: number; time: string; user: string; tone: 'ok' | 'crit' | 'off'; action: string; details: string }
const LOG: LogRow[] = [
  { id: 1, time: '14.11.2026, 21:19', user: 'ivanov', tone: 'off', action: 'Изменение', details: 'Камера КПП-1: изменён адрес' },
  { id: 2, time: '02.11.2026, 18:41', user: 'ivanov', tone: 'ok', action: 'Создание', details: 'Создано устройство «Шлюз-04»' },
  { id: 3, time: '02.11.2026, 18:40', user: 'petrov', tone: 'crit', action: 'Удаление', details: 'Удалено устройство «Шлюз-03»' },
];
const COLUMNS: TableColumn<LogRow>[] = [
  { key: 'time', title: 'Время' },
  { key: 'user', title: 'Пользователь', render: (r) => <Text inline weight="strong">{r.user}</Text> },
  { key: 'action', title: 'Действие', render: (r) => <Status tone={r.tone}>{r.action}</Status> },
  { key: 'details', title: 'Подробности' },
];

const DEVICES = (
  <>
    <Card accent="crit">
      <Card.Head title="Шлюз-04" subtitle="Связь · Шлюз-04" />
      <KeyValue items={[['Адрес', '10.20.4.25:9100'], ['На карте', 'не размещён'], ['Последний ответ', '—']]} />
      <Card.Foot><Status tone="crit">Нет связи</Status></Card.Foot>
    </Card>
    <Card accent="ok">
      <Card.Head title="Камера КПП-1" subtitle="Видео · V-200" aside={<Tag>2 устройства</Tag>} />
      <KeyValue items={[['Адрес', '10.20.6.88:18080'], ['На карте', 'размещена'], ['Последний ответ', '10:33']]} />
      <Card.Foot><Status tone="ok">На связи</Status></Card.Foot>
    </Card>
    <Card accent="off">
      <Card.Head title="Датчик периметра" subtitle="Охрана · П-3" />
      <KeyValue items={[['Адрес', 'не указан'], ['На карте', 'не размещён'], ['Последний ответ', '10:33']]} />
      <Card.Foot><Status>Отключён</Status></Card.Foot>
    </Card>
  </>
);

function Admin({ brand = 'SLOYKA', title = 'Устройства', banner, cards = DEVICES }: { brand?: string; title?: string; banner?: ReactNode; cards?: ReactNode }) {
  return (
    <ThemeProvider defaultTheme={document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'} storageKey="sb-shell-theme">
      <Shell
        topbar={
          <Topbar brand={{ mark: 'S', name: brand }} title="Панель администрирования">
            <Button size="sm" icon="arrow-left">Мониторинг</Button>
            <ThemeToggle />
            <Button size="sm" icon="user">ОД 12</Button>
            <Button size="sm" iconOnly icon="power" variant="danger" aria-label="Выйти" />
          </Topbar>
        }
        nav={<DemoNav />}
      >
        <PageHeader title={title} />
        <Toolbar>
          <Search placeholder="Поиск по названию и адресу" />
          <Select aria-label="Все классы" options={one('Все классы')} />
          <Select aria-label="Все состояния" options={one('Все состояния')} />
          <Toolbar.End><Button variant="primary" icon="plus">Добавить устройство</Button></Toolbar.End>
        </Toolbar>
        {banner}
        <Grid>{cards}</Grid>
        <Text as="section">Журнал изменений</Text>
        <Table columns={COLUMNS} rows={LOG} rowKey="id" />
      </Shell>
    </ThemeProvider>
  );
}

export const Default = {
  name: 'Устройства',
  render: () => (
    <Admin banner={<Banner tone="warn" title="2 устройства не размещены на карте">Разместите их в разделе «Карты», иначе зоны не построятся.</Banner>} />
  ),
};

const TONES = ['ok', 'warn', 'crit', 'off'] as const;
export const Playground = {
  name: 'Песочница',
  args: { brand: 'SLOYKA', title: 'Устройства', banner: '2 устройства не размещены на карте', cards: 3 },
  argTypes: {
    brand: { name: 'Название продукта', control: 'text' },
    title: { name: 'Заголовок страницы', control: 'text' },
    banner: { name: 'Баннер (пусто — нет)', control: 'text' },
    cards: { name: 'Карточек', control: { type: 'range', min: 0, max: 9, step: 1 } },
  },
  render: (a: Args) => (
    <Admin brand={a.brand} title={a.title}
      banner={a.banner ? <Banner tone="warn" title={a.banner} /> : undefined}
      cards={Array.from({ length: Number(a.cards) }, (_, i) => (
        <Card key={i} accent={TONES[i % 4]}>
          <Card.Head title={`Устройство ${i + 1}`} subtitle="Класс · Модель" />
          <KeyValue items={[['Адрес', `10.0.0.${i + 1}:9100`]]} />
        </Card>
      ))} />
  ),
};
