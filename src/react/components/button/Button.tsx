'use client';
import type { MouseEvent, ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, pick, cx, checkChildren, warnOnce, renderLink, type LinkLike } from '../../core';
import { Icon, type IconName } from '../../icons';

const VARIANTS = ['primary', 'default', 'ghost', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const TYPES = ['button', 'submit', 'reset'] as const;

interface ButtonCommon {
  variant?: (typeof VARIANTS)[number];
  size?: (typeof SIZES)[number];
  caps?: boolean;
  /** На всю ширину контейнера. */
  block?: boolean;
  /** Идёт операция: aria-busy, кнопка недоступна. */
  busy?: boolean;
  disabled?: boolean;
  type?: (typeof TYPES)[number];
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Если задан, вместо <button> рисуется ссылка с тем же видом. */
  href?: string;
  linkAs?: LinkLike;
  external?: boolean;
}

export type ButtonProps = ButtonCommon &
  (
    | {
        iconOnly?: false; icon?: IconName; 'aria-label'?: string; children?: ReactNode;
        /** На телефоне (до 767 px) видна только иконка, подпись прячется; имя кнопки для скринридера остаётся. */
        hideLabelOnPhone?: boolean;
      }
    | {
        iconOnly: true;
        icon: IconName;
        /** Обязателен: у кнопки без текста нет другого имени. */
        'aria-label': string;
        children?: never;
        hideLabelOnPhone?: never;
      }
  );

function ButtonImpl(props: ButtonProps) {
  const { variant, size, caps, block, busy, disabled, type, onClick, href, linkAs, external, iconOnly, icon, children } = props;
  const hideLabel = !iconOnly && props.hideLabelOnPhone === true;
  // Подпись на телефоне скрыта (display: none) — имя кнопки берём из неё, если не задано своё.
  const label = props['aria-label']
    ?? (hideLabel && (typeof children === 'string' || typeof children === 'number') ? String(children) : undefined);
  checkChildren(ButtonImpl as unknown as SloykaMarked, children);
  const v = pick('Button', 'variant', variant, VARIANTS, 'default');
  const s = pick('Button', 'size', size, SIZES, 'md');
  const t = pick('Button', 'type', type, TYPES, 'button');
  if (iconOnly && !label) {
    warnOnce('Button', 'aria-label', 'у кнопки iconOnly нужен aria-label: без него у кнопки нет имени для скринридера');
  }
  const className = cx(
    'sl-btn', v !== 'default' && `sl-btn--${v}`, s !== 'md' && `sl-btn--${s}`,
    caps && 'sl-btn--caps', block && 'sl-btn--block', iconOnly && 'sl-btn--icon',
  );
  const inner = (
    <>
      {icon && <Icon name={icon} />}
      {!iconOnly && (hideLabel ? <span className="sl-hide-sm">{children}</span> : children)}
    </>
  );
  const off = Boolean(disabled || busy);
  if (href !== undefined && off) {
    // Недоступная ссылка: без href она не фокусируется и не переходит по Enter.
    return (
      <a className={className} role="link" aria-disabled="true" aria-busy={busy ? 'true' : undefined} aria-label={label} tabIndex={-1}>
        {inner}
      </a>
    );
  }
  if (href !== undefined) {
    return <>{renderLink({
      href, linkAs, external, className, children: inner,
      aria: { 'aria-label': label },
    })}</>;
  }
  return (
    <button className={className} type={type === undefined ? undefined : t} disabled={off || undefined}
      aria-busy={busy ? 'true' : undefined} aria-label={label} onClick={onClick}>
      {inner}
    </button>
  );
}

export const Button = defineMeta(ButtonImpl, {
  n: '01', group: 'Кнопки', name: 'Button', allowed: 'none',
  props: {
    variant: { type: 'enum', options: VARIANTS, default: 'default' },
    size: { type: 'enum', options: SIZES, default: 'md' },
    icon: { type: 'IconName' }, iconOnly: { type: 'boolean' }, caps: { type: 'boolean' }, block: { type: 'boolean' },
    busy: { type: 'boolean' }, disabled: { type: 'boolean' }, type: { type: 'enum', options: TYPES },
    onClick: { type: 'function' }, href: { type: 'string' }, linkAs: { type: 'component' }, external: { type: 'boolean' },
    'aria-label': { type: 'string', description: 'Обязателен при iconOnly' },
    hideLabelOnPhone: { type: 'boolean', description: 'На телефоне видна только иконка' },
  },
});

const DIRS = ['column', 'row'] as const;
export interface ButtonGroupProps {
  direction?: (typeof DIRS)[number];
  children?: ReactNode;
}

function ButtonGroupImpl({ direction, children }: ButtonGroupProps) {
  checkChildren(ButtonGroupImpl as unknown as SloykaMarked, children);
  const d = pick('ButtonGroup', 'direction', direction, DIRS, 'column');
  return <div className={cx('sl-btn-group', d === 'row' && 'sl-btn-group--row')}>{children}</div>;
}

export const ButtonGroup = defineMeta(ButtonGroupImpl, {
  n: '01', group: 'Кнопки', name: 'ButtonGroup', allowed: ['Button'],
  props: { direction: { type: 'enum', options: DIRS, default: 'column' } },
});
