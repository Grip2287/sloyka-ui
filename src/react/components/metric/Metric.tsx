import { defineMeta } from '../../core';
import { Status } from '../status/Status';

export interface MetricProps {
  label: string;
  /** Нагрузка, 0–100; от 70 — «Повышенная», от 90 — «Критическая». */
  value: number;
  note?: string;
  unit?: string;
}

const fmt = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

export const Metric = defineMeta(function Metric({ label, value, note, unit = '%' }: MetricProps) {
  const lvl = value >= 90
    ? { tone: 'crit' as const, text: 'Критическая' }
    : value >= 70 ? { tone: 'warn' as const, text: 'Повышенная' } : { tone: 'off' as const, text: 'Умеренная' };
  const width = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="sl-card">
      <span className="sl-caps">{label}</span>
      <div className="sl-card__head">
        <span className="sl-metric__value">{fmt.format(value)}{unit}</span>
        <Status tone={lvl.tone} plain>{lvl.text}</Status>
      </div>
      <div className={lvl.tone === 'off' ? 'sl-progress' : `sl-progress sl-progress--${lvl.tone}`}
        role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={width}>
        <span style={{ width: `${width}%` }} />
      </div>
      {note && <span className="sl-hint">{note}</span>}
    </div>
  );
}, {
  n: '07', group: 'Карточка показателя', name: 'Metric', allowed: 'none',
  props: {
    label: { type: 'string', required: true }, value: { type: 'number', required: true },
    note: { type: 'string' }, unit: { type: 'string', default: '%' },
  },
});
