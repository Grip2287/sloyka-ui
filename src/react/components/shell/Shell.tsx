'use client';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, checkChildren } from '../../core';
import { ShellContext } from './context';

export interface ShellProps {
  /** `<Topbar>`: в него Shell сам добавляет кнопку меню для телефона. */
  topbar: ReactNode;
  /** `<Nav>`: на телефоне выезжает по кнопке, на планшете — рейл, на широком экране — полное. */
  nav: ReactNode;
  /** Меню телефона открыто (управляемое состояние). */
  navOpen?: boolean;
  defaultNavOpen?: boolean;
  onNavOpenChange?: (open: boolean) => void;
  /** Страница: Page и любые компоненты Sloyka. */
  children?: ReactNode;
}

const mark = (allowed: string[]) => ({ __sloyka: { n: '24', group: 'Боковое меню: полное и рейл', name: 'Shell', allowed, props: {} } }) as SloykaMarked;
const TOPBAR_CHECK = mark(['Topbar']);
const NAV_CHECK = mark(['Nav']);

function ShellImpl({ topbar, nav, navOpen, defaultNavOpen, onNavOpenChange, children }: ShellProps) {
  checkChildren(ShellImpl as unknown as SloykaMarked, children);
  checkChildren(TOPBAR_CHECK, topbar);
  checkChildren(NAV_CHECK, nav);
  const navId = useId();
  const [inner, setInner] = useState(Boolean(defaultNavOpen));
  const open = navOpen ?? inner;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const latest = useRef({ open, controlled: navOpen !== undefined, onNavOpenChange });
  latest.current = { open, controlled: navOpen !== undefined, onNavOpenChange };
  /** Фокус после смены состояния: внутрь меню при открытии, на кнопку при закрытии. */
  const pending = useRef<'in' | 'toggle' | null>(null);

  const set = useCallback((next: boolean) => {
    const cur = latest.current;
    if (cur.open === next) return;
    pending.current = next ? 'in' : 'toggle';
    if (!cur.controlled) setInner(next);
    cur.onNavOpenChange?.(next);
  }, []);
  const close = useCallback(() => set(false), [set]);
  const toggle = useCallback(() => set(!latest.current.open), [set]);

  useEffect(() => {
    const what = pending.current;
    pending.current = null;
    if (what === 'in' && open) rootRef.current?.querySelector<HTMLElement>('.sl-shell__nav .sl-nav__item')?.focus();
    else if (what === 'toggle' && !open) toggleRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // Esc не должен спорить с открытым модальным окном или чужим обработчиком.
      if (e.key !== 'Escape' || e.defaultPrevented || document.querySelector('dialog[open]')) return;
      close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const ctx = useMemo(() => ({ open, navId, toggleRef, toggle, close }), [open, navId, toggle, close]);
  return (
    <ShellContext.Provider value={ctx}>
      <div className="sl-shell" ref={rootRef} data-nav-open={open ? '' : undefined}>
        {topbar}
        {nav}
        <div className="sl-shell__backdrop" aria-hidden="true" onClick={close} />
        <main className="sl-shell__main">{children}</main>
      </div>
    </ShellContext.Provider>
  );
}
export const Shell = defineMeta(ShellImpl, {
  n: '24', group: 'Боковое меню: полное и рейл', name: 'Shell', allowed: 'any',
  props: {
    topbar: { type: 'ReactNode', required: true }, nav: { type: 'ReactNode', required: true },
    navOpen: { type: 'boolean' }, defaultNavOpen: { type: 'boolean' }, onNavOpenChange: { type: 'function' },
  },
});
