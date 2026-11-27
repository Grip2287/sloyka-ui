'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, cx, checkChildren, renderLink, type LinkLike } from '../../core';
import { Icon, type IconName } from '../../icons';
import { Count } from '../tag/Tag';
import { ShellContext } from '../shell/context';

const CurrentContext = createContext<string | undefined>(undefined);

export interface NavProps {
  /** Текущий пункт: его href или id. Совпавший пункт получает aria-current="page". */
  current?: string;
  /** Узкий вид «рейл»: иконка и подпись столбиком. */
  rail?: boolean;
  'aria-label'?: string;
  children?: ReactNode;
}

function NavImpl({ current, rail, 'aria-label': label, children }: NavProps) {
  checkChildren(NavImpl as unknown as SloykaMarked, children);
  const shell = useContext(ShellContext);
  return (
    <nav
      className={cx('sl-nav', rail && 'sl-nav--rail', shell && 'sl-shell__nav')} id={shell?.navId}
      aria-label={label ?? 'Разделы'}
      // Выбор пункта закрывает меню телефона (делегирование: пункт может быть ссылкой роутера).
      onClick={shell ? (e) => { if (shell.open && (e.target as Element).closest('.sl-nav__item')) shell.close(); } : undefined}
    >
      <CurrentContext.Provider value={current}>{children}</CurrentContext.Provider>
    </nav>
  );
}
const NavBase = defineMeta(NavImpl, {
  n: '24', group: 'Боковое меню: полное и рейл', name: 'Nav', allowed: ['Nav.Section', 'Nav.Item'],
  props: { current: { type: 'string' }, rail: { type: 'boolean' }, 'aria-label': { type: 'string', default: 'Разделы' } },
});

export interface NavSectionProps {
  title: string;
}
function NavSectionImpl({ title }: NavSectionProps) {
  return <div className="sl-nav__section sl-caps">{title}</div>;
}
const NavSection = defineMeta(NavSectionImpl, {
  n: '24', group: 'Боковое меню: полное и рейл', name: 'Nav.Section', allowed: 'none',
  props: { title: { type: 'string', required: true } },
});

export interface NavItemProps {
  icon: IconName;
  href: string;
  /** Идентификатор для сравнения с `current`, если href совпадать не должен. Атрибутом не выводится. */
  id?: string;
  linkAs?: LinkLike;
  /** Число справа от подписи (например, непрочитанное). */
  count?: number | string;
  /** Подпись пункта. */
  children?: ReactNode;
}
function NavItemImpl({ icon, href, id, linkAs, count, children }: NavItemProps) {
  checkChildren(NavItemImpl as unknown as SloykaMarked, children);
  const current = useContext(CurrentContext);
  const isCurrent = current !== undefined && (current === href || current === id);
  return <>{renderLink({
    href, linkAs, className: 'sl-nav__item',
    aria: { 'aria-current': isCurrent ? 'page' : undefined },
    children: (
      <>
        <Icon name={icon} />
        <span className="sl-nav__label">{children}</span>
        {count !== undefined && <Count solid>{count}</Count>}
      </>
    ),
  })}</>;
}
const NavItem = defineMeta(NavItemImpl, {
  n: '24', group: 'Боковое меню: полное и рейл', name: 'Nav.Item', allowed: 'none',
  props: {
    icon: { type: 'IconName', required: true }, href: { type: 'string', required: true }, id: { type: 'string' },
    linkAs: { type: 'component' }, count: { type: 'number | string' },
  },
});

export const Nav = Object.assign(NavBase, { Section: NavSection, Item: NavItem });
