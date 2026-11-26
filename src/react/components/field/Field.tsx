'use client';
import { useId, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react';
import { defineMeta, pick, warnOnce } from '../../core';
import { Icon } from '../../icons';
import { Button } from '../button/Button';

const TYPES = ['text', 'email', 'password', 'tel', 'number', 'url'] as const;

interface Chrome {
  /** Видимая подпись над полем. */
  label?: string;
  /** Пояснение под полем. */
  hint?: string;
  /** Текст ошибки: ставит aria-invalid и связывается с полем. */
  error?: string;
}

/** Идентификаторы и aria-атрибуты связи подписи, пояснения и ошибки с полем. */
function useAssoc(c: string, { label, hint, error }: Chrome, ariaLabel: string | undefined) {
  const base = useId();
  if (!label && !ariaLabel) warnOnce(c, 'name', 'нужен label или aria-label: без них у поля нет имени');
  const labelId = `${base}-label`;
  const hintId = `${base}-hint`;
  const errorId = `${base}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;
  return {
    labelId, hintId, errorId,
    aria: {
      'aria-labelledby': label ? labelId : undefined,
      'aria-label': label ? undefined : ariaLabel,
      'aria-describedby': describedBy,
      'aria-invalid': error ? (true as const) : undefined,
    },
  };
}

function Shell({ label, hint, error, ids, children }: Chrome & { ids: { labelId: string; hintId: string; errorId: string }; children: ReactNode }) {
  return (
    <label className="sl-field">
      {label && <span className="sl-label" id={ids.labelId}>{label}</span>}
      {children}
      {hint && <span className="sl-hint" id={ids.hintId}>{hint}</span>}
      {error && <span className="sl-error" id={ids.errorId}>{error}</span>}
    </label>
  );
}

export interface FieldProps extends Chrome {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: (typeof TYPES)[number];
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url' | 'search' | 'none';
  /** Имя поля, если нет видимой подписи. */
  'aria-label'?: string;
}

export const Field = defineMeta(function Field(p: FieldProps) {
  const assoc = useAssoc('Field', p, p['aria-label']);
  const type = pick('Field', 'type', p.type, TYPES, 'text');
  return (
    <Shell label={p.label} hint={p.hint} error={p.error} ids={assoc}>
      <input className="sl-input" name={p.name} value={p.value} defaultValue={p.defaultValue} placeholder={p.placeholder}
        type={type === 'text' ? undefined : type} required={p.required} disabled={p.disabled}
        autoComplete={p.autoComplete} inputMode={p.inputMode} {...assoc.aria}
        onChange={(e) => p.onChange?.(e.target.value, e)} />
    </Shell>
  );
}, {
  n: '02', group: 'Поля ввода', name: 'Field', allowed: 'none',
  props: {
    label: { type: 'string' }, hint: { type: 'string' }, error: { type: 'string' }, name: { type: 'string' },
    value: { type: 'string' }, defaultValue: { type: 'string' }, onChange: { type: 'function' }, placeholder: { type: 'string' },
    type: { type: 'enum', options: TYPES, default: 'text' }, required: { type: 'boolean' }, disabled: { type: 'boolean' },
    autoComplete: { type: 'string' }, inputMode: { type: 'string' }, 'aria-label': { type: 'string' },
  },
});

export interface SearchProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  /** По умолчанию «Поиск». */
  'aria-label'?: string;
}

export const Search = defineMeta(function Search(p: SearchProps) {
  return (
    <label className="sl-search">
      <Icon name="search" />
      <input className="sl-input" name={p.name} value={p.value} defaultValue={p.defaultValue} placeholder={p.placeholder}
        disabled={p.disabled} aria-label={p['aria-label'] ?? 'Поиск'} onChange={(e) => p.onChange?.(e.target.value, e)} />
    </label>
  );
}, {
  n: '02', group: 'Поля ввода', name: 'Search', allowed: 'none',
  props: {
    name: { type: 'string' }, value: { type: 'string' }, defaultValue: { type: 'string' }, onChange: { type: 'function' },
    placeholder: { type: 'string' }, disabled: { type: 'boolean' }, 'aria-label': { type: 'string', default: 'Поиск' },
  },
});

export interface SelectOption {
  value: string;
  label: string;
}
export interface SelectProps extends Chrome {
  options: SelectOption[];
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

export const Select = defineMeta(function Select(p: SelectProps) {
  const assoc = useAssoc('Select', p, p['aria-label']);
  const control = (
    <select className="sl-select" name={p.name} value={p.value} defaultValue={p.defaultValue} required={p.required}
      disabled={p.disabled} {...assoc.aria} onChange={(e) => p.onChange?.(e.target.value, e)}>
      {p.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
  if (!p.label && !p.hint && !p.error) return control;
  return <Shell label={p.label} hint={p.hint} error={p.error} ids={assoc}>{control}</Shell>;
}, {
  n: '02', group: 'Поля ввода', name: 'Select', allowed: 'none',
  props: {
    options: { type: '{ value: string; label: string }[]', required: true }, label: { type: 'string' }, hint: { type: 'string' },
    error: { type: 'string' }, name: { type: 'string' }, value: { type: 'string' }, defaultValue: { type: 'string' },
    onChange: { type: 'function' }, required: { type: 'boolean' }, disabled: { type: 'boolean' }, 'aria-label': { type: 'string' },
  },
});

export interface TextareaProps extends Chrome {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

export const Textarea = defineMeta(function Textarea(p: TextareaProps) {
  const assoc = useAssoc('Textarea', p, p['aria-label']);
  return (
    <Shell label={p.label} hint={p.hint} error={p.error} ids={assoc}>
      <textarea className="sl-textarea" name={p.name} value={p.value} defaultValue={p.defaultValue} placeholder={p.placeholder}
        required={p.required} disabled={p.disabled} {...assoc.aria} onChange={(e) => p.onChange?.(e.target.value, e)} />
    </Shell>
  );
}, {
  n: '02', group: 'Поля ввода', name: 'Textarea', allowed: 'none',
  props: {
    label: { type: 'string' }, hint: { type: 'string' }, error: { type: 'string' }, name: { type: 'string' },
    value: { type: 'string' }, defaultValue: { type: 'string' }, onChange: { type: 'function' }, placeholder: { type: 'string' },
    required: { type: 'boolean' }, disabled: { type: 'boolean' }, 'aria-label': { type: 'string' },
  },
});

export interface ComposeProps {
  /** Вызывается с текстом при нажатии кнопки или Enter; пустой текст не отправляется. */
  onSend: (value: string) => void;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Имя поля, по умолчанию «Сообщение». */
  'aria-label'?: string;
}

export const Compose = defineMeta(function Compose(p: ComposeProps) {
  const [inner, setInner] = useState(p.defaultValue ?? '');
  const controlled = p.value !== undefined;
  const current = controlled ? p.value! : inner;
  const send = () => {
    if (p.disabled || !current.trim()) return;
    p.onSend(current);
    if (!controlled) setInner('');
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
  };
  return (
    <div className="sl-compose">
      <input className="sl-input" name={p.name} value={current} placeholder={p.placeholder} disabled={p.disabled}
        aria-label={p['aria-label'] ?? 'Сообщение'} onKeyDown={onKey}
        onChange={(e) => { if (!controlled) setInner(e.target.value); p.onChange?.(e.target.value, e); }} />
      <Button variant="primary" iconOnly icon="arrow-right" type="button" disabled={p.disabled} aria-label="Отправить" onClick={send} />
    </div>
  );
}, {
  n: '02', group: 'Поля ввода', name: 'Compose', allowed: 'none',
  props: {
    onSend: { type: 'function', required: true }, name: { type: 'string' }, value: { type: 'string' }, defaultValue: { type: 'string' },
    onChange: { type: 'function' }, placeholder: { type: 'string' }, disabled: { type: 'boolean' },
    'aria-label': { type: 'string', default: 'Сообщение' },
  },
});
