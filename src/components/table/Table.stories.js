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

export const Playground = {
  name: 'Песочница',
  args: { columns: 'Время, Пользователь, Событие, Подробности', rows: '26.11.2026, 11:04 | ivanov | ok:Вход | Chrome · Windows\n26.11.2026, 10:40 | admin | crit:Ошибка входа | Пользователь не найден\n26.11.2026, 09:49 | petrov | off:Изменение | Яндекс Браузер', stack: true, empty: false },
  argTypes: {
    columns: { name: 'Колонки через запятую', control: 'text' },
    rows: { name: 'Строки: ячейки через |, статус как «ok:Текст»', control: 'text' },
    stack: { name: 'На телефоне — карточками', control: 'boolean' },
    empty: { name: 'Пустая таблица', control: 'boolean' },
  },
  render: a => {
    const cols = a.columns.split(',').map(s => s.trim());
    const cell = (v, i) => {
      const m = v.match(/^(ok|warn|crit|off):(.*)$/);
      const inner = m ? `<span class="sl-status${m[1] !== 'off' ? ' sl-status--' + m[1] : ''}">${m[2]}</span>` : v;
      return `<td data-label="${cols[i] || ''}">${inner}</td>`;
    };
    const body = a.empty ? `<tr><td colspan="${cols.length}"><div class="sl-empty"><i data-ic="pulse"></i>Событий нет</div></td></tr>`
      : a.rows.split('\n').filter(Boolean).map(r => `<tr>${r.split('|').map(s => s.trim()).map(cell).join('')}</tr>`).join('');
    return `<div class="sl-table-wrap"><table class="sl-table${a.stack ? ' sl-table--stack' : ''}"><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
  },
};
