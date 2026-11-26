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
