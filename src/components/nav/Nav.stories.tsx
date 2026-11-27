import type { ReactNode } from 'react';
import { Nav, type IconName } from '../../react';
import { DemoNav } from '../../../.storybook/nav-data';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/24 · Боковое меню: полное и рейл',
  tags: ['autodocs', 'progressive', 'ref-base'],
  parameters: { docs: { description: { component: 'Одно и то же меню. Слева полное (широкие экраны), справа узкий рейл с иконками и подписями (планшет). На телефоне выезжает по кнопке — см. отдельные скриншоты shell-*.' } }, progressiveText: ['Пользователи', 'Устройства'] },
};

/** Скругление рамки примера: в приложении меню прижато к краю страницы. */
const Frame = ({ children }: { children: ReactNode }) => <div style={{ display: 'flex', borderRadius: 'var(--sl-r-lg)', overflow: 'hidden' }}>{children}</div>;

export const Default = {
  name: 'Боковое меню: полное и рейл',
  render: () => (
    <div className="row" style={{ alignItems: 'stretch', gap: 16 }}>
      <Frame><DemoNav /></Frame>
      <Frame><DemoNav rail /></Frame>
    </div>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { mode: 'полное', items: 'Управление\nusers: Пользователи\nlogin: Журнал входов\nИнтеграции\nplug: Устройства\nmap: Карты\npulse: Логи системы | 3', current: 'Устройства' },
  argTypes: {
    mode: { name: 'Вид меню', control: 'inline-radio', options: ['полное', 'рейл'] },
    items: { name: 'Строки: раздел, или «иконка: пункт | счётчик»', control: 'text' },
    current: { name: 'Текущий пункт', control: 'text' },
  },
  render: (a: Args) => (
    <Frame>
      <Nav rail={a.mode === 'рейл'} current={a.current}>
        {String(a.items).split('\n').filter(Boolean).map((r, i) => {
          if (!r.includes(':')) return <Nav.Section key={i} title={r.trim()} />;
          const icon = r.slice(0, r.indexOf(':')).trim() as IconName;
          const [label, n] = r.slice(r.indexOf(':') + 1).split('|').map((s) => s.trim());
          return <Nav.Item key={i} id={label} icon={icon} href="#" count={n || undefined}>{label}</Nav.Item>;
        })}
      </Nav>
    </Frame>
  ),
};
