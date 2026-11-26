import type { ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, pick, cx, checkChildren } from '../../core';
import { Icon, type IconName } from '../../icons';

const TONES = ['default', 'solid', 'ok', 'warn', 'crit'] as const;

export interface TagProps {
  tone?: (typeof TONES)[number];
  children?: ReactNode;
}

function TagImpl({ tone, children }: TagProps) {
  checkChildren(TagImpl as unknown as SloykaMarked, children);
  const t = pick('Tag', 'tone', tone, TONES, 'default');
  return <span className={cx('sl-tag', t !== 'default' && `sl-tag--${t}`)}>{children}</span>;
}
export const Tag = defineMeta(TagImpl, {
  n: '04', group: 'Теги и счётчики', name: 'Tag', allowed: 'none',
  props: { tone: { type: 'enum', options: TONES, default: 'default' } },
});

export interface CountProps {
  solid?: boolean;
  children?: ReactNode;
}
function CountImpl({ solid, children }: CountProps) {
  checkChildren(CountImpl as unknown as SloykaMarked, children);
  return <span className={cx('sl-count', solid && 'sl-count--solid')}>{children}</span>;
}
export const Count = defineMeta(CountImpl, {
  n: '04', group: 'Теги и счётчики', name: 'Count', allowed: 'none',
  props: { solid: { type: 'boolean' } },
});

export interface ChipProps {
  icon?: IconName;
  /** Число справа от подписи. */
  count?: number | string;
  children?: ReactNode;
}
function ChipImpl({ icon, count, children }: ChipProps) {
  checkChildren(ChipImpl as unknown as SloykaMarked, children);
  return (
    <span className="sl-chip">
      {icon && <Icon name={icon} />}
      {children}
      {count !== undefined && <>{' '}<Count>{count}</Count></>}
    </span>
  );
}
export const Chip = defineMeta(ChipImpl, {
  n: '04', group: 'Теги и счётчики', name: 'Chip', allowed: ['Count'],
  props: { icon: { type: 'IconName' }, count: { type: 'number' } },
});
