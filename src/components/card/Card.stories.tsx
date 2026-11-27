import { Card, KeyValue, Status, Tag, Button, Text } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/06 · Карточка объекта',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Цветная полоса слева по статусу, параметры «название — значение», статус внизу. Вариант для пользователя с иконкой и тегом.' } } },
};

export const Default = {
  name: 'Карточка объекта',
  render: () => (
    <div className="g2">
      <Card interactive accent="crit">
        <Card.Head title="Шлюз-04" subtitle="Связь · Шлюз-04" />
        <KeyValue items={[['Адрес', '10.20.4.25:9100'], ['На карте', 'не размещён'], ['Последний ответ', <Text inline tone="muted">не поступало</Text>]]} />
        <Card.Foot><Status tone="crit">Нет связи</Status><Button size="sm" variant="ghost">Подробнее</Button></Card.Foot>
      </Card>
      <Card interactive accent="ok">
        <Card.Head title="Камера КПП-1" subtitle="Видео · Модель V-200" aside={<Tag>2 устройства</Tag>} />
        <KeyValue items={[['Адрес', '10.20.6.88:18080'], ['На карте', 'размещена'], ['Последний ответ', '10:33']]} />
        <Card.Foot><Status tone="ok">На связи</Status></Card.Foot>
      </Card>
      <Card accent="ok">
        <Card.Head icon="shield" title="ivanov" subtitle="Иванов И. И." aside={<Tag>Администратор</Tag>} />
        <KeyValue items={[['Должность', 'Дежурный'], ['Последний вход', '26.11.2026, 10:43'], ['Посты', <><Tag>Центр</Tag> <Tag>Пост 2</Tag></>]]} />
        <Card.Foot><Status tone="ok">Активен</Status></Card.Foot>
      </Card>
      <Card accent="off">
        <Card.Head title="Сбор дежурной смены" />
        <Text>Внимание. Дежурной смене прибыть на пост охраны. Оповещение проводит дежурный оператор.</Text>
        <Card.Foot><Status>Отключён</Status></Card.Foot>
      </Card>
    </div>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { title: 'Камера КПП-1', subtitle: 'Видео · Модель V-200', accent: 'ok', tag: '2 устройства', rows: 'Адрес: 10.20.6.88:18080\nНа карте: размещена\nПоследний ответ: 10:33', status: 'На связи', interactive: true },
  argTypes: {
    title: { name: 'Заголовок', control: 'text' },
    subtitle: { name: 'Подзаголовок', control: 'text' },
    accent: { name: 'Полоса слева', control: 'inline-radio', options: ['ok', 'warn', 'crit', 'off', 'нет'] },
    tag: { name: 'Тег справа', control: 'text' },
    rows: { name: 'Строки «название: значение»', control: 'text' },
    status: { name: 'Статус внизу', control: 'text' },
    interactive: { name: 'Подъём при наведении', control: 'boolean' },
  },
  render: (a: Args) => {
    const rows = String(a.rows).split('\n').filter(Boolean).map((r) => {
      const [k, ...v] = r.split(':');
      return [k.trim(), v.join(':').trim()] as const;
    });
    const tone = ['ok', 'warn', 'crit'].includes(a.accent) ? a.accent : 'off';
    return (
      <div style={{ maxWidth: 380 }}>
        <Card interactive={a.interactive} accent={a.accent === 'нет' ? undefined : a.accent}>
          <Card.Head title={a.title} subtitle={a.subtitle || undefined} aside={a.tag ? <Tag>{a.tag}</Tag> : undefined} />
          {rows.length > 0 && <KeyValue items={rows} />}
          {a.status && <Card.Foot><Status tone={tone}>{a.status}</Status></Card.Foot>}
        </Card>
      </div>
    );
  },
};
