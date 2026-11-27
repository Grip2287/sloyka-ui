// Витрина вида для того, что в React существует только «вживую»:
// уведомление появляется через useToast, модальное окно — в верхнем слое страницы (<dialog>.showModal).
// Статичный снимок в ряд с другими примерами повторяет их разметку (сверяется тестом
// tests/unit/react/static-parity.test.tsx); живые версии — в историях «Live».
import { useId, type ReactNode } from 'react';
import { Button, Icon, type IconName } from '../src/react';

const TOAST_ICON: Record<'ok' | 'warn' | 'crit' | 'info', IconName> = { ok: 'check', warn: 'alert', crit: 'alert', info: 'info' };

/**
 * Та же разметка, что у уведомления из useToast(). `withClose={false}` — только для компактного примера панели
 * (sample.tsx, как в 0.1.x): у живого уведомления кнопка «Закрыть» есть всегда.
 */
export function StaticToast({ kind, title, text, withClose = true }: { kind: 'ok' | 'warn' | 'crit' | 'info'; title: string; text?: string; withClose?: boolean }) {
  return (
    <div className={`sl-toast sl-toast--${kind}`} role={kind === 'crit' ? 'alert' : 'status'}>
      <span className="sl-toast__icon"><Icon name={TOAST_ICON[kind]} /></span>
      <div className="sl-toast__body">
        {text
          ? <><span className="sl-toast__title">{title}</span><span className="sl-toast__text">{text}</span></>
          : <span className="sl-toast__title">{title}</span>}
      </div>
      {withClose && <Button variant="ghost" size="sm" iconOnly icon="x" type="button" aria-label="Закрыть" />}
    </div>
  );
}

/**
 * Окно на затемнении в потоке страницы. Разметка — как у открытого <Modal>, только вместо <dialog>
 * (открытый модально, он всегда уходит в верхний слой) — <div role="dialog">.
 */
export function StaticModal({ title, width = 420, footer, children }: { title: string; width?: number; footer?: ReactNode; children?: ReactNode }) {
  const titleId = useId();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `minmax(0,${width}px)`, justifyContent: 'center', padding: 28, borderRadius: 'var(--sl-r-lg)', background: 'var(--sl-backdrop)' }}>
      <div className="sl-modal" role="dialog" aria-labelledby={titleId}>
        <div className="sl-modal__head">
          <span className="sl-modal__title" id={titleId}>{title}</span>
          <Button variant="ghost" size="sm" iconOnly icon="x" type="button" aria-label="Закрыть" />
        </div>
        <div className="sl-modal__body">{children}</div>
        {footer && <div className="sl-modal__foot">{footer}</div>}
      </div>
    </div>
  );
}
