import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { defineMeta, cx, pick } from '../../core';
import { Icon } from '../../icons';

const ALIGNS = ['left', 'right', 'center'] as const;
const WIDTHS = ['auto', 'min'] as const;

export interface TableColumn<Row> {
  key: string;
  title: string;
  align?: (typeof ALIGNS)[number];
  /** `min` — колонка по ширине содержимого (действия, иконки). */
  width?: (typeof WIDTHS)[number];
  /** Содержимое ячейки: текст или компонент (Status, Tag, Button). Без него показывается значение row[key]. */
  render?: (row: Row) => ReactNode;
}

export interface TableProps<Row> {
  columns: ReadonlyArray<TableColumn<Row>>;
  rows: ReadonlyArray<Row>;
  /** Поле строки или функция, дающая уникальный ключ. */
  rowKey: (keyof Row & string) | ((row: Row) => string | number);
  /** Что показать, если строк нет. */
  empty?: ReactNode;
  /** На телефоне строки превращаются в карточки (подписи берутся из заголовков). */
  stack?: boolean;
  onRowClick?: (row: Row) => void;
}

function colClass(c: TableColumn<unknown>): string | false {
  const a = pick('Table', 'align', c.align, ALIGNS, 'left');
  const w = pick('Table', 'width', c.width, WIDTHS, 'auto');
  const parts = cx(a === 'right' && 'sl-table__r', a === 'center' && 'sl-table__c', w === 'min' && 'sl-table__min');
  return parts || false;
}

function TableImpl<Row>({ columns, rows, rowKey, empty, stack = true, onRowClick }: TableProps<Row>) {
  const keyOf = (row: Row): string | number =>
    typeof rowKey === 'function' ? rowKey(row) : String((row as Record<string, unknown>)[rowKey]);
  const cell = (row: Row, c: TableColumn<Row>): ReactNode =>
    c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '');
  const onClickRow = (row: Row) => (e: MouseEvent<HTMLTableRowElement>) => {
    const hit = (e.target as Element).closest('button, a, input, select, textarea, [role="button"]');
    if (hit && hit !== e.currentTarget && e.currentTarget.contains(hit)) return;
    onRowClick?.(row);
  };
  const onKey = (row: Row) => (e: KeyboardEvent<HTMLTableRowElement>) => {
    if (e.target !== e.currentTarget) return; // клавиши внутри ячейки (кнопка, ссылка) — не наши
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRowClick?.(row);
    }
  };
  return (
    <div className="sl-table-wrap">
      <table className={cx('sl-table', stack && 'sl-table--stack')}>
        <thead>
          <tr>{columns.map((c) => <th key={c.key} className={colClass(c as TableColumn<unknown>) || undefined}>{c.title}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="sl-empty"><Icon name="pulse" />{empty ?? 'Нет данных'}</div>
              </td>
            </tr>
          ) : rows.map((row) => (
            <tr key={keyOf(row)} className={onRowClick ? 'sl-table__row--click' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? onClickRow(row) : undefined}
              onKeyDown={onRowClick ? onKey(row) : undefined}>
              {columns.map((c) => (
                <td key={c.key} data-label={stack ? c.title : undefined} className={colClass(c as TableColumn<unknown>) || undefined}>
                  {cell(row, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Table = defineMeta(TableImpl, {
  n: '13', group: 'Таблица', name: 'Table', allowed: 'none',
  props: {
    columns: { type: 'TableColumn[]', required: true }, rows: { type: 'object[]', required: true },
    rowKey: { type: 'string | function', required: true }, empty: { type: 'ReactNode' },
    stack: { type: 'boolean', default: true }, onRowClick: { type: 'function' },
  },
});
