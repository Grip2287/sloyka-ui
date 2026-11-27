import { Login } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/23 · Карточка входа',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Знак продукта (заглушка вместо логотипа), поля с подписями, кнопка, подпись внизу.' } } },
};

export const Default = {
  name: 'Карточка входа',
  render: () => <Login brand={{ mark: 'S', name: 'SLOYKA' }} footer="Название организации" onSubmit={() => {}} />,
};

export const Playground = {
  name: 'Песочница',
  args: { mark: 'S', brand: 'SLOYKA', userLabel: 'Имя пользователя', passLabel: 'Пароль', button: 'Войти', footer: 'Название организации', error: '' },
  argTypes: {
    mark: { name: 'Знак', control: 'text' },
    brand: { name: 'Название', control: 'text' },
    userLabel: { name: 'Подпись логина', control: 'text' },
    passLabel: { name: 'Подпись пароля', control: 'text' },
    button: { name: 'Текст кнопки', control: 'text' },
    footer: { name: 'Подпись внизу', control: 'text' },
    error: { name: 'Ошибка входа', control: 'text' },
  },
  render: (a: Args) => (
    <Login brand={{ mark: a.mark, name: a.brand }} userLabel={a.userLabel} passLabel={a.passLabel} button={a.button} footer={a.footer || undefined} error={a.error || undefined} onSubmit={() => {}} />
  ),
};
