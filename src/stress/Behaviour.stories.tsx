// Стенд для проверок поведения в браузере (tests/e2e/behaviour.spec.js): меню телефона и модальное окно открыты сразу.
// Метка no-screenshot: история не входит в сравнение скриншотов.
import { Shell, Topbar, Modal, Button, Field, PageHeader } from '../react';
import { DemoNav } from '../../.storybook/nav-data';

export default {
  title: 'Проверки/Поведение',
  tags: ['no-screenshot', '!autodocs'],
  argTypes: { slScale: { table: { disable: true } }, slRadius: { table: { disable: true } } },
  parameters: { layout: 'fullscreen', pair: false },
};

export const MenuAndModal = {
  name: 'Меню телефона и окно',
  render: () => (
    <Shell defaultNavOpen topbar={<Topbar brand={{ mark: 'S', name: 'SLOYKA' }} title="Проверка" />} nav={<DemoNav />}>
      <PageHeader title="Проверка" />
      <Modal title="Окно поверх меню" defaultOpen footer={<Button variant="primary">Готово</Button>}>
        <Field label="Название" />
      </Modal>
    </Shell>
  ),
};
