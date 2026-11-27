import type { ReactNode } from 'react';
import { Topbar, Button } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/16 · Верхняя панель админки',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Знак продукта (заглушка), название раздела, справа переход, тема, аккаунт, выход.' } } },
};

/** Скругление рамки примера: в приложении панель идёт во всю ширину страницы. */
const Frame = ({ children }: { children: ReactNode }) => <div style={{ borderRadius: 'var(--sl-r-md)', overflow: 'hidden' }}>{children}</div>;

export const Default = {
  name: 'Верхняя панель админки',
  render: () => (
    <Frame>
      <Topbar brand={{ mark: 'S', name: 'SLOYKA' }} title="Панель администрирования">
        <Button size="sm" icon="arrow-left" hideLabelOnPhone>Мониторинг</Button>
        <Button size="sm" iconOnly icon="moon" aria-label="Тёмная тема" />
        <Button size="sm" icon="user" hideLabelOnPhone aria-label="ОД 12 — аккаунт">ОД 12</Button>
        <Button size="sm" iconOnly icon="power" variant="danger" aria-label="Выйти" />
      </Topbar>
    </Frame>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { mark: 'S', brand: 'SLOYKA', title: 'Панель администрирования', back: 'Мониторинг', user: 'ОД 12', theme: true, logout: true },
  argTypes: {
    mark: { name: 'Знак (1–2 буквы)', control: 'text' },
    brand: { name: 'Название продукта', control: 'text' },
    title: { name: 'Название раздела', control: 'text' },
    back: { name: 'Кнопка перехода (пусто — нет)', control: 'text' },
    user: { name: 'Пользователь', control: 'text' },
    theme: { name: 'Кнопка темы', control: 'boolean' },
    logout: { name: 'Кнопка выхода', control: 'boolean' },
  },
  render: (a: Args) => (
    <Frame>
      <Topbar brand={{ mark: a.mark, name: a.brand }} title={a.title || undefined}>
        {a.back && <Button size="sm" icon="arrow-left" hideLabelOnPhone>{a.back}</Button>}
        {a.theme && <Button size="sm" iconOnly icon="moon" aria-label="Тёмная тема" />}
        {a.user && <Button size="sm" icon="user" hideLabelOnPhone aria-label={`${a.user} — аккаунт`}>{a.user}</Button>}
        {a.logout && <Button size="sm" iconOnly icon="power" variant="danger" aria-label="Выйти" />}
      </Topbar>
    </Frame>
  ),
};
