import { Empty, Dropzone, Button, type IconName } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/14 · Пустое состояние и загрузка файла',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Пунктирная зона: что сделать и кнопка действия.' } } },
};

export const Default = {
  name: 'Пустое состояние и загрузка файла',
  render: () => (
    <Dropzone icon="upload" title="Карты не загружены"
      text="Загрузите файл карты (.mbtiles или .zip с плитками) — она появится без интернета."
      action={<Button variant="primary" icon="plus">Загрузить карту</Button>} />
  ),
};

const ICONS = ['upload', 'pulse', 'map', 'journal', 'users', 'bell', 'search'];
export const Playground = {
  name: 'Песочница',
  args: { icon: 'upload', title: 'Карты не загружены', text: 'Загрузите файл карты — она появится без интернета.', action: 'Загрузить карту', dropzone: true },
  argTypes: {
    icon: { name: 'Иконка', control: 'select', options: ICONS },
    title: { name: 'Заголовок', control: 'text' },
    text: { name: 'Текст', control: 'text' },
    action: { name: 'Кнопка (пусто — без неё)', control: 'text' },
    dropzone: { name: 'Пунктирная рамка', control: 'boolean' },
  },
  render: (a: Args) => {
    const View = a.dropzone ? Dropzone : Empty;
    return <View icon={a.icon as IconName} title={a.title} text={a.text || undefined}
      action={a.action ? <Button variant="primary" icon="plus">{a.action}</Button> : undefined} />;
  },
};

