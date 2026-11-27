import { Button, Tooltip, useToast } from '../../react';
import { StaticToast } from '../../../.storybook/static';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/22 · Уведомления и подсказка',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Всплывающие уведомления: успех, предупреждение, ошибка. Тёмная подсказка при наведении. Карточки ниже — снимок вида; живые уведомления (useToast) — в примере «Показать уведомление».' } } },
};

export const Default = {
  name: 'Уведомления и подсказка',
  render: () => (
    <div className="col">
      <StaticToast kind="ok" title="Устройство добавлено" text="Камера КПП-2 появится на карте после размещения." close />
      <StaticToast kind="warn" title="Связь нестабильна" text="Шлюз-04 отвечает с задержкой." close />
      <StaticToast kind="crit" title="Не удалось загрузить журнал" text="Проверьте соединение и обновите страницу." close />
      <span>
        <Tooltip text="Переключить тему"><Button size="sm" iconOnly icon="moon" aria-label="Тёмная тема" /></Tooltip>
      </span>
    </div>
  ),
};

const DEMO = {
  ok: ['Устройство добавлено', 'Камера КПП-2 появится на карте после размещения.'],
  warn: ['Связь нестабильна', 'Шлюз-04 отвечает с задержкой.'],
  crit: ['Не удалось загрузить журнал', 'Проверьте соединение и обновите страницу.'],
} as const;

function LiveDemo() {
  const toast = useToast();
  const show = (kind: keyof typeof DEMO) => { const [title, text] = DEMO[kind]; toast[kind](text, { title }); };
  return (
    <div className="row">
      <Button onClick={() => show('ok')}>Успех</Button>
      <Button onClick={() => show('warn')}>Предупреждение</Button>
      <Button onClick={() => show('crit')}>Ошибка</Button>
    </div>
  );
}

export const Live = {
  name: 'Показать уведомление',
  parameters: { pair: false },
  render: () => <LiveDemo />,
};

export const Playground = {
  name: 'Песочница',
  args: { kind: 'ok', title: 'Устройство добавлено', text: 'Камера КПП-2 появится на карте после размещения.' },
  argTypes: {
    kind: { name: 'Вид', control: 'inline-radio', options: ['ok', 'warn', 'crit', 'info'] },
    title: { name: 'Заголовок', control: 'text' },
    text: { name: 'Текст', control: 'text' },
  },
  render: (a: Args) => <StaticToast kind={a.kind} title={a.title} text={a.text} close />,
};
