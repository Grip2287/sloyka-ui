'use client';
// Админка из компонентов Sloyka: ни одного своего тега и стиля.
import { useState } from 'react';
import {
  Shell, Topbar, Nav, PageHeader, Toolbar, Search, Select, Button, Grid, Card, KeyValue, Status,
  Stats, Table, Text, Modal, Field, Stack, Empty, ThemeToggle, useToast,
} from 'sloyka';
import { SITES, EVENTS, type Site, type Tone } from './data';
import { UserModal } from './UserModal';

const STATES = [
  { value: 'all', label: 'Все состояния' },
  { value: 'ok', label: 'На связи' },
  { value: 'warn', label: 'Задержка' },
  { value: 'crit', label: 'Нет связи' },
];

export function AdminApp() {
  const toast = useToast();
  const [sites, setSites] = useState<Site[]>(SITES);
  const [query, setQuery] = useState('');
  const [state, setState] = useState('all');
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const shown = sites.filter(s =>
    (state === 'all' || s.state === state) && s.name.toLowerCase().includes(query.trim().toLowerCase()));

  const count = (t: Tone) => sites.filter(s => s.state === t).length;

  function save() {
    if (!name.trim()) { setError('Укажите название'); return; }
    setSites(list => [...list, { id: `s${list.length + 1}`, name: name.trim(), address: address.trim() || '—', state: 'ok', stateText: 'На связи', devices: 0 }]);
    toast.ok(`Объект «${name.trim()}» добавлен`, { title: 'Готово' });
    setAdding(false); setName(''); setAddress(''); setError('');
  }

  return (
    <Shell
      topbar={
        <Topbar brand={{ mark: 'П', name: 'Пульт' }} title="Объекты">
          <ThemeToggle />
          <Button icon="power" iconOnly aria-label="Выйти" onClick={() => toast.info('Выход выполнен')} />
        </Topbar>
      }
      nav={
        <Nav current="/">
          <Nav.Section title="Мониторинг" />
          <Nav.Item href="/" icon="grid">Объекты</Nav.Item>
          <Nav.Item href="#journal" icon="journal" count={EVENTS.length}>Журнал</Nav.Item>
          <Nav.Section title="Система" />
          <Nav.Item href="#settings" icon="wrench">Настройки</Nav.Item>
        </Nav>
      }
    >
      <PageHeader title="Объекты" />

      <Stats items={[
        { label: 'Всего', value: sites.length },
        { label: 'На связи', value: count('ok'), tone: 'ok' },
        { label: 'Задержка', value: count('warn'), tone: 'warn' },
        { label: 'Нет связи', value: count('crit'), tone: 'crit' },
      ]} />

      <Toolbar>
        <Search aria-label="Поиск объекта" placeholder="Поиск объекта" value={query} onChange={setQuery} />
        <Select aria-label="Состояние" options={STATES} value={state} onChange={setState} />
        <Toolbar.End>
          <UserModal />
          <Button variant="primary" icon="plus" onClick={() => setAdding(true)}>Добавить объект</Button>
        </Toolbar.End>
      </Toolbar>

      {shown.length ? (
        <Grid columns="auto">
          {shown.map(s => (
            <Card key={s.id} accent={s.state}>
              <Card.Head title={s.name} subtitle={s.address} />
              <KeyValue items={[
                ['Состояние', <Status tone={s.state}>{s.stateText}</Status>],
                ['Устройств', String(s.devices)],
              ]} />
            </Card>
          ))}
        </Grid>
      ) : (
        <Empty icon="search" title="Ничего не найдено" text="Измените запрос или фильтр." />
      )}

      <Text as="section">Журнал событий</Text>
      <Table
        columns={[
          { key: 'time', title: 'Время', width: 'min' },
          { key: 'site', title: 'Объект' },
          { key: 'text', title: 'Событие' },
          { key: 'tone', title: 'Важность', render: e => <Status tone={e.tone}>{e.toneText}</Status> },
        ]}
        rows={EVENTS}
        rowKey="id"
        empty="Событий нет"
        stack
      />

      <Modal
        title="Новый объект"
        open={adding}
        onOpenChange={setAdding}
        footer={
          <>
            <Button onClick={() => setAdding(false)}>Отмена</Button>
            <Button variant="primary" onClick={save}>Сохранить</Button>
          </>
        }
      >
        <Stack gap={3}>
          <Field label="Название" value={name} onChange={v => { setName(v); setError(''); }} error={error || undefined} required />
          <Field label="Адрес" value={address} onChange={setAddress} />
        </Stack>
      </Modal>
    </Shell>
  );
}
