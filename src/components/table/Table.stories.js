// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/13 · Таблица',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Журнал: заголовки капсом, статус в ячейке, действия справа. На телефоне строки превращаются в карточки. Ниже — пустая таблица."}}},
};

export const Default = {
  name: 'Таблица',
  render: () => `<div class="sl-table-wrap"><table class="sl-table sl-table--stack">
    <thead><tr><th>Время</th><th>Пользователь</th><th>Событие</th><th>IP-адрес</th><th>Подробности</th></tr></thead>
    <tbody>
      <tr><td data-label="Время">26.11.2026, 11:04</td><td data-label="Пользователь"><b>ivanov</b></td><td data-label="Событие"><span class="sl-status sl-status--ok">Вход</span></td><td data-label="IP">127.0.0.1</td><td data-label="Подробности" class="sl-muted">Chrome 156 · Windows</td></tr>
      <tr><td data-label="Время">26.11.2026, 10:40</td><td data-label="Пользователь"><b>admin</b></td><td data-label="Событие"><span class="sl-status sl-status--crit">Ошибка входа</span></td><td data-label="IP">127.0.0.1</td><td data-label="Подробности">Пользователь не найден</td></tr>
      <tr><td data-label="Время">26.11.2026, 09:49</td><td data-label="Пользователь"><b>petrov</b></td><td data-label="Событие"><span class="sl-status">Изменение</span></td><td data-label="IP">10.0.0.12</td><td data-label="Подробности" class="sl-muted">Яндекс Браузер 26</td></tr>
    </tbody></table></div>
  <div class="sl-table-wrap"><table class="sl-table"><thead><tr><th>Время</th><th>Категория</th><th>Уровень</th><th>Сообщение</th></tr></thead>
    <tbody><tr><td colspan="4"><div class="sl-empty"><i data-ic="pulse"></i>Событий нет</div></td></tr></tbody></table></div>`,
};
