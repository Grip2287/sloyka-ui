'use client';
import { createContext, useContext, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, pick, cx, checkChildren } from '../../core';

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  /** Получает значение выбранного сегмента. */
  onChange?: (value: string) => void;
  /** На всю ширину контейнера. */
  block?: boolean;
  /** Имя группы для скринридера. */
  'aria-label'?: string;
}

export const Segmented = defineMeta(function Segmented({ options, value, defaultValue, onChange, block, 'aria-label': label }: SegmentedProps) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? inner;
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const found = options.findIndex((o) => o.value === current);
  const active = found < 0 ? 0 : found;
  const select = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
    if (!step) return;
    e.preventDefault();
    const n = (i + step + options.length) % options.length;
    refs.current[n]?.focus();
    select(options[n].value);
  };
  return (
    <div className={cx('sl-segmented', block && 'sl-segmented--block')} role="group" aria-label={label}>
      {options.map((o, i) => (
        <button key={o.value} type="button" ref={(el) => { refs.current[i] = el; }} aria-pressed={i === found}
          tabIndex={i === active ? 0 : -1} onClick={() => select(o.value)} onKeyDown={(e) => onKey(e, i)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}, {
  n: '03', group: 'Переключатели', name: 'Segmented', allowed: 'none',
  props: {
    options: { type: '{ value: string; label: string }[]', required: true }, value: { type: 'string' },
    defaultValue: { type: 'string' }, onChange: { type: 'function' }, block: { type: 'boolean' }, 'aria-label': { type: 'string' },
  },
});

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  disabled?: boolean;
  children?: ReactNode;
}

function SwitchImpl({ checked, defaultChecked, onChange, name, disabled, children }: SwitchProps) {
  checkChildren(SwitchImpl as unknown as SloykaMarked, children);
  return (
    <label className="sl-switch">
      <input type="checkbox" role="switch" name={name} checked={checked} defaultChecked={defaultChecked} disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)} />
      {children}
    </label>
  );
}
export const Switch = defineMeta(SwitchImpl, {
  n: '03', group: 'Переключатели', name: 'Switch', allowed: 'none',
  props: {
    checked: { type: 'boolean' }, defaultChecked: { type: 'boolean' }, onChange: { type: 'function' },
    name: { type: 'string' }, disabled: { type: 'boolean' },
  },
});

export type CheckboxProps = SwitchProps;

function CheckboxImpl({ checked, defaultChecked, onChange, name, disabled, children }: CheckboxProps) {
  checkChildren(CheckboxImpl as unknown as SloykaMarked, children);
  return (
    <label className="sl-check">
      <input type="checkbox" name={name} checked={checked} defaultChecked={defaultChecked} disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)} />
      {children}
    </label>
  );
}
export const Checkbox = defineMeta(CheckboxImpl, {
  n: '03', group: 'Переключатели', name: 'Checkbox', allowed: 'none',
  props: {
    checked: { type: 'boolean' }, defaultChecked: { type: 'boolean' }, onChange: { type: 'function' },
    name: { type: 'string' }, disabled: { type: 'boolean' },
  },
});

interface GroupCtx {
  name: string;
  value: string | undefined;
  select: (v: string) => void;
}
const GroupContext = createContext<GroupCtx | null>(null);

export interface RadioProps {
  value: string;
  /** Вне RadioGroup: состояние самой кнопки. */
  checked?: boolean;
  defaultChecked?: boolean;
  /** Вне RadioGroup получает true при выборе; в группе значение приходит в onChange группы. */
  onChange?: (checked: boolean) => void;
  name?: string;
  disabled?: boolean;
  children?: ReactNode;
}

function RadioImpl({ value, checked, defaultChecked, onChange, name, disabled, children }: RadioProps) {
  checkChildren(RadioImpl as unknown as SloykaMarked, children);
  const group = useContext(GroupContext);
  const own = group
    ? { name: group.name, checked: group.value === value, onChange: () => { group.select(value); onChange?.(true); } }
    : { name, checked, defaultChecked, onChange: (e: { target: { checked: boolean } }) => onChange?.(e.target.checked) };
  return (
    <label className="sl-check">
      <input type="radio" value={value} disabled={disabled} {...own} />
      {children}
    </label>
  );
}
export const Radio = defineMeta(RadioImpl, {
  n: '03', group: 'Переключатели', name: 'Radio', allowed: 'none',
  props: {
    value: { type: 'string', required: true }, checked: { type: 'boolean' }, defaultChecked: { type: 'boolean' },
    onChange: { type: 'function' }, name: { type: 'string' }, disabled: { type: 'boolean' },
  },
});

const DIRS = ['column', 'row'] as const;

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  /** Получает значение выбранной кнопки. */
  onChange?: (value: string) => void;
  /** Общее имя кнопок; по умолчанию генерируется. */
  name?: string;
  direction?: (typeof DIRS)[number];
  /** Имя группы для скринридера. */
  'aria-label'?: string;
  children?: ReactNode;
}

function RadioGroupImpl({ value, defaultValue, onChange, name, direction, 'aria-label': label, children }: RadioGroupProps) {
  checkChildren(RadioGroupImpl as unknown as SloykaMarked, children);
  const d = pick('RadioGroup', 'direction', direction, DIRS, 'column');
  const generated = useId();
  const [inner, setInner] = useState(defaultValue);
  const ctx: GroupCtx = {
    name: name ?? generated,
    value: value ?? inner,
    select: (v) => { if (value === undefined) setInner(v); onChange?.(v); },
  };
  return (
    <GroupContext.Provider value={ctx}>
      <div className={cx('sl-radiogroup', d === 'row' && 'sl-radiogroup--row')} role="radiogroup" aria-label={label}>{children}</div>
    </GroupContext.Provider>
  );
}
export const RadioGroup = defineMeta(RadioGroupImpl, {
  n: '03', group: 'Переключатели', name: 'RadioGroup', allowed: ['Radio'],
  props: {
    value: { type: 'string' }, defaultValue: { type: 'string' }, onChange: { type: 'function' }, name: { type: 'string' },
    direction: { type: 'enum', options: DIRS, default: 'column' }, 'aria-label': { type: 'string' },
  },
});
