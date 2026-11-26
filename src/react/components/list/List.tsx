import type { KeyboardEvent, ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, checkChildren, renderLink, type LinkLike } from '../../core';
import { Icon } from '../../icons';

export interface ListProps {
  children?: ReactNode;
}

function ListImpl({ children }: ListProps) {
  checkChildren(ListImpl as unknown as SloykaMarked, children);
  return <div className="sl-list">{children}</div>;
}
export const List = defineMeta(ListImpl, {
  n: '11', group: 'Список с группами', name: 'List', allowed: ['Group', 'Row'],
  props: {},
});

export interface RowProps {
  title: string;
  /** Статус под названием: Status. */
  status?: ReactNode;
  /** Выбранная строка (инверсия). */
  current?: boolean;
  /** Стрелка справа у строк с подробностями. */
  chevron?: boolean;
  /** Строка-ссылка. */
  href?: string;
  linkAs?: LinkLike;
  onClick?: () => void;
}

function RowImpl({ title, status, current, chevron, href, linkAs, onClick }: RowProps) {
  checkChildren(RowImpl as unknown as SloykaMarked, status);
  const inner = (
    <>
      <div className="sl-row__main">
        <span className="sl-row__title">{title}</span>
        {status}
      </div>
      {chevron && <Icon name="chevron-right" />}
    </>
  );
  const cur = current ? 'true' : undefined;
  if (href !== undefined) {
    return <>{renderLink({ href, linkAs, className: 'sl-row', children: inner, aria: { 'aria-current': cur } })}</>;
  }
  if (onClick) {
    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };
    return <div className="sl-row" role="button" tabIndex={0} aria-current={cur} onClick={onClick} onKeyDown={onKey}>{inner}</div>;
  }
  return <div className="sl-row" aria-current={cur}>{inner}</div>;
}
export const Row = defineMeta(RowImpl, {
  n: '11', group: 'Список с группами', name: 'Row', allowed: ['Status', 'StatusPill'],
  props: {
    title: { type: 'string', required: true }, status: { type: 'ReactNode' }, current: { type: 'boolean' },
    chevron: { type: 'boolean' }, href: { type: 'string' }, linkAs: { type: 'component' }, onClick: { type: 'function' },
  },
});
