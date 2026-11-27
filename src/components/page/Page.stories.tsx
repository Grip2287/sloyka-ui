import { PageHeader, Toolbar, Search, Select, Button, Text } from '../../react';

type Args = Record<string, any>;
const one = (label: string) => [{ value: label, label }];

export default {
  title: 'Компоненты/15 · Заголовок страницы и панель фильтров',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Заголовок раздела капсом с линией, ряд фильтров слева и главное действие справа, подзаголовок секции.' } } },
};

export const Default = {
  name: 'Заголовок страницы и панель фильтров',
  render: () => (
    <>
      <PageHeader title="Устройства" aside="Сервер работает 31 мин" />
      <Toolbar>
        <Search placeholder="Поиск по названию и адресу" />
        <Select aria-label="Все классы" options={one('Все классы')} />
        <Select aria-label="Все состояния" options={one('Все состояния')} />
        <Toolbar.End><Button variant="primary" icon="plus">Добавить устройство</Button></Toolbar.End>
      </Toolbar>
      <Text as="section">Использование ресурсов сервера</Text>
    </>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { title: 'Устройства', note: 'Сервер работает 31 мин', search: 'Поиск по названию и адресу', filters: 'Все классы, Все состояния', action: 'Добавить устройство', section: 'Использование ресурсов сервера' },
  argTypes: {
    title: { name: 'Заголовок страницы', control: 'text' },
    note: { name: 'Подпись справа', control: 'text' },
    search: { name: 'Поиск (пусто — без него)', control: 'text' },
    filters: { name: 'Фильтры через запятую', control: 'text' },
    action: { name: 'Главная кнопка', control: 'text' },
    section: { name: 'Подзаголовок секции', control: 'text' },
  },
  render: (a: Args) => (
    <div className="col">
      <PageHeader title={a.title} aside={a.note || undefined} />
      <Toolbar>
        {a.search && <Search placeholder={a.search} />}
        {String(a.filters).split(',').map((s) => s.trim()).filter(Boolean).map((f) => <Select key={f} aria-label={f} options={one(f)} />)}
        {a.action && <Toolbar.End><Button variant="primary" icon="plus">{a.action}</Button></Toolbar.End>}
      </Toolbar>
      {a.section && <Text as="section">{a.section}</Text>}
    </div>
  ),
};
