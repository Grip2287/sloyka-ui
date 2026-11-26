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

const ICONS = ['bell', 'users', 'map', 'plug', 'phone', 'shield', 'wrench', 'help', 'server', 'journal'];
export const Playground = {
  name: 'Песочница',
  args: { kind: 'ссылка', icon: 'bell', title: 'Работа с тревогой', text: 'Принять, выполнить план, снять, оповестить.', steps: 'Пользователи: Заведите операторов\nКарта объекта: Загрузите карту\nУстройства: Подключите напрямую' },
  argTypes: {
    kind: { name: 'Что показать', control: 'inline-radio', options: ['ссылка', 'шаги'] },
    icon: { name: 'Иконка ссылки', control: 'select', options: ICONS },
    title: { name: 'Заголовок ссылки', control: 'text' },
    text: { name: 'Описание ссылки', control: 'text' },
    steps: { name: 'Шаги «заголовок: текст», по строке', control: 'text' },
  },
  render: a => a.kind === 'ссылка'
    ? `<a class="sl-card sl-card--interactive sl-link-card" href="#" style="max-width:420px"><i data-ic="${a.icon}" class="sl-ic--lg"></i><div><div class="sl-card__title">${a.title}</div><div class="sl-card__sub">${a.text}</div></div><i data-ic="chevron-right"></i></a>`
    : `<div class="sl-steps">${a.steps.split('\n').filter(Boolean).map((s, i) => { const [t, ...d] = s.split(':'); return `<div class="sl-card sl-step"><span class="sl-step__num">${i + 1}</span><div class="sl-card__title">${t.trim()}</div><div class="sl-card__sub">${d.join(':').trim()}</div></div>`; }).join('')}</div>`,
};
