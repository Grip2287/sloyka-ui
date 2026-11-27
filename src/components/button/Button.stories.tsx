import { Button, ButtonGroup, type IconName } from '../../react';

type Args = Record<string, any>;

export default {
  title: 'Компоненты/01 · Кнопки',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Основная (тёмная), обычная, без рамки, капсом, иконочные, малые, опасное действие, недоступная, группа кнопок карты.' } } },
};

export const Default = {
  name: 'Кнопки',
  render: () => (
    <>
      <div className="row">
        <Button variant="primary">Сохранить</Button>
        <Button variant="primary" icon="plus">Добавить устройство</Button>
        <Button icon="refresh">Обновить</Button>
        <Button icon="arrow-left">Мониторинг</Button>
        <Button variant="ghost">Отмена</Button>
      </div>
      <div className="row">
        <Button variant="primary" caps size="lg">Войти</Button>
        <Button caps icon="plus">Создать тревогу</Button>
        <Button size="sm">Скачать архив</Button>
        <Button size="sm">Новый ключ</Button>
        <Button disabled>Обновить устаревшие</Button>
      </div>
      <div className="row">
        <Button iconOnly icon="filter" aria-label="Фильтр" />
        <Button iconOnly icon="moon" aria-label="Тема" />
        <Button icon="user">ОД 12</Button>
        <Button iconOnly icon="power" variant="danger" aria-label="Выйти" />
        <Button iconOnly icon="arrow-right" variant="primary" aria-label="Отправить" />
        <span style={{ width: 16 }} />
        <ButtonGroup>
          <Button iconOnly icon="plus" aria-label="Приблизить" />
          <Button iconOnly icon="minus" aria-label="Отдалить" />
          <Button iconOnly icon="maximize" aria-label="Во весь экран" />
        </ButtonGroup>
      </div>
    </>
  ),
};

const ICONS = ['нет', 'plus', 'refresh', 'arrow-left', 'arrow-right', 'filter', 'moon', 'user', 'power', 'x', 'check'];
export const Playground = {
  name: 'Песочница',
  args: { label: 'Сохранить', variant: 'primary', size: 'md', icon: 'нет', iconOnly: false, caps: false, block: false, disabled: false },
  argTypes: {
    label: { name: 'Текст', control: 'text' },
    variant: { name: 'Вид', control: 'inline-radio', options: ['primary', 'default', 'ghost', 'danger'] },
    size: { name: 'Размер', control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    icon: { name: 'Иконка', control: 'select', options: ICONS },
    iconOnly: { name: 'Только иконка', control: 'boolean' },
    caps: { name: 'Капсом', control: 'boolean' },
    block: { name: 'На всю ширину', control: 'boolean' },
    disabled: { name: 'Недоступна', control: 'boolean' },
  },
  render: (a: Args) => {
    const icon = a.icon !== 'нет' ? (a.icon as IconName) : undefined;
    const common = { variant: a.variant, size: a.size, caps: a.caps, block: a.block, disabled: a.disabled };
    return (
      <div>
        {a.iconOnly
          ? <Button {...common} iconOnly icon={icon ?? 'plus'} aria-label={a.label} />
          : <Button {...common} icon={icon}>{a.label}</Button>}
      </div>
    );
  },
};
