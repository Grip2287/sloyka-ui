// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/01 · Кнопки',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Основная (тёмная), обычная, без рамки, капсом, иконочные, малые, опасное действие, недоступная, группа кнопок карты."}}},
};

export const Default = {
  name: 'Кнопки',
  render: () => `<div class="row">
    <button class="sl-btn sl-btn--primary">Сохранить</button>
    <button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>Добавить устройство</button>
    <button class="sl-btn"><i data-ic="refresh"></i>Обновить</button>
    <button class="sl-btn"><i data-ic="arrow-left"></i>Мониторинг</button>
    <button class="sl-btn sl-btn--ghost">Отмена</button>
  </div>
  <div class="row">
    <button class="sl-btn sl-btn--primary sl-btn--caps sl-btn--lg">Войти</button>
    <button class="sl-btn sl-btn--caps"><i data-ic="plus"></i>Создать тревогу</button>
    <button class="sl-btn sl-btn--sm">Скачать архив</button>
    <button class="sl-btn sl-btn--sm">Новый ключ</button>
    <button class="sl-btn" disabled>Обновить устаревшие</button>
  </div>
  <div class="row">
    <button class="sl-btn sl-btn--icon" aria-label="Фильтр"><i data-ic="filter"></i></button>
    <button class="sl-btn sl-btn--icon" aria-label="Тема"><i data-ic="moon"></i></button>
    <button class="sl-btn"><i data-ic="user"></i>ОД 12</button>
    <button class="sl-btn sl-btn--icon sl-btn--danger" aria-label="Выйти"><i data-ic="power"></i></button>
    <button class="sl-btn sl-btn--icon sl-btn--primary" aria-label="Отправить"><i data-ic="arrow-right"></i></button>
    <span style="width:16px"></span>
    <div class="sl-btn-group"><button class="sl-btn sl-btn--icon" aria-label="Приблизить"><i data-ic="plus"></i></button><button class="sl-btn sl-btn--icon" aria-label="Отдалить"><i data-ic="minus"></i></button><button class="sl-btn sl-btn--icon" aria-label="Во весь экран"><i data-ic="maximize"></i></button></div>
  </div>`,
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
  render: a => {
    const cls = ['sl-btn', a.variant !== 'default' && `sl-btn--${a.variant}`, a.size !== 'md' && `sl-btn--${a.size}`, a.caps && 'sl-btn--caps', a.block && 'sl-btn--block', a.iconOnly && 'sl-btn--icon'].filter(Boolean).join(' ');
    const ic = a.icon !== 'нет' ? `<i data-ic="${a.icon}"></i>` : '';
    return `<div><button class="${cls}"${a.disabled ? ' disabled' : ''}${a.iconOnly ? ` aria-label="${a.label}"` : ''}>${ic}${a.iconOnly ? '' : a.label}</button></div>`;
  },
};
