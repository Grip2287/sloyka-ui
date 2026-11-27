import { Window, Chip, Button, Compose } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/20 · Плавающее окно',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Окно поверх карты (чат смены): заголовок с иконкой и закрытием, панель кнопок, содержимое, строка ввода.' } } },
};

const bar = <><Chip count={1}>На линии</Chip><Button size="sm">Голосовое оповещение</Button></>;

export const Default = {
  name: 'Плавающее окно',
  render: () => (
    <Window title="Чат смены" icon="chat" onClose={() => {}} bar={bar}
      footer={<Compose placeholder="Сообщение…" onSend={() => {}} />}>
      Сообщений пока нет
    </Window>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { title: 'Чат смены', bar: true, body: 'Сообщений пока нет', input: 'Сообщение…', width: 360 },
  argTypes: {
    title: { name: 'Заголовок', control: 'text' },
    bar: { name: 'Панель кнопок', control: 'boolean' },
    body: { name: 'Содержимое', control: 'text' },
    input: { name: 'Строка ввода (пусто — нет)', control: 'text' },
    width: { name: 'Ширина, px', control: { type: 'range', min: 280, max: 560, step: 20 } },
  },
  render: (a: Args) => (
    <div style={{ width: a.width, maxWidth: '100%' }}>
      <Window title={a.title} icon="chat" onClose={() => {}} bar={a.bar ? bar : undefined}
        footer={a.input ? <Compose placeholder={a.input} onSend={() => {}} /> : undefined}>
        {a.body}
      </Window>
    </div>
  ),
};
