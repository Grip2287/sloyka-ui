import type { SloykaMarked } from '../../core';
import { defineMeta, pick, checkChildren } from '../../core';
import { Icon, type IconName } from '../../icons';
import { Status } from '../status/Status';
import type { StatusProps } from '../status/Status';
import type { MouseEvent, ReactNode } from 'react';

export interface StatusBarItem {
  label: string;
  value: string;
}

export interface StatusBarProps {
  items: ReadonlyArray<StatusBarItem>;
  /** Состояние системы последней ячейкой: цветной статус. */
  system?: { tone: NonNullable<StatusProps['tone']>; text: string; label?: string };
}

function StatusBarImpl({ items, system }: StatusBarProps) {
  return (
    <div className="sl-statusbar">
      {items.map(({ label, value }) => (
        <div key={label}><span className="sl-caps">{label}</span><strong>{value}</strong></div>
      ))}
      {system && (
        <div><span className="sl-caps">{system.label ?? 'Система'}</span><Status tone={system.tone}>{system.text}</Status></div>
      )}
    </div>
  );
}
export const StatusBar = defineMeta(StatusBarImpl, {
  n: '17', group: 'Строка состояния и плавающие кнопки', name: 'StatusBar', allowed: 'none',
  props: { items: { type: '{ label, value }[]', required: true }, system: { type: '{ tone, text, label? }' } },
});

const CHEVRONS = ['up', 'down'] as const;
export interface DockButtonProps {
  icon?: IconName;
  /** Стрелка справа: куда раскроется панель. */
  chevron?: (typeof CHEVRONS)[number];
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}
function DockButtonImpl({ icon, chevron, onClick, children }: DockButtonProps) {
  checkChildren(DockButtonImpl as unknown as SloykaMarked, children);
  const c = chevron === undefined ? undefined : pick('DockButton', 'chevron', chevron, CHEVRONS, 'down');
  return (
    <button className="sl-dock-btn" type="button" onClick={onClick}>
      {icon && <Icon name={icon} />}
      {children}
      {c && <Icon name={c === 'up' ? 'chevron-up' : 'chevron-down'} />}
    </button>
  );
}
export const DockButton = defineMeta(DockButtonImpl, {
  n: '17', group: 'Строка состояния и плавающие кнопки', name: 'DockButton', allowed: 'none',
  props: { icon: { type: 'IconName' }, chevron: { type: 'enum', options: CHEVRONS }, onClick: { type: 'function' } },
});
