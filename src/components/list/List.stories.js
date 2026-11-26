// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/11 · Список с группами',
  tags: ["autodocs", "progressive"],
  parameters: {"docs": {"description": {"component": "Сворачиваемая группа со счётчиком, строки с названием и статусом, выбранная строка (инверсия), стрелка у строк с подробностями."}}, "progressiveText": ["Камера КПП-1", "Шлюз-04"]},
};

export const Default = {
  name: 'Список с группами',
  render: () => `<div class="panel sl-list">
    <sl-group class="sl-group">
      <button class="sl-group__head"><i data-ic="chevron-down"></i>Комплексные средства<span class="sl-count sl-count--solid">4</span></button>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Камера КПП-1</span><span class="sl-status sl-status--ok">Онлайн</span></div></div>
      <div class="sl-row" aria-current="true"><div class="sl-row__main"><span class="sl-row__title">Шлюз-2</span><span class="sl-status sl-status--ok">Онлайн</span></div><i data-ic="chevron-right"></i></div>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Датчик периметра</span><span class="sl-status sl-status--ok">Онлайн</span></div><i data-ic="chevron-right"></i></div>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Шлюз-04</span><span class="sl-status sl-status--hollow">Офлайн <span class="sl-status__note">· Нет связи</span></span></div></div>
    </sl-group>
    <sl-group class="sl-group" data-collapsed><button class="sl-group__head"><i data-ic="chevron-down"></i>Радары<span class="sl-count">1</span></button>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Радар-1</span><span class="sl-status sl-status--ok">Онлайн</span></div></div>
    </sl-group>
  </div>`,
};

export const Playground = {
  name: 'Песочница',
  args: { group: 'Комплексные средства', items: 'Камера КПП-1 | ok\nШлюз-2 | ok\nДатчик периметра | warn\nШлюз-04 | off', selected: 2, collapsed: false, chevrons: true },
  argTypes: {
    group: { name: 'Название группы', control: 'text' },
    items: { name: 'Строки «название | ok/warn/crit/off»', control: 'text' },
    selected: { name: 'Выбрана строка № (0 — нет)', control: { type: 'number', min: 0 } },
    collapsed: { name: 'Группа свёрнута', control: 'boolean' },
    chevrons: { name: 'Стрелки у строк', control: 'boolean' },
  },
  render: a => {
    const LBL = { ok: 'Онлайн', warn: 'Предупреждение', crit: 'Нет связи', off: 'Офлайн' };
    const rows = a.items.split('\n').filter(Boolean).map((r, i) => {
      const [t, s = 'ok'] = r.split('|').map(x => x.trim());
      const cls = s === 'off' ? 'sl-status--hollow' : `sl-status--${s}`;
      return `<div class="sl-row"${i + 1 === a.selected ? ' aria-current="true"' : ''}><div class="sl-row__main"><span class="sl-row__title">${t}</span><span class="sl-status ${cls}">${LBL[s] || s}</span></div>${a.chevrons ? '<i data-ic="chevron-right"></i>' : ''}</div>`;
    }).join('');
    return `<div class="panel sl-list" style="max-width:380px"><sl-group class="sl-group"${a.collapsed ? ' data-collapsed' : ''}><button class="sl-group__head"><i data-ic="chevron-down"></i>${a.group}<span class="sl-count sl-count--solid">${a.items.split('\n').filter(Boolean).length}</span></button>${rows}</sl-group></div>`;
  },
};
