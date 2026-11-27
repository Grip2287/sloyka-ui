'use client';
import { cloneElement, isValidElement, useEffect, useId, useState, type ReactElement, type ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, checkChildren } from '../../core';

export interface TooltipProps {
  text: string;
  /** Управляемое состояние показа; без него подсказка появляется при наведении и фокусе. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function TooltipImpl({ text, open, defaultOpen, onOpenChange, children }: TooltipProps) {
  checkChildren(TooltipImpl as unknown as SloykaMarked, children);
  const id = useId();
  const [inner, setInner] = useState(Boolean(defaultOpen));
  const shown = open ?? inner;
  const set = (v: boolean) => { if (open === undefined) setInner(v); onOpenChange?.(v); };
  // Esc скрывает подсказку, не закрывая ничего другого (WCAG 1.4.13).
  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); set(false); } };
    // Фаза перехвата: срабатывает раньше обработчиков Shell и других, которые пропускают defaultPrevented.
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  });
  // Одиночный элемент получает связь сам; для остальных детей она остаётся на обёртке.
  // Компоненты Sloyka (Button и др.) не пробрасывают aria-*, поэтому для них связь остаётся на обёртке.
  const single = isValidElement(children) && typeof children.type === 'string' ? (children as ReactElement<{ 'aria-describedby'?: string }>) : null;
  const content = single && shown
    ? cloneElement(single, { 'aria-describedby': [single.props['aria-describedby'], id].filter(Boolean).join(' ') })
    : children;
  return (
    <span
      className="sl-tooltip-host" aria-describedby={shown && !single ? id : undefined}
      onMouseEnter={() => set(true)} onMouseLeave={() => set(false)} onFocus={() => set(true)} onBlur={() => set(false)}
    >
      {content}
      {shown && <span className="sl-tooltip" role="tooltip" id={id}>{text}</span>}
    </span>
  );
}
export const Tooltip = defineMeta(TooltipImpl, {
  n: '22', group: 'Уведомления и подсказка', name: 'Tooltip', allowed: 'any',
  props: {
    text: { type: 'string', required: true }, open: { type: 'boolean' }, defaultOpen: { type: 'boolean' },
    onOpenChange: { type: 'function' },
  },
});
