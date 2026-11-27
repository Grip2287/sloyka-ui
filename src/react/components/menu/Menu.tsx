'use client';
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, cx, checkChildren, renderLink, type LinkLike } from '../../core';
import { Icon, type IconName } from '../../icons';

export interface MenuTrigger {
  /** Подпись кнопки для экранных дикторов, например «Меню аккаунта». */
  label: string;
  /** Одна-две буквы на кнопке; без них — иконка пользователя. */
  initials?: string;
}

export interface MenuProps {
  /** Шапка: имя и роль. */
  header?: { name: string; role?: string };
  /** Кнопка, которая открывает меню. Без неё меню — просто панель. */
  trigger?: MenuTrigger;
  /** Управляемое состояние (только вместе с trigger). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function Panel({ header, children, id, popover, onClick }: { header?: MenuProps['header']; children?: ReactNode; id?: string; popover?: boolean; onClick?: (e: MouseEvent<HTMLDivElement>) => void }) {
  return (
    <div className={cx('sl-menu', popover && 'sl-menu--popover')} id={id} onClick={onClick}>
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

function MenuWithTrigger({ header, trigger, open, defaultOpen, onOpenChange, children }: MenuProps & { trigger: MenuTrigger }) {
  const [inner, setInner] = useState(defaultOpen ?? false);
  const isOpen = open ?? inner;
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const latest = useRef({ open, onOpenChange });
  latest.current = { open, onOpenChange };

  const request = (next: boolean) => {
    if (latest.current.open === undefined) setInner(next);
    latest.current.onOpenChange?.(next);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) request(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      request(false);
      button.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  // Клик по пункту (кнопке или ссылке) закрывает меню; обработчик самого пункта уже отработал.
  const onPanelClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.sl-menu__item')) request(false);
  };

  return (
    <div className="sl-menu-anchor" ref={root}>
      <button
        ref={button}
        type="button"
        className={cx('sl-btn', 'sl-menu__trigger', isOpen && 'is-open')}
        aria-label={trigger.label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={() => request(!isOpen)}
      >
        {trigger.initials
          ? <span className="sl-menu__initials" aria-hidden="true">{trigger.initials}</span>
          : <Icon name="user" />}
        <Icon name="chevron-down" />
      </button>
      {isOpen && <Panel header={header} id={id} popover onClick={onPanelClick}>{children}</Panel>}
    </div>
  );
}

function MenuImpl(props: MenuProps) {
  checkChildren(MenuImpl as unknown as SloykaMarked, props.children);
  if (props.trigger) return <MenuWithTrigger {...props} trigger={props.trigger} />;
  return <Panel header={props.header}>{props.children}</Panel>;
}
const MenuBase = defineMeta(MenuImpl, {
  n: '18', group: 'Меню аккаунта', name: 'Menu', allowed: ['Menu.Item', 'Menu.Separator'],
  props: {
    header: { type: '{ name, role? }' },
    trigger: { type: '{ label, initials? }', description: 'Кнопка, открывающая меню' },
    open: { type: 'boolean' },
    defaultOpen: { type: 'boolean' },
    onOpenChange: { type: 'function' },
  },
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
