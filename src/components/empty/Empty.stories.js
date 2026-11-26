// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/14 · Пустое состояние и загрузка файла',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Пунктирная зона: что сделать и кнопка действия."}}},
};

export const Default = {
  name: 'Пустое состояние и загрузка файла',
  render: () => `<div class="sl-dropzone sl-empty"><i data-ic="upload"></i><div class="sl-empty__title">Карты не загружены</div><div>Загрузите файл карты (.mbtiles или .zip с плитками) — она появится без интернета.</div><button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>Загрузить карту</button></div>`,
};

const ICONS = ['upload', 'pulse', 'map', 'journal', 'users', 'bell', 'search'];
export const Playground = {
  name: 'Песочница',
  args: { icon: 'upload', title: 'Карты не загружены', text: 'Загрузите файл карты — она появится без интернета.', action: 'Загрузить карту', dropzone: true },
  argTypes: {
    icon: { name: 'Иконка', control: 'select', options: ICONS },
    title: { name: 'Заголовок', control: 'text' },
    text: { name: 'Текст', control: 'text' },
    action: { name: 'Кнопка (пусто — без неё)', control: 'text' },
    dropzone: { name: 'Пунктирная рамка', control: 'boolean' },
  },
  render: a => `<div class="sl-empty${a.dropzone ? ' sl-dropzone' : ''}"><i data-ic="${a.icon}"></i><div class="sl-empty__title">${a.title}</div><div>${a.text}</div>${a.action ? `<button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>${a.action}</button>` : ''}</div>`,
};
