// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/03 · Переключатели',
  tags: ["autodocs"],
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
