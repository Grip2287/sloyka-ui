import type { ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, pick, cx, checkChildren } from '../../core';

const TONES = ['ok', 'warn', 'crit', 'off', 'hollow'] as const;
type Tone = (typeof TONES)[number];

export interface StatusProps {
  tone?: Tone;
  /** Обычное начертание вместо капса. */
  plain?: boolean;
  /** Пояснение серым после подписи. */
  note?: string;
  children?: ReactNode;
}

function StatusImpl({ tone, plain, note, children }: StatusProps) {
  checkChildren(StatusImpl as unknown as SloykaMarked, children);
  const t = pick('Status', 'tone', tone, TONES, 'off');
  return (
    <span className={cx('sl-status', t !== 'off' && `sl-status--${t}`, plain && 'sl-status--plain')}>
      {children}
      {note && <>{' '}<span className="sl-status__note">· {note}</span></>}
    </span>
  );
}
export const Status = defineMeta(StatusImpl, {
  n: '05', group: 'Статусы', name: 'Status', allowed: 'none',
  props: {
    tone: { type: 'enum', options: TONES, default: 'off' }, plain: { type: 'boolean' }, note: { type: 'string' },
  },
});

export interface StatusPillProps {
  tone?: Tone;
  children?: ReactNode;
}
function StatusPillImpl({ tone, children }: StatusPillProps) {
  checkChildren(StatusPillImpl as unknown as SloykaMarked, children);
  return <span className="sl-pill"><Status tone={tone}>{children}</Status></span>;
}
export const StatusPill = defineMeta(StatusPillImpl, {
  n: '05', group: 'Статусы', name: 'StatusPill', allowed: 'none',
  props: { tone: { type: 'enum', options: TONES, default: 'off' } },
});
