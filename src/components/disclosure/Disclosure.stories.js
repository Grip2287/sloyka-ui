// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/12 · Раскрывающиеся разделы',
  tags: ["autodocs", "progressive"],
  parameters: {"docs": {"description": {"component": "Разделы панели редактирования: стрелка поворачивается, содержимое раскрывается."}}, "progressiveText": ["Название, адрес, периметр объекта."]},
};

export const Default = {
  name: 'Раскрывающиеся разделы',
  render: () => `<div class="panel" style="padding:4px 14px">
    <details class="sl-disclosure" open><summary><i data-ic="chevron-right"></i><span class="sl-caps">Объект</span></summary><div class="sl-disclosure__body">Название, адрес, периметр объекта.</div></details>
    <details class="sl-disclosure"><summary><i data-ic="chevron-right"></i><span class="sl-caps">Состав объекта</span></summary></details>
    <details class="sl-disclosure"><summary><i data-ic="chevron-right"></i><span class="sl-caps">Зоны охраны</span></summary></details>
    <details class="sl-disclosure" style="border:0"><summary><i data-ic="chevron-right"></i><span class="sl-caps">Палитра</span></summary></details>
  </div>`,
};
