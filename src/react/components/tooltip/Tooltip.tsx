'use client';
import { useEffect, useId, useState, type ReactNode } from 'react';
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
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') set(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });
  return (
    <span
      className="sl-tooltip-host" aria-describedby={shown ? id : undefined}
      onMouseEnter={() => set(true)} onMouseLeave={() => set(false)} onFocus={() => set(true)} onBlur={() => set(false)}
    >
      {children}
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
