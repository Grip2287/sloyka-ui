import type { ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, pick, checkChildren, cx } from '../../core';

const GAPS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
type Gap = (typeof GAPS)[number];
const GAP_STR = GAPS.map(String);
const gapOf = (c: string, v: unknown, d: Gap): Gap =>
  Number(pick(c, 'gap', v === undefined ? undefined : String(v), GAP_STR, String(d))) as Gap;

const DIRS = ['column', 'row'] as const;
const ALIGNS = ['start', 'center', 'end', 'stretch'] as const;
const JUSTIFIES = ['start', 'center', 'end', 'between'] as const;

export interface StackProps {
  gap?: Gap;
  direction?: (typeof DIRS)[number];
  align?: (typeof ALIGNS)[number];
  justify?: (typeof JUSTIFIES)[number];
  wrap?: boolean;
  children?: ReactNode;
}

function StackImpl({ gap, direction, align, justify, wrap, children }: StackProps) {
  checkChildren(StackImpl as unknown as SloykaMarked, children);
  const g = gapOf('Stack', gap, 3);
  const d = pick('Stack', 'direction', direction, DIRS, 'column');
  const a = pick('Stack', 'align', align, ALIGNS, 'stretch');
  const j = pick('Stack', 'justify', justify, JUSTIFIES, 'start');
  return (
    <div className={cx('sl-stack', `sl-stack--gap-${g}`, d === 'row' && 'sl-stack--row', `sl-stack--a-${a}`, `sl-stack--j-${j}`, wrap && 'sl-stack--wrap')}>
      {children}
    </div>
  );
}
export const Stack = defineMeta(StackImpl, {
  n: '00', group: 'Основа', name: 'Stack', allowed: 'any',
  props: {
    gap: { type: 'enum', options: GAP_STR, default: 3 },
    direction: { type: 'enum', options: DIRS, default: 'column' },
    align: { type: 'enum', options: ALIGNS, default: 'stretch' },
    justify: { type: 'enum', options: JUSTIFIES, default: 'start' },
    wrap: { type: 'boolean' },
  },
});

const COLS = ['1', '2', '3', '4', 'auto'] as const;
const MINS = ['sm', 'md', 'lg'] as const;

export interface GridProps {
  columns?: 1 | 2 | 3 | 4 | 'auto';
  /** Минимальная ширина колонки при columns="auto": 200/280/360px. */
  min?: (typeof MINS)[number];
  gap?: Gap;
  children?: ReactNode;
}

/** Базовый `.sl-grid` совпадает с auto-md старого Storybook; модификаторы только переопределяют колонки и gap. */
function GridImpl({ columns, min, gap, children }: GridProps) {
  checkChildren(GridImpl as unknown as SloykaMarked, children);
  const c = pick('Grid', 'columns', columns === undefined ? undefined : String(columns), COLS, 'auto');
  const m = pick('Grid', 'min', min, MINS, 'md');
  const g = gapOf('Grid', gap, 3);
  return (
    <div className={cx('sl-grid', c === 'auto' ? `sl-grid--auto-${m}` : `sl-grid--cols-${c}`, `sl-grid--gap-${g}`)}>
      {children}
    </div>
  );
}
export const Grid = defineMeta(GridImpl, {
  n: '00', group: 'Основа', name: 'Grid', allowed: 'any',
  props: {
    columns: { type: 'enum', options: COLS, default: 'auto' },
    min: { type: 'enum', options: MINS, default: 'md' },
    gap: { type: 'enum', options: GAP_STR, default: 3 },
  },
});

const WIDTHS = ['narrow', 'default', 'wide', 'full'] as const;

export interface PageProps {
  width?: (typeof WIDTHS)[number];
  children?: ReactNode;
}

function PageImpl({ width, children }: PageProps) {
  checkChildren(PageImpl as unknown as SloykaMarked, children);
  const w = pick('Page', 'width', width, WIDTHS, 'default');
  return <div className={cx('sl-rpage', `sl-rpage--${w}`)}>{children}</div>;
}
export const Page = defineMeta(PageImpl, {
  n: '00', group: 'Основа', name: 'Page', allowed: 'any',
  props: { width: { type: 'enum', options: WIDTHS, default: 'default' } },
});
