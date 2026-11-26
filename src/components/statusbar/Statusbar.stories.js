// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/17 · Строка состояния и плавающие кнопки',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Часы и «Система в норме» поверх карты, выбор подсистемы, кнопка нижней панели «Силы и средства»."}}},
};

export const Default = {
  name: 'Строка состояния и плавающие кнопки',
  render: () => `<div class="row" style="align-items:flex-start">
    <div class="sl-statusbar"><div><span class="sl-caps">Астрономическое</span><strong>11:04:18</strong></div><div><span class="sl-caps">Оперативное</span><strong>11:04:18 · 26 ноя 2026</strong></div><div><span class="sl-caps">Система</span><span class="sl-status sl-status--ok">В норме</span></div></div>
    <button class="sl-dock-btn"><i data-ic="grid"></i>Центр<i data-ic="chevron-down"></i></button>
  </div>
  <div class="row"><button class="sl-dock-btn">Силы и средства<i data-ic="chevron-up"></i></button></div>`,
};

export const Playground = {
  name: 'Песочница',
  args: { blocks: 'Астрономическое: 11:04:18\nОперативное: 11:04:18 · 26 ноя 2026', system: 'В норме', systemKind: 'ok', dock: 'Силы и средства' },
  argTypes: {
    blocks: { name: 'Блоки «подпись: значение», по строке', control: 'text' },
    system: { name: 'Состояние системы', control: 'text' },
    systemKind: { name: 'Цвет состояния', control: 'inline-radio', options: ['ok', 'warn', 'crit'] },
    dock: { name: 'Кнопка снизу (пусто — нет)', control: 'text' },
  },
  render: a => `<div class="col"><div class="row" style="align-items:flex-start"><div class="sl-statusbar">${a.blocks.split('\n').filter(Boolean).map(b => { const [k, ...v] = b.split(':'); return `<div><span class="sl-caps">${k.trim()}</span><strong>${v.join(':').trim()}</strong></div>`; }).join('')}<div><span class="sl-caps">Система</span><span class="sl-status sl-status--${a.systemKind}">${a.system}</span></div></div></div>
    ${a.dock ? `<div class="row"><button class="sl-dock-btn">${a.dock}<i data-ic="chevron-up"></i></button></div>` : ''}</div>`,
};
