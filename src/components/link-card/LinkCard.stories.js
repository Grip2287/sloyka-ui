// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/08 · Карточки-ссылки и шаги',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Раздел помощи: иконка, заголовок, описание, стрелка. Шаги «С чего начать» с номерами."}}},
};

export const Default = {
  name: 'Карточки-ссылки и шаги',
  render: () => `<div class="g2">
    <a class="sl-card sl-card--interactive sl-link-card"><i data-ic="bell" class="sl-ic--lg"></i><div><div class="sl-card__title">Работа с тревогой</div><div class="sl-card__sub">Принять, выполнить план, снять, оповестить.</div></div><i data-ic="chevron-right"></i></a>
    <a class="sl-card sl-card--interactive sl-link-card"><i data-ic="users" class="sl-ic--lg"></i><div><div class="sl-card__title">Пользователи и доступ</div><div class="sl-card__sub">Роли, права, блокировка, журналы входов.</div></div><i data-ic="chevron-right"></i></a>
  </div>
  <div class="sl-steps">
    <div class="sl-card sl-step"><span class="sl-step__num">1</span><div class="sl-card__title">Пользователи</div><div class="sl-card__sub">Заведите операторов и старших смены.</div></div>
    <div class="sl-card sl-step"><span class="sl-step__num">2</span><div class="sl-card__title">Карта объекта</div><div class="sl-card__sub">Загрузите карту, обведите периметр.</div></div>
    <div class="sl-card sl-step"><span class="sl-step__num">3</span><div class="sl-card__title">Устройства</div><div class="sl-card__sub">Подключите напрямую или через агента.</div></div>
  </div>`,
};
