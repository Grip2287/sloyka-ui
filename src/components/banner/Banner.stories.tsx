import { Banner, Button } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/09 · Баннеры',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Сообщение о состоянии раздела: штатно, предупреждение со списком причин и действиями, ошибка.' } } },
};

export const Default = {
  name: 'Баннеры',
  render: () => (
    <>
      <Banner title="Система работает штатно">Обновлено в 11:04:59</Banner>
      <Banner tone="warn" title="План строится, но без части рекомендаций">
        <Banner.Item action={<Button size="sm">Подключить группу</Button>}>Группа «Дежурные силы» не подключена к оповещению</Banner.Item>
        <Banner.Item action={<Button size="sm">Открыть карту</Button>}>Периметр объекта не нанесён на карту</Banner.Item>
      </Banner>
      <Banner tone="crit" title="Сценарии недоступны">Причина: устройства не привязаны к периметру объекта.</Banner>
    </>
  ),
};

const PLAYGROUND_ARG_TYPES = {
  kind: { name: 'Вид', control: 'inline-radio', options: ['ok', 'warn', 'crit'] },
  title: { name: 'Заголовок', control: 'text' },
  text: { name: 'Текст', control: 'text' },
  action: { name: 'Кнопка (пусто — без неё)', control: 'text' },
};
const renderPlayground = (a: Args) => (
  <Banner tone={a.kind} title={a.title}>
    {a.action
      ? <Banner.Item action={<Button size="sm">{a.action}</Button>}>{a.text}</Banner.Item>
      : a.text}
  </Banner>
);

export const Playground = {
  name: 'Песочница',
  args: { kind: 'warn', title: 'План строится, но без части рекомендаций', text: 'Группа «Дежурные силы» не подключена к оповещению', action: 'Подключить группу' },
  argTypes: PLAYGROUND_ARG_TYPES,
  render: renderPlayground,
};

export const Test = {
  name: 'Песочница',
  args: { kind: 'crit', title: 'План строится, но без части рекомендаций', text: 'Группа «Дежурные силы» не подключена к оповещению', action: 'Подключить группу' },
  argTypes: PLAYGROUND_ARG_TYPES,
  render: renderPlayground,
};
