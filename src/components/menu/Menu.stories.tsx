import { Menu, Topbar, ThemeToggle, ThemeProvider, type IconName } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/18 · Меню аккаунта',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Имя и роль, пункты с иконками, разделитель, выход красным.' } } },
};

export const Default = {
  name: 'Меню аккаунта',
  render: () => (
    <div style={{ width: 260 }}>
      <Menu header={{ name: 'ОД', role: 'Администратор' }}>
        <Menu.Item icon="user">Профиль</Menu.Item>
        <Menu.Item icon="moon">Тёмная тема</Menu.Item>
        <Menu.Separator />
        <Menu.Item icon="power" danger>Выйти</Menu.Item>
      </Menu>
    </div>
  ),
};

export const WithTrigger = {
  name: 'С кнопкой в верхней панели',
  render: () => (
    <ThemeProvider><div style={{ minHeight: 280 }}>
      <Topbar brand={{ mark: 'П', name: 'Пульт' }} title="Объекты">
        <ThemeToggle />
        <Menu header={{ name: 'Ольга Денисова', role: 'Администратор' }} trigger={{ label: 'Меню аккаунта', initials: 'ОД' }} defaultOpen>
          <Menu.Item icon="user">Профиль</Menu.Item>
          <Menu.Item icon="key">Сменить пароль</Menu.Item>
          <Menu.Separator />
          <Menu.Item icon="power" danger>Выйти</Menu.Item>
        </Menu>
      </Topbar>
    </div></ThemeProvider>
  ),
};

const ICONS = ['user', 'moon', 'gear', 'key', 'help', 'bell', 'journal'];
export const Playground = {
  name: 'Песочница',
  args: { name: 'ОД', role: 'Администратор', items: 'user: Профиль\nmoon: Тёмная тема', danger: 'Выйти' },
  argTypes: {
    name: { name: 'Имя', control: 'text' },
    role: { name: 'Роль', control: 'text' },
    items: { name: `Пункты «иконка: текст», по строке (${ICONS.join(', ')})`, control: 'text' },
    danger: { name: 'Красный пункт внизу (пусто — нет)', control: 'text' },
  },
  render: (a: Args) => (
    <div style={{ width: 260 }}>
      <Menu header={a.name ? { name: a.name, role: a.role || undefined } : undefined}>
        {String(a.items).split('\n').filter(Boolean).map((r, i) => {
          const [ic, ...t] = r.split(':');
          return <Menu.Item key={i} icon={ic.trim() as IconName}>{t.join(':').trim()}</Menu.Item>;
        })}
        {a.danger && <Menu.Separator />}
        {a.danger && <Menu.Item icon="power" danger>{a.danger}</Menu.Item>}
      </Menu>
    </div>
  ),
};
