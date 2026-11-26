// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/10 · Сводка цифрами',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Счётчики над списком: онлайн, предупреждения, офлайн, всего."}}},
};

export const Default = {
  name: 'Сводка цифрами',
  render: () => `<div class="sl-stats">
    <div class="sl-stat"><span class="sl-stat__value" style="--c:var(--sl-ok)">10</span><span class="sl-caps">Онлайн</span></div>
    <div class="sl-stat"><span class="sl-stat__value" style="--c:var(--sl-warn)">0</span><span class="sl-caps">Предупр.</span></div>
    <div class="sl-stat"><span class="sl-stat__value">1</span><span class="sl-caps">Офлайн</span></div>
    <div class="sl-stat"><span class="sl-stat__value">11</span><span class="sl-caps">Всего</span></div>
  </div>`,
};

export const Playground = {
  name: 'Песочница',
  args: { online: 10, warn: 0, offline: 1, total: 11 },
  argTypes: {
    online: { name: 'Онлайн', control: { type: 'number', min: 0 } },
    warn: { name: 'Предупреждения', control: { type: 'number', min: 0 } },
    offline: { name: 'Офлайн', control: { type: 'number', min: 0 } },
    total: { name: 'Всего', control: { type: 'number', min: 0 } },
  },
  render: a => `<div class="sl-stats" style="max-width:420px">
    <div class="sl-stat"><span class="sl-stat__value" style="--c:var(--sl-ok)">${a.online}</span><span class="sl-caps">Онлайн</span></div>
    <div class="sl-stat"><span class="sl-stat__value" style="--c:var(--sl-warn)">${a.warn}</span><span class="sl-caps">Предупр.</span></div>
    <div class="sl-stat"><span class="sl-stat__value">${a.offline}</span><span class="sl-caps">Офлайн</span></div>
    <div class="sl-stat"><span class="sl-stat__value">${a.total}</span><span class="sl-caps">Всего</span></div></div>`,
};
