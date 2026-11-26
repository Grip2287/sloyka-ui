// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/05 · Статусы',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Точка + подпись капсом: на связи, предупреждение, нет связи, отключён, офлайн (полая точка). Обычный текстовый статус и плашка «Система в норме»."}}},
};

export const Default = {
  name: 'Статусы',
  render: () => `<div class="row" style="gap:22px">
    <span class="sl-status sl-status--ok">На связи</span>
    <span class="sl-status sl-status--warn">Предупреждение</span>
    <span class="sl-status sl-status--crit">Нет связи</span>
    <span class="sl-status">Отключён</span>
    <span class="sl-status sl-status--hollow">Офлайн <span class="sl-status__note">· Нет связи</span></span>
  </div>
  <div class="row" style="gap:22px">
    <span class="sl-status sl-status--ok sl-status--plain">Работает</span>
    <span class="sl-status sl-status--warn sl-status--plain">Повышенная нагрузка</span>
    <span class="sl-pill"><span class="sl-status sl-status--ok">В норме</span></span>
  </div>`,
};
