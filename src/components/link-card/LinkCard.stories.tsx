import { LinkCard, Steps, type IconName } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/08 · Карточки-ссылки и шаги',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Раздел помощи: иконка, заголовок, описание, стрелка. Шаги «С чего начать» с номерами.' } } },
};

export const Default = {
  name: 'Карточки-ссылки и шаги',
  render: () => (
    <>
      <div className="g2">
        <LinkCard icon="bell" title="Работа с тревогой" text="Принять, выполнить план, снять, оповестить." href="#alarm" />
        <LinkCard icon="users" title="Пользователи и доступ" text="Роли, права, блокировка, журналы входов." href="#users" />
      </div>
      <Steps items={[
        { title: 'Пользователи', text: 'Заведите операторов и старших смены.' },
        { title: 'Карта объекта', text: 'Загрузите карту, обведите периметр.' },
        { title: 'Устройства', text: 'Подключите напрямую или через агента.' },
      ]} />
    </>
  ),
};

const ICONS = ['bell', 'users', 'map', 'plug', 'phone', 'shield', 'wrench', 'help', 'server', 'journal'];
export const Playground = {
  name: 'Песочница',
  args: { kind: 'ссылка', icon: 'bell', title: 'Работа с тревогой', text: 'Принять, выполнить план, снять, оповестить.', steps: 'Пользователи: Заведите операторов\nКарта объекта: Загрузите карту\nУстройства: Подключите напрямую' },
  argTypes: {
    kind: { name: 'Что показать', control: 'inline-radio', options: ['ссылка', 'шаги'] },
    icon: { name: 'Иконка ссылки', control: 'select', options: ICONS },
    title: { name: 'Заголовок ссылки', control: 'text' },
    text: { name: 'Описание ссылки', control: 'text' },
    steps: { name: 'Шаги «заголовок: текст», по строке', control: 'text' },
  },
  render: (a: Args) => a.kind === 'ссылка'
    ? <div style={{ maxWidth: 420 }}><LinkCard icon={a.icon as IconName} title={a.title} text={a.text} href="#" /></div>
    : <Steps items={String(a.steps).split('\n').filter(Boolean).map((s) => { const [t, ...d] = s.split(':'); return { title: t.trim(), text: d.join(':').trim() }; })} />,
};
