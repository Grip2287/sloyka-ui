// Структура бокового меню для прототипа (разделы как в админке, без названий исходной системы).
export const SL_NAV = [
  ['Управление', [['users', 'users', 'Пользователи'], ['login', 'login', 'Журнал входов'], ['journal', 'journal', 'Журнал событий']]],
  ['Система', [['state', 'server', 'Состояние системы'], ['logs', 'pulse', 'Логи системы', 3]]],
  ['Интеграции', [['devices', 'plug', 'Устройства'], ['agents', 'key', 'Агенты'], ['maps', 'map', 'Карты'], ['notify', 'phone', 'Оповещение']]],
  ['Реагирование', [['plan', 'shield', 'План действий'], ['train', 'target', 'Тренировки']]],
  ['Справка', [['help', 'help', 'Помощь']]],
];
export function slNavHTML(active) {
  return SL_NAV.map(([sec, items]) =>
    `<div class="sl-nav__section sl-caps">${sec}</div>` +
    items.map(([id, ic, label, n]) =>
      `<a class="sl-nav__item" href="#${id}" ${id === active ? 'aria-current="page"' : ''} title="${label}"><i data-ic="${ic}"></i><span class="sl-nav__label">${label}</span>${n ? `<span class="sl-count sl-count--solid">${n}</span>` : ''}</a>`
    ).join('')
  ).join('');
}
