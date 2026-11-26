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
