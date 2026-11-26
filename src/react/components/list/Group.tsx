'use client';
import { useState, type ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, checkChildren } from '../../core';
import { Icon } from '../../icons';
import { Count } from '../tag/Tag';

export interface GroupProps {
  title: string;
  count?: number;
  defaultCollapsed?: boolean;
  /** Управляемое состояние: если задано, группа следует ему и сообщает о щелчке через onToggle. */
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  children?: ReactNode;
}

function GroupImpl({ title, count, defaultCollapsed, collapsed, onToggle, children }: GroupProps) {
  checkChildren(GroupImpl as unknown as SloykaMarked, children);
  const [inner, setInner] = useState(Boolean(defaultCollapsed));
  const isCollapsed = collapsed ?? inner;
  const toggle = () => {
    if (collapsed === undefined) setInner(!isCollapsed);
    onToggle?.(!isCollapsed);
  };
  return (
    <div className="sl-group" data-collapsed={isCollapsed ? '' : undefined}>
      <button className="sl-group__head" type="button" aria-expanded={!isCollapsed} onClick={toggle}>
        <Icon name="chevron-down" />
        {title}
        {count !== undefined && <Count solid={!isCollapsed}>{count}</Count>}
      </button>
      {children}
    </div>
  );
}
export const Group = defineMeta(GroupImpl, {
  n: '11', group: 'Список с группами', name: 'Group', allowed: ['Row'],
  props: {
    title: { type: 'string', required: true }, count: { type: 'number' },
    defaultCollapsed: { type: 'boolean' }, collapsed: { type: 'boolean' }, onToggle: { type: 'function' },
  },
});
