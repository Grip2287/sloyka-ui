// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/18 · Меню аккаунта',
  tags: ["autodocs"],
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
