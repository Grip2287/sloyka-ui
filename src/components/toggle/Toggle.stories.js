// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/03 · Переключатели',
  tags: ["autodocs", "ref-base"],
  parameters: {"docs": {"description": {"component": "Сегментированный переключатель (вид карты, режимы), тумблер, чекбокс и радиокнопка."}}},
};

export const Default = {
  name: 'Переключатели',
  render: () => `<div class="col">
    <sl-segmented class="sl-segmented sl-segmented--block"><button>Без зон</button><button>Рабочий</button><button aria-pressed="true">Всё</button></sl-segmented>
    <sl-segmented class="sl-segmented"><button>Схема</button><button aria-pressed="true">Спутник</button></sl-segmented>
    <sl-segmented class="sl-segmented"><button>Авто</button><button>Оба</button><button aria-pressed="true">Подавление</button><button>Обнаружение</button><button>Скрыть</button></sl-segmented>
  </div>
  <div class="row" style="gap:24px">
    <label class="sl-switch"><input type="checkbox" checked>Зоны охраны</label>
    <label class="sl-switch"><input type="checkbox">Птицы и шум</label>
    <label class="sl-check"><input type="checkbox" checked>Запомнить</label>
    <label class="sl-check"><input type="radio" name="r" checked>По приборам</label>
    <label class="sl-check"><input type="radio" name="r">Единой площадью</label>
  </div>`,
};

export const Playground = {
  name: 'Песочница',
  args: { options: 'Без зон, Рабочий, Всё', selected: 3, block: false, switchLabel: 'Зоны охраны', switchOn: true, checkLabel: 'Запомнить', checkOn: true, kind: 'checkbox' },
  argTypes: {
    options: { name: 'Сегменты через запятую', control: 'text' },
    selected: { name: 'Выбран сегмент №', control: { type: 'number', min: 1 } },
    block: { name: 'Сегменты на всю ширину', control: 'boolean' },
    switchLabel: { name: 'Подпись тумблера', control: 'text' },
    switchOn: { name: 'Тумблер включён', control: 'boolean' },
    checkLabel: { name: 'Подпись флажка', control: 'text' },
    checkOn: { name: 'Флажок отмечен', control: 'boolean' },
    kind: { name: 'Флажок или радиокнопка', control: 'inline-radio', options: ['checkbox', 'radio'] },
  },
  render: a => {
    const opts = a.options.split(',').map(s => s.trim()).filter(Boolean);
    const seg = opts.map((o, i) => `<button${i + 1 === a.selected ? ' aria-pressed="true"' : ''}>${o}</button>`).join('');
    return `<div class="col"><sl-segmented class="sl-segmented${a.block ? ' sl-segmented--block' : ''}">${seg}</sl-segmented>
      <div class="row" style="gap:24px"><label class="sl-switch"><input type="checkbox"${a.switchOn ? ' checked' : ''}>${a.switchLabel}</label>
      <label class="sl-check"><input type="${a.kind}" name="pg"${a.checkOn ? ' checked' : ''}>${a.checkLabel}</label></div></div>`;
  },
};
