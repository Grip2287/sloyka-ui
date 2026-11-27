// Пример панели для редактора темы и страницы «Мой шаблон»: по одному экземпляру основных компонентов.
import {
  Topbar, Button, PageHeader, Toolbar, Search, Select, Segmented, Switch, Tag, Chip, Banner, Stats, Card, KeyValue,
  Metric, List, Row, Status, Table, Text, Menu,
} from '../src/react';
import { StaticToast } from './static';

const LOG = [{ id: 1, time: '26.11.2026, 11:04', user: 'ivanov' }];

export function Sample() {
  return (
    <>
      <div style={{ borderRadius: 'var(--sl-r-md)', overflow: 'hidden' }}>
        <Topbar brand={{ mark: 'S', name: 'SLOYKA' }} title="Панель">
          <Button size="sm" iconOnly icon="moon" aria-label="Тёмная тема" />
          <Button size="sm" iconOnly icon="power" variant="danger" aria-label="Выйти" />
        </Topbar>
      </div>
      <PageHeader title="Устройства" />
      <Toolbar>
        <Search placeholder="Поиск" />
        <Select aria-label="Все классы" options={[{ value: 'all', label: 'Все классы' }]} />
        <Toolbar.End><Button variant="primary" icon="plus">Добавить устройство</Button></Toolbar.End>
      </Toolbar>
      <div className="row">
        <Button icon="refresh">Обновить</Button>
        <Button variant="ghost">Отмена</Button>
        <Segmented options={[{ value: 'scheme', label: 'Схема' }, { value: 'sat', label: 'Спутник' }]} defaultValue="sat" aria-label="Вид карты" />
        <Switch defaultChecked>Зоны охраны</Switch>
        <Tag>Администратор</Tag>
        <Chip count={1}>На линии</Chip>
      </div>
      <Banner tone="warn" title="2 устройства не размещены на карте" />
      <div style={{ maxWidth: 420 }}>
        <Stats items={[{ label: 'Онлайн', value: 10, tone: 'ok' }, { label: 'Офлайн', value: 1 }]} />
      </div>
      <div className="g2">
        <Card accent="ok">
          <Card.Head title="Камера КПП-1" subtitle="Видео · V-200" aside={<Tag>2 устройства</Tag>} />
          <KeyValue items={[['Адрес', '10.20.6.88:18080'], ['Последний ответ', '10:33']]} />
          <Card.Foot><Status tone="ok">На связи</Status></Card.Foot>
        </Card>
        <Metric label="Память" value={78} />
      </div>
      <div className="panel" style={{ maxWidth: 420 }}>
        <List>
          <Row title="Шлюз-2" current status={<Status tone="ok">Онлайн</Status>} />
          <Row title="Шлюз-04" status={<Status tone="hollow">Офлайн</Status>} />
        </List>
      </div>
      <Table rowKey="id" rows={LOG} columns={[
        { key: 'time', title: 'Время' },
        { key: 'user', title: 'Пользователь', render: (r) => <Text inline weight="strong">{r.user}</Text> },
        { key: 'event', title: 'Событие', render: () => <Status tone="ok">Вход</Status> },
      ]} />
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <StaticToast kind="ok" title="Сохранено" />
        <div style={{ width: 220 }}>
          <Menu>
            <Menu.Item icon="user">Профиль</Menu.Item>
            <Menu.Item icon="power" danger>Выйти</Menu.Item>
          </Menu>
        </div>
      </div>
    </>
  );
}
