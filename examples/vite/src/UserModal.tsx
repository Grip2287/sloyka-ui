'use client';
// Кнопка «Добавить пользователя» и модальное окно с четырьмя полями — только компоненты Sloyka.
import { useState } from 'react';
import { Button, Modal, Field, Stack, useToast } from 'sloyka';

const EMPTY = { name: '', email: '', login: '', password: '' };
type Form = typeof EMPTY;

function validate(f: Form): Partial<Form> {
  const e: Partial<Form> = {};
  if (!f.name.trim()) e.name = 'Укажите имя пользователя';
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Укажите почту в формате name@example.ru';
  if (!f.login.trim()) e.login = 'Укажите логин';
  if (f.password.length < 8) e.password = 'Пароль — не короче 8 символов';
  return e;
}

export function UserModal() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Form>>({});

  const set = (key: keyof Form) => (value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  function close() {
    setOpen(false);
    setForm(EMPTY);
    setErrors({});
  }

  function save() {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    toast.ok(`Пользователь «${form.name.trim()}» сохранён`, { title: 'Готово' });
    close();
  }

  return (
    <>
      <Button icon="user" onClick={() => setOpen(true)}>Добавить пользователя</Button>
      <Modal
        title="Новый пользователь"
        open={open}
        onOpenChange={o => (o ? setOpen(true) : close())}
        footer={
          <>
            <Button onClick={close}>Отменить</Button>
            <Button variant="primary" onClick={save}>Сохранить</Button>
          </>
        }
      >
        <Stack gap={3}>
          <Field label="Имя пользователя" name="name" autoComplete="name" required value={form.name} onChange={set('name')} error={errors.name} />
          <Field label="Почта" name="email" type="email" autoComplete="email" required value={form.email} onChange={set('email')} error={errors.email} />
          <Field label="Логин" name="login" autoComplete="username" required value={form.login} onChange={set('login')} error={errors.login} />
          <Field label="Пароль" name="password" type="password" autoComplete="new-password" required hint="Не короче 8 символов" value={form.password} onChange={set('password')} error={errors.password} />
        </Stack>
      </Modal>
    </>
  );
}
