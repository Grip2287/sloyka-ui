import { Tag, Count, Chip } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/04 · Теги и счётчики',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Тег роли, тег-количество, цветные теги, счётчики в группах и меню, «чип» с числом.' } } },
};

export const Default = {
  name: 'Теги и счётчики',
  render: () => (
    <>
      <div className="row">
        <Tag>Администратор</Tag>
        <Tag>Оператор</Tag>
        <Tag tone="solid">Центр</Tag>
        <Tag>2 устройства</Tag>
        <Tag tone="ok">Доступен</Tag>
        <Tag tone="warn">Предупреждение</Tag>
        <Tag tone="crit">Удаление</Tag>
      </div>
      <div className="row">
        <Count>6</Count><Count solid>4</Count><Count>128</Count>
        <Chip count={1}>На линии</Chip>
        <Chip icon="bell">Голосовое оповещение</Chip>
      </div>
    </>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { text: 'Администратор', kind: 'обычный', count: 4, countSolid: true },
  argTypes: {
    text: { name: 'Текст тега', control: 'text' },
    kind: { name: 'Вид тега', control: 'inline-radio', options: ['обычный', 'solid', 'ok', 'warn', 'crit'] },
    count: { name: 'Счётчик', control: { type: 'number', min: 0 } },
    countSolid: { name: 'Счётчик залитый', control: 'boolean' },
  },
  render: (a: Args) => (
    <div className="row">
      <Tag tone={a.kind === 'обычный' ? 'default' : a.kind}>{a.text}</Tag>
      <Count solid={a.countSolid}>{a.count}</Count>
      <Chip count={a.count}>{a.text}</Chip>
    </div>
  ),
};
