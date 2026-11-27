import { useState } from 'react';
import { Modal, Button, Field, Select, Switch } from '../../react';
import { StaticModal } from '../../../.storybook/static';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/21 · Модальное окно',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Форма поверх затемнения: заголовок, поля, кнопки внизу. «Песочница» и первый пример — снимок вида; живое окно (<Modal>) — в примере «Открыть по кнопке».' } } },
};

export const Default = {
  name: 'Модальное окно',
  render: () => (
    <StaticModal title="Новое устройство" footer={<><Button variant="ghost">Отмена</Button><Button variant="primary">Добавить</Button></>}>
      <Field label="Название" placeholder="Например, Камера КПП-2" />
      <div className="g2">
        <Select label="Класс" options={[{ value: 'video', label: 'Видео' }]} />
        <Field label="Адрес" placeholder="10.0.0.1:9100" />
      </div>
      <Switch defaultChecked>Принимать данные</Switch>
    </StaticModal>
  ),
};

function LiveDemo() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button variant="primary" icon="plus" onClick={() => setOpen(true)}>Добавить устройство</Button>
      <Modal title="Новое устройство" open={open} onOpenChange={setOpen}
        footer={<><Button variant="ghost" onClick={close}>Отмена</Button><Button variant="primary" onClick={close}>Добавить</Button></>}>
        <Field label="Название" placeholder="Например, Камера КПП-2" />
      </Modal>
    </>
  );
}

export const Live = {
  name: 'Открыть по кнопке',
  parameters: { pair: false },
  render: () => <LiveDemo />,
};

export const Playground = {
  name: 'Песочница',
  args: { title: 'Новое устройство', fields: 'Название\nАдрес', switchLabel: 'Принимать данные', ok: 'Добавить', cancel: 'Отмена', width: 420 },
  argTypes: {
    title: { name: 'Заголовок', control: 'text' },
    fields: { name: 'Поля, по строке', control: 'text' },
    switchLabel: { name: 'Тумблер (пусто — нет)', control: 'text' },
    ok: { name: 'Главная кнопка', control: 'text' },
    cancel: { name: 'Кнопка отмены', control: 'text' },
    width: { name: 'Ширина, px', control: { type: 'range', min: 320, max: 640, step: 20 } },
  },
  render: (a: Args) => (
    <StaticModal title={a.title} width={a.width}
      footer={<>{a.cancel && <Button variant="ghost">{a.cancel}</Button>}<Button variant="primary">{a.ok}</Button></>}>
      {String(a.fields).split('\n').filter(Boolean).map((f, i) => <Field key={i} label={f} />)}
      {a.switchLabel && <Switch defaultChecked>{a.switchLabel}</Switch>}
    </StaticModal>
  ),
};
