import type { MouseEvent, ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, checkChildren, renderLink, type LinkLike } from '../../core';

export interface PickerProps {
  /** Подпись над плитками. */
  title: string;
  children?: ReactNode;
}
function PickerImpl({ title, children }: PickerProps) {
  checkChildren(PickerImpl as unknown as SloykaMarked, children);
  return (
    <div className="sl-picker">
      <span className="sl-caps">{title}</span>
      <div className="sl-picker__grid">{children}</div>
    </div>
  );
}
const PickerBase = defineMeta(PickerImpl, {
  n: '19', group: 'Выбор из плиток', name: 'Picker', allowed: ['Tile'],
  props: { title: { type: 'string', required: true } },
});

export interface TileProps {
  /** Выбрана ли плитка (aria-pressed). Без значения плитка — просто кнопка. */
  selected?: boolean;
  disabled?: boolean;
  /** Пояснение мелким шрифтом под названием («В разработке»). */
  note?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  href?: string;
  linkAs?: LinkLike;
  children?: ReactNode;
}
function TileImpl({ selected, disabled, note, onClick, href, linkAs, children }: TileProps) {
  checkChildren(TileImpl as unknown as SloykaMarked, children);
  const inner = <>{children}{note && <small>{note}</small>}</>;
  if (href !== undefined) {
    if (disabled) {
      // Недоступная ссылка: без href не фокусируется и не переходит.
      return <a className="sl-tile" role="link" aria-disabled="true" tabIndex={-1}>{inner}</a>;
    }
    return <>{renderLink({
      href, linkAs, className: 'sl-tile', children: inner,
      aria: { 'aria-pressed': selected === undefined ? undefined : String(selected) },
    })}</>;
  }
  return (
    <button type="button" className="sl-tile" aria-pressed={selected} disabled={disabled || undefined} onClick={onClick}>
      {inner}
    </button>
  );
}
const Tile = defineMeta(TileImpl, {
  n: '19', group: 'Выбор из плиток', name: 'Tile', allowed: 'none',
  props: {
    selected: { type: 'boolean' }, disabled: { type: 'boolean' }, note: { type: 'string' }, onClick: { type: 'function' },
    href: { type: 'string' }, linkAs: { type: 'component' },
  },
});

export const Picker = Object.assign(PickerBase, { Tile });
export { Tile };
