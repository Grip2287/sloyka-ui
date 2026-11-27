import type { MouseEvent, ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, cx, checkChildren, renderLink, type LinkLike } from '../../core';
import { Icon, type IconName } from '../../icons';

export interface MenuProps {
  /** Шапка: имя и роль. */
  header?: { name: string; role?: string };
  children?: ReactNode;
}
function MenuImpl({ header, children }: MenuProps) {
  checkChildren(MenuImpl as unknown as SloykaMarked, children);
  return (
    <div className="sl-menu">
      {header && (
        <div className="sl-menu__head">
          <div className="sl-card__title">{header.name}</div>
          {header.role && <div className="sl-card__sub">{header.role}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
const MenuBase = defineMeta(MenuImpl, {
  n: '18', group: 'Меню аккаунта', name: 'Menu', allowed: ['Menu.Item', 'Menu.Separator'],
  props: { header: { type: '{ name, role? }' } },
});

export interface MenuItemProps {
  icon?: IconName;
  /** Опасное действие (например, «Выйти»): красный цвет. */
  danger?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Если задан, пункт — ссылка. */
  href?: string;
  linkAs?: LinkLike;
  children?: ReactNode;
}
function MenuItemImpl({ icon, danger, onClick, href, linkAs, children }: MenuItemProps) {
  checkChildren(MenuItemImpl as unknown as SloykaMarked, children);
  const className = cx('sl-menu__item', danger && 'sl-menu__item--danger');
  const inner = <>{icon && <Icon name={icon} />}{children}</>;
  if (href !== undefined) return <>{renderLink({ href, linkAs, className, children: inner })}</>;
  return <button type="button" className={className} onClick={onClick}>{inner}</button>;
}
const MenuItem = defineMeta(MenuItemImpl, {
  n: '18', group: 'Меню аккаунта', name: 'Menu.Item', allowed: 'none',
  props: {
    icon: { type: 'IconName' }, danger: { type: 'boolean' }, onClick: { type: 'function' },
    href: { type: 'string' }, linkAs: { type: 'component' },
  },
});

function MenuSeparatorImpl() {
  return <div className="sl-menu__sep" role="separator" />;
}
const MenuSeparator = defineMeta(MenuSeparatorImpl, {
  n: '18', group: 'Меню аккаунта', name: 'Menu.Separator', allowed: 'none', props: {},
});

export const Menu = Object.assign(MenuBase, { Item: MenuItem, Separator: MenuSeparator });
