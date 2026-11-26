// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/18 · Меню аккаунта',
  tags: ["autodocs", "ref-base"],
  parameters: {"docs": {"description": {"component": "Имя и роль, пункты с иконками, разделитель, выход красным."}}},
};

export const Default = {
  name: 'Меню аккаунта',
  render: () => `<div class="sl-menu" style="width:260px">
    <div class="sl-menu__head"><div class="sl-card__title">ОД</div><div class="sl-card__sub">Администратор</div></div>
    <button class="sl-menu__item"><i data-ic="user"></i>Профиль</button>
    <button class="sl-menu__item"><i data-ic="moon"></i>Тёмная тема</button>
    <div class="sl-menu__sep"></div>
    <button class="sl-menu__item sl-menu__item--danger"><i data-ic="power"></i>Выйти</button>
  </div>`,
};

const ICONS = ['user', 'moon', 'gear', 'key', 'help', 'bell', 'journal'];
export const Playground = {
  name: 'Песочница',
  args: { name: 'ОД', role: 'Администратор', items: 'user: Профиль\nmoon: Тёмная тема', danger: 'Выйти' },
  argTypes: {
    name: { name: 'Имя', control: 'text' },
    role: { name: 'Роль', control: 'text' },
    items: { name: 'Пункты «иконка: текст», по строке', control: 'text' },
    danger: { name: 'Красный пункт внизу (пусто — нет)', control: 'text' },
  },
  render: a => `<div class="sl-menu" style="width:260px">${a.name ? `<div class="sl-menu__head"><div class="sl-card__title">${a.name}</div><div class="sl-card__sub">${a.role}</div></div>` : ''}
    ${a.items.split('\n').filter(Boolean).map(r => { const [ic, ...t] = r.split(':'); return `<button class="sl-menu__item"><i data-ic="${ic.trim()}"></i>${t.join(':').trim()}</button>`; }).join('')}
    ${a.danger ? `<div class="sl-menu__sep"></div><button class="sl-menu__item sl-menu__item--danger"><i data-ic="power"></i>${a.danger}</button>` : ''}</div>`,
};
