'use client';
import { useContext, type ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, checkChildren } from '../../core';
import { Icon } from '../../icons';
import { ShellContext } from '../shell/context';

export interface Brand {
  /** Знак в квадрате: одна-две буквы. */
  mark: string;
  name: string;
}

/** Внутренняя деталь: знак и название; нужна Topbar и Login. */
export function BrandView({ mark, name }: Brand) {
  return (
    <span className="sl-brand"><span className="sl-brand__mark">{mark}</span><span className="sl-brand__text">{name}</span></span>
  );
}

export interface TopbarProps {
  brand: Brand;
  /** Название раздела рядом с брендом. */
  title?: string;
  /** Действия справа: кнопки, ThemeToggle, Menu. */
  children?: ReactNode;
}

function TopbarImpl({ brand, title, children }: TopbarProps) {
  checkChildren(TopbarImpl as unknown as SloykaMarked, children);
  const shell = useContext(ShellContext);
  return (
    <header className="sl-topbar">
      {shell && (
        // Ссылка на меню: без JS открывает его через :target (как в 0.1.x), с JS — переключает состояние.
        <a
          ref={shell.toggleRef} href={`#${shell.navId}`} role="button" className="sl-btn sl-btn--icon sl-btn--ghost sl-shell__toggle"
          aria-label="Меню" aria-expanded={shell.open} aria-controls={shell.navId}
          onClick={(e) => { e.preventDefault(); shell.toggle(); }}
          onKeyDown={(e) => { if (e.key === ' ') { e.preventDefault(); shell.toggle(); } }}
        >
          <Icon name="menu" />
        </a>
      )}
      <BrandView {...brand} />
      {title && <><span className="sl-topbar__sep" aria-hidden="true" /><span className="sl-topbar__title">{title}</span></>}
      {children !== undefined && children !== null && <div className="sl-topbar__end">{children}</div>}
    </header>
  );
}
export const Topbar = defineMeta(TopbarImpl, {
  n: '16', group: 'Верхняя панель админки', name: 'Topbar', allowed: ['Button', 'ButtonGroup', 'ThemeToggle', 'Menu'],
  props: { brand: { type: '{ mark, name }', required: true }, title: { type: 'string' } },
});
