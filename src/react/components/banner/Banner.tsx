import { Children, type ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, pick, cx, checkChildren } from '../../core';
import { Icon } from '../../icons';

const TONES = ['ok', 'warn', 'crit'] as const;

export interface BannerProps {
  tone?: (typeof TONES)[number];
  title: string;
  /** Текст-пояснение или Banner.Item со своим действием. */
  children?: ReactNode;
}

function BannerImpl({ tone, title, children }: BannerProps) {
  checkChildren(BannerImpl as unknown as SloykaMarked, children);
  const t = pick('Banner', 'tone', tone, TONES, 'ok');
  return (
    <div className={cx('sl-banner', t !== 'ok' && `sl-banner--${t}`)} role={t === 'crit' ? 'alert' : 'status'}>
      <div className="sl-banner__title"><Icon name={t === 'ok' ? 'check' : 'alert'} />{title}</div>
      {Children.map(children, (c) =>
        typeof c === 'string' || typeof c === 'number' ? <div className="sl-banner__text">{c}</div> : c)}
    </div>
  );
}

const BannerBase = defineMeta(BannerImpl, {
  n: '09', group: 'Баннеры', name: 'Banner', allowed: ['Banner.Item', 'Button', 'Text', 'Stack'],
  props: { tone: { type: 'enum', options: TONES, default: 'ok' }, title: { type: 'string', required: true } },
});

export interface BannerItemProps {
  /** Кнопка действия справа. */
  action?: ReactNode;
  children?: ReactNode;
}

function BannerItemImpl({ action, children }: BannerItemProps) {
  checkChildren(BannerItemImpl as unknown as SloykaMarked, action);
  checkChildren(BannerItemImpl as unknown as SloykaMarked, children);
  return <div className="sl-banner__item"><span>{children}</span>{action}</div>;
}
const BannerItem = defineMeta(BannerItemImpl, {
  n: '09', group: 'Баннеры', name: 'Banner.Item', allowed: ['Button', 'Text', 'Link'],
  props: { action: { type: 'ReactNode' } },
});

export const Banner = Object.assign(BannerBase, { Item: BannerItem });
