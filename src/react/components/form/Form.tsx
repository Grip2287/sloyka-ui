'use client';
import type { FormEvent, ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, pick, checkChildren } from '../../core';

const METHODS = ['get', 'post'] as const;

export interface FormProps {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  action?: string;
  method?: (typeof METHODS)[number];
  children?: ReactNode;
}

function FormImpl({ onSubmit, action, method, children }: FormProps) {
  checkChildren(FormImpl as unknown as SloykaMarked, children);
  const m = pick('Form', 'method', method, METHODS, 'get');
  const handle = (e: FormEvent<HTMLFormElement>) => {
    if (!action) e.preventDefault();
    onSubmit?.(e);
  };
  return (
    <form className="sl-form" action={action} method={action ? m : undefined} onSubmit={handle}>
      {children}
    </form>
  );
}
export const Form = defineMeta(FormImpl, {
  n: '00', group: 'Основа', name: 'Form', allowed: 'any',
  props: {
    onSubmit: { type: 'function' }, action: { type: 'string' },
    method: { type: 'enum', options: METHODS, default: 'get' },
  },
});
