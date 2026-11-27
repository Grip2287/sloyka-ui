import type { ReactElement } from 'react';
import { Field, Search, Select, Textarea, Compose } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/02 · Поля ввода',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Поле с подписью, с ошибкой, поиск, выпадающий список, многострочное, строка сообщения с кнопкой отправки.' } } },
};

export const Default = {
  name: 'Поля ввода',
  render: () => (
    <>
      <div className="g2">
        <Field label="Имя пользователя" placeholder="Введите логин" />
        <Field label="Пароль" type="password" defaultValue="12345" error="Неверный пароль" />
        <Search placeholder="Поиск устройства…" />
        <Select aria-label="Все статусы" options={[{ value: 'all', label: 'Все статусы' }, { value: 'ok', label: 'На связи' }]} />
      </div>
      <Textarea label="Текст оповещения" defaultValue="Внимание. Проверка системы оповещения." hint="До 500 символов" />
      <Compose placeholder="Сообщение в канал «Дежурная смена»…" onSend={() => {}} />
    </>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { label: 'Имя пользователя', placeholder: 'Введите логин', value: '', kind: 'поле', hint: '', error: '' },
  argTypes: {
    label: { name: 'Подпись', control: 'text' },
    placeholder: { name: 'Подсказка внутри', control: 'text' },
    value: { name: 'Значение', control: 'text' },
    kind: { name: 'Тип', control: 'inline-radio', options: ['поле', 'поиск', 'список', 'многострочное'] },
    hint: { name: 'Пояснение под полем', control: 'text' },
    error: { name: 'Текст ошибки', control: 'text' },
  },
  render: (a: Args) => {
    const chrome = { label: a.label || undefined, hint: a.hint || undefined, error: a.error || undefined, 'aria-label': a.label ? undefined : a.placeholder };
    const controls: Record<string, ReactElement> = {
      'поле': <Field key={a.value} {...chrome} placeholder={a.placeholder} defaultValue={a.value} />,
      'поиск': <Search key={a.value} placeholder={a.placeholder} defaultValue={a.value} aria-label={a.label || a.placeholder} />,
      'список': <Select {...chrome} options={[{ value: 'v', label: a.value || a.placeholder }]} />,
      'многострочное': <Textarea key={a.value} {...chrome} placeholder={a.placeholder} defaultValue={a.value} />,
    };
    return <div style={{ maxWidth: 360 }}>{controls[a.kind]}</div>;
  },
};
