// Витрина вида для того, что в React существует только «вживую»:
// уведомление появляется через useToast, модальное окно — в верхнем слое страницы (<dialog>.showModal).
// Статичный снимок в ряд с другими примерами рисуется теми же классами Sloyka; живые версии — в историях «Live».
import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../src/react';
import { ICON_PATHS, type IconName } from '../src/react/icons';

const TOAST_ICON = { ok: 'check', warn: 'alert', crit: 'alert', info: 'info' } as const;

export function StaticToast({ kind, title, text, close }: { kind: 'ok' | 'warn' | 'crit' | 'info'; title: string; text?: string; close?: boolean }) {
  const icon: IconName = TOAST_ICON[kind];
  return (
    <div className="sl-toast" style={{ '--c': `var(--sl-${kind === 'info' ? 'text-2' : kind})` } as CSSProperties}>
      <svg className="sl-ic sl-toast__icon" viewBox="0 0 16 16" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICON_PATHS[icon] }} />
      <div className="sl-toast__body">
        <span className="sl-toast__title">{title}</span>
        {text && <span className="sl-toast__text">{text}</span>}
      </div>
      {close && <Button variant="ghost" size="sm" iconOnly icon="x" aria-label="Закрыть" />}
    </div>
  );
}

/** Окно на затемнении в потоке страницы (без верхнего слоя). */
export function StaticModal({ title, width = 420, footer, children }: { title: string; width?: number; footer: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `minmax(0,${width}px)`, justifyContent: 'center', padding: 28, borderRadius: 'var(--sl-r-lg)', background: 'var(--sl-backdrop)' }}>
      <div className="sl-modal" role="dialog" aria-label={title}>
        <div className="sl-modal__head">
          <span className="sl-modal__title">{title}</span>
          <Button variant="ghost" size="sm" iconOnly icon="x" aria-label="Закрыть" />
        </div>
        <div className="sl-modal__body">{children}</div>
        <div className="sl-modal__foot">{footer}</div>
      </div>
    </div>
  );
}
