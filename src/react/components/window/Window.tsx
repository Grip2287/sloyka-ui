'use client';
import { useId, type ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, checkChildren } from '../../core';
import { Icon, type IconName } from '../../icons';
import { Button } from '../button/Button';

export interface WindowProps {
  title: string;
  icon?: IconName;
  /** Если задан, в шапке появляется кнопка «Закрыть». */
  onClose?: () => void;
  /** Полоса под шапкой: фильтры, счётчики, действия. */
  bar?: ReactNode;
  /** Низ окна: поле ввода (Compose) или кнопки. */
  footer?: ReactNode;
  children?: ReactNode;
}
function WindowImpl({ title, icon, onClose, bar, footer, children }: WindowProps) {
  checkChildren(WindowImpl as unknown as SloykaMarked, children);
  const id = useId();
  return (
    <section className="sl-window" aria-labelledby={id}>
      <div className="sl-window__head">
        {icon && <Icon name={icon} />}
        <span className="sl-window__title" id={id}>{title}</span>
        {onClose && <Button variant="ghost" size="sm" iconOnly icon="x" aria-label="Закрыть" onClick={() => onClose()} />}
      </div>
      {bar && <div className="sl-window__bar">{bar}</div>}
      <div className="sl-window__body">{children}</div>
      {footer && <div className="sl-window__foot">{footer}</div>}
    </section>
  );
}
export const Window = defineMeta(WindowImpl, {
  n: '20', group: 'Плавающее окно', name: 'Window', allowed: 'any',
  props: {
    title: { type: 'string', required: true }, icon: { type: 'IconName' }, onClose: { type: 'function' },
    bar: { type: 'ReactNode' }, footer: { type: 'ReactNode' },
  },
});
