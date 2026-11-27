'use client';
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type MouseEvent, type ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, pick, cx, checkChildren } from '../../core';
import { Button } from '../button/Button';

const SIZES = ['sm', 'md', 'lg'] as const;

export interface ModalProps {
  title: string;
  /** Управляемое состояние: если задано, окно следует ему и просит закрыть через onOpenChange. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Низ окна: кнопки (Button, ButtonGroup). */
  footer?: ReactNode;
  size?: (typeof SIZES)[number];
  children?: ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const FOOTER_CHECK = { __sloyka: { n: '21', group: 'Модальное окно', name: 'Modal', allowed: ['Button', 'ButtonGroup'], props: {} } } as SloykaMarked;

function ModalImpl({ title, open, defaultOpen, onOpenChange, footer, size, children }: ModalProps) {
  checkChildren(ModalImpl as unknown as SloykaMarked, children);
  checkChildren(FOOTER_CHECK, footer);
  const sz = pick('Modal', 'size', size, SIZES, 'md');
  const titleId = useId();
  const [inner, setInner] = useState(Boolean(defaultOpen));
  const isOpen = open ?? inner;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const downOnBackdrop = useRef(false);
  const latest = useRef({ isOpen, onOpenChange, controlled: open !== undefined });
  latest.current = { isOpen, onOpenChange, controlled: open !== undefined };

  const request = useCallback((next: boolean) => {
    if (latest.current.controlled === false) setInner(next);
    latest.current.onOpenChange?.(next);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (isOpen && !d.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
      // Фокус внутрь: первое поле тела, иначе первый фокусируемый элемент окна, иначе само окно.
      const target = d.querySelector<HTMLElement>('[autofocus]')
        ?? d.querySelector('.sl-modal__body')?.querySelector<HTMLElement>(FOCUSABLE)
        ?? d.querySelector('.sl-modal__foot')?.querySelector<HTMLElement>(FOCUSABLE)
        ?? d.querySelector<HTMLElement>(FOCUSABLE);
      if (target) target.focus();
      else { d.tabIndex = -1; d.focus(); }
    } else if (!isOpen && d.open) {
      if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
      const back = opener.current;
      opener.current = null;
      if (back?.isConnected) back.focus();
    }
  }, [isOpen]);

  // Размонтирование открытого окна: вернуть фокус тому, кто его открыл.
  useEffect(() => () => {
    const back = opener.current;
    if (back?.isConnected) back.focus();
  }, []);

  const native = typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal === 'function';

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (native) return; // нативный диалог сам ловит Esc (событие cancel) и держит фокус внутри
    if (e.key === 'Escape') { e.preventDefault(); request(false); return; }
    if (e.key !== 'Tab') return;
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (items.length === 0) return;
    const first = items[0]!;
    const last = items[items.length - 1]!;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // Закрываем по фону, только если нажатие и началось, и закончилось на фоне:
  // иначе выделение текста в поле с отпусканием над фоном закрыло бы форму.
  const onPointerDown = (e: PointerEvent<HTMLDialogElement>) => { downOnBackdrop.current = e.target === e.currentTarget; };
  const onClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget && downOnBackdrop.current) request(false);
    downOnBackdrop.current = false;
  };

  return (
    <dialog
      ref={dialogRef} className={cx('sl-modal', sz !== 'md' && `sl-modal--${sz}`)} aria-labelledby={titleId}
      onKeyDown={onKeyDown} onPointerDown={onPointerDown} onClick={onClick}
      // Esc в нативном диалоге: не закрываем сами, а спрашиваем владельца состояния.
      onCancel={(e) => { e.preventDefault(); if (latest.current.isOpen) request(false); }}
      // Диалог закрыт снаружи (например, form method=dialog): синхронизируем состояние.
      onClose={(e) => { if (latest.current.isOpen && !e.currentTarget.open) request(false); }}
    >
      {isOpen && (
        <>
          <div className="sl-modal__head">
            <span className="sl-modal__title" id={titleId}>{title}</span>
            <Button variant="ghost" size="sm" iconOnly icon="x" aria-label="Закрыть" onClick={() => request(false)} />
          </div>
          <div className="sl-modal__body">{children}</div>
          {footer && <div className="sl-modal__foot">{footer}</div>}
        </>
      )}
    </dialog>
  );
}
export const Modal = defineMeta(ModalImpl, {
  n: '21', group: 'Модальное окно', name: 'Modal', allowed: 'any',
  props: {
    title: { type: 'string', required: true }, open: { type: 'boolean' }, defaultOpen: { type: 'boolean' },
    onOpenChange: { type: 'function' }, footer: { type: 'ReactNode' }, size: { type: 'enum', options: SIZES, default: 'md' },
  },
});
