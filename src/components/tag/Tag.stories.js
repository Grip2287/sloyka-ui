// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/04 · Теги и счётчики',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Тег роли, тег-количество, цветные теги, счётчики в группах и меню, «чип» с числом."}}},
};

export const Default = {
  name: 'Теги и счётчики',
  render: () => `<div class="row">
    <span class="sl-tag">Администратор</span>
    <span class="sl-tag">Оператор</span>
    <span class="sl-tag sl-tag--solid">Центр</span>
    <span class="sl-tag">2 устройства</span>
    <span class="sl-tag sl-tag--ok">Доступен</span>
    <span class="sl-tag sl-tag--warn">Предупреждение</span>
    <span class="sl-tag sl-tag--crit">Удаление</span>
  </div>
  <div class="row">
    <span class="sl-count">6</span><span class="sl-count sl-count--solid">4</span><span class="sl-count">128</span>
    <span class="sl-chip">На линии <span class="sl-count">1</span></span>
    <span class="sl-chip"><i data-ic="bell"></i>Голосовое оповещение</span>
  </div>`,
};
