'use client';
import type { FormEvent, ReactNode } from 'react';
import { defineMeta } from '../../core';
import { BrandView, type Brand } from '../topbar/Topbar';
import { Field } from '../field/Field';
import { Button } from '../button/Button';

export interface LoginValues {
  username: string;
  password: string;
}

export interface LoginProps {
  brand: Brand;
  onSubmit: (values: LoginValues, event: FormEvent<HTMLFormElement>) => void;
  /** Текст ошибки входа над кнопкой. */
  error?: string;
  /** Подпись внизу карточки: название организации. */
  footer?: ReactNode;
}

function LoginImpl({ brand, onSubmit, error, footer }: LoginProps) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSubmit({ username: String(data.get('username') ?? ''), password: String(data.get('password') ?? '') }, e);
  };
  return (
    <div className="sl-login-wrap">
      <BrandView {...brand} />
      <form className="sl-login" onSubmit={submit}>
        <Field label="Имя пользователя" name="username" placeholder="Введите логин" autoComplete="username" required />
        <Field label="Пароль" name="password" type="password" placeholder="Введите пароль" autoComplete="current-password" required />
        {error && <span className="sl-error" role="alert">{error}</span>}
        <Button variant="primary" caps size="lg" block type="submit">Войти</Button>
        {footer && <div className="sl-login__foot">{footer}</div>}
      </form>
    </div>
  );
}
export const Login = defineMeta(LoginImpl, {
  n: '23', group: 'Карточка входа', name: 'Login', allowed: 'none',
  props: {
    brand: { type: '{ mark, name }', required: true }, onSubmit: { type: 'function', required: true },
    error: { type: 'string' }, footer: { type: 'ReactNode' },
  },
});
