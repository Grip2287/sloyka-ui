'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { defineMeta } from '../../core';
import { Icon, type IconName } from '../../icons';
import { Button } from '../button/Button';

type Kind = 'ok' | 'warn' | 'crit' | 'info';
const ICON: Record<Kind, IconName> = { ok: 'check', warn: 'alert', crit: 'alert', info: 'info' };

export interface ToastOptions {
  title?: string;
  /** Сколько миллисекунд показывать. По умолчанию 5000; у crit — не скрывать (0). */
  duration?: number;
}
export interface ToastHandle {
  close: () => void;
}
type Show = (text: string, options?: ToastOptions) => ToastHandle;
export interface Toaster {
  ok: Show;
  warn: Show;
  crit: Show;
  info: Show;
}

interface Item {
  id: number;
  kind: Kind;
  text: string;
  title?: string;
  duration: number;
}

const ToastContext = createContext<Toaster | null>(null);

/** Хук: `const toast = useToast(); toast.ok('Готово')`. Работает внутри <ToastProvider>. */
export function useToast(): Toaster {
  const toaster = useContext(ToastContext);
  if (!toaster) throw new Error('Sloyka · useToast: оберните приложение в <ToastProvider>');
  return toaster;
}

export interface ToastProviderProps {
  children?: ReactNode;
}

function ToastProviderImpl({ children }: ToastProviderProps) {
  const [items, setItems] = useState<Item[]>([]);
  const nextId = useRef(0);
  const remove = useCallback((id: number) => setItems((list) => list.filter((i) => i.id !== id)), []);
  const toaster = useMemo<Toaster>(() => {
    const make = (kind: Kind): Show => (text, options = {}) => {
      const id = ++nextId.current;
      const duration = options.duration ?? (kind === 'crit' ? 0 : 5000);
      setItems((list) => [...list, { id, kind, text, title: options.title, duration }]);
      return { close: () => remove(id) };
    };
    return { ok: make('ok'), warn: make('warn'), crit: make('crit'), info: make('info') };
  }, [remove]);
  return (
    <ToastContext.Provider value={toaster}>
      {children}
      <div className="sl-toast-region" aria-live="polite">
        {items.map((item) => <ToastItem key={item.id} item={item} onClose={() => remove(item.id)} />)}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ item, onClose }: { item: Item; onClose: () => void }) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (item.duration <= 0) return;
    const t = setTimeout(() => close.current(), item.duration);
    return () => clearTimeout(t);
  }, [item.duration]);
  return (
    <div className={`sl-toast sl-toast--${item.kind}`} role={item.kind === 'crit' ? 'alert' : 'status'}>
      <span className="sl-toast__icon"><Icon name={ICON[item.kind]} /></span>
      <div className="sl-toast__body">
        {item.title
          ? <><span className="sl-toast__title">{item.title}</span><span className="sl-toast__text">{item.text}</span></>
          : <span className="sl-toast__title">{item.text}</span>}
      </div>
      <Button variant="ghost" size="sm" iconOnly icon="x" aria-label="Закрыть" onClick={onClose} />
    </div>
  );
}

export const ToastProvider = defineMeta(ToastProviderImpl, {
  n: '22', group: 'Уведомления и подсказка', name: 'ToastProvider', allowed: 'any', props: {},
});
