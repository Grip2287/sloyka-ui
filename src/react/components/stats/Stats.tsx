import type { CSSProperties } from 'react';
import { defineMeta, pick } from '../../core';

const TONES = ['ok', 'warn', 'crit'] as const;

export interface StatItem {
  label: string;
  value: number | string;
  /** Цвет точки перед числом; без него — серая. */
  tone?: (typeof TONES)[number];
}
export interface StatsProps {
  items: ReadonlyArray<StatItem>;
}

export const Stats = defineMeta(function Stats({ items }: StatsProps) {
  return (
    <div className="sl-stats">
      {items.map((it, i) => {
        const tone = it.tone === undefined ? undefined : pick('Stats', 'tone', it.tone, TONES, 'ok');
        return (
          <div className="sl-stat" key={`${i}:${it.label}`}>
            <span className="sl-stat__value" style={tone ? ({ '--c': `var(--sl-${tone})` } as CSSProperties) : undefined}>{it.value}</span>
            <span className="sl-caps">{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}, {
  n: '10', group: 'Сводка цифрами', name: 'Stats', allowed: 'none',
  props: { items: { type: '{ label, value, tone? }[]', required: true } },
});
