// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/07 · Карточка показателя',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Нагрузка процессора, памяти, диска: значение, оценка, полоса заполнения."}}},
};

export const Default = {
  name: 'Карточка показателя',
  render: () => `<div class="g3">
    <div class="sl-card"><span class="sl-caps">Процессор</span><div class="sl-card__head"><span class="sl-metric__value">5,3%</span><span class="sl-status sl-status--plain">Умеренная</span></div><div class="sl-progress"><span style="width:6%"></span></div><span class="sl-hint">Ядер: 12</span></div>
    <div class="sl-card"><span class="sl-caps">Память</span><div class="sl-card__head"><span class="sl-metric__value">78,2%</span><span class="sl-status sl-status--warn sl-status--plain">Повышенная</span></div><div class="sl-progress sl-progress--warn"><span style="width:78%"></span></div><span class="sl-hint">Доступно 3,4 из 15,7 ГБ</span></div>
    <div class="sl-card"><span class="sl-caps">Диск</span><div class="sl-card__head"><span class="sl-metric__value">93,4%</span><span class="sl-status sl-status--crit sl-status--plain">Критическая</span></div><div class="sl-progress sl-progress--crit"><span style="width:93%"></span></div><span class="sl-hint">Свободно 61 из 931 ГБ</span></div>
  </div>`,
};
