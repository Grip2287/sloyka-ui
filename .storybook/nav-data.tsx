// Структура бокового меню для прототипа (разделы как в админке, без названий исходной системы).
import { Fragment } from 'react';
import { Nav, type IconName } from '../src/react';

type NavRow = [id: string, icon: IconName, label: string, count?: number];
export const SL_NAV: [section: string, items: NavRow[]][] = [
  ['Управление', [['users', 'users', 'Пользователи'], ['login', 'login', 'Журнал входов'], ['journal', 'journal', 'Журнал событий']]],
  ['Система', [['state', 'server', 'Состояние системы'], ['logs', 'pulse', 'Логи системы', 3]]],
  ['Интеграции', [['devices', 'plug', 'Устройства'], ['agents', 'key', 'Агенты'], ['maps', 'map', 'Карты'], ['notify', 'phone', 'Оповещение']]],
  ['Реагирование', [['plan', 'shield', 'План действий'], ['train', 'target', 'Тренировки']]],
  ['Справка', [['help', 'help', 'Помощь']]],
];

/** Меню прототипа; текущий раздел — «Устройства». */
export function DemoNav({ rail, current = 'devices' }: { rail?: boolean; current?: string }) {
  return (
    <Nav rail={rail} current={current}>
      {SL_NAV.map(([sec, items]) => (
        <Fragment key={sec}>
          <Nav.Section title={sec} />
          {items.map(([id, icon, label, n]) => (
            <Nav.Item key={id} id={id} icon={icon} href={`#${id}`} count={n}>{label}</Nav.Item>
          ))}
        </Fragment>
      ))}
    </Nav>
  );
}
