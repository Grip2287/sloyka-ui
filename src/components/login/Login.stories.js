// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/23 · Карточка входа',
  tags: ["autodocs", "ref-base"],
  parameters: {"docs": {"description": {"component": "Знак продукта (заглушка вместо логотипа), поля с подписями, кнопка, подпись внизу."}}},
};

export const Default = {
  name: 'Карточка входа',
  render: () => `<div style="display:grid;grid-template-columns:minmax(0,340px);justify-content:center;justify-items:center;gap:18px;padding:12px 0">
    <span class="sl-brand" style="font-size:20px"><span class="sl-brand__mark" style="width:40px;height:40px;border-radius:12px;font-size:18px">S</span>SLOYKA</span>
    <form class="sl-login" onsubmit="return false">
      <label class="sl-field"><span class="sl-label">Имя пользователя</span><input class="sl-input" placeholder="Введите логин"></label>
      <label class="sl-field"><span class="sl-label">Пароль</span><input class="sl-input" type="password" placeholder="Введите пароль"></label>
      <button class="sl-btn sl-btn--primary sl-btn--caps sl-btn--lg sl-btn--block">Войти</button>
      <div class="sl-login__foot">Название организации</div>
    </form>
  </div>`,
};

export const Playground = {
  name: 'Песочница',
  args: { mark: 'S', brand: 'SLOYKA', userLabel: 'Имя пользователя', passLabel: 'Пароль', button: 'Войти', footer: 'Название организации', error: '' },
  argTypes: {
    mark: { name: 'Знак', control: 'text' },
    brand: { name: 'Название', control: 'text' },
    userLabel: { name: 'Подпись логина', control: 'text' },
    passLabel: { name: 'Подпись пароля', control: 'text' },
    button: { name: 'Текст кнопки', control: 'text' },
    footer: { name: 'Подпись внизу', control: 'text' },
    error: { name: 'Ошибка входа', control: 'text' },
  },
  render: a => `<div style="display:grid;grid-template-columns:minmax(0,340px);justify-content:center;justify-items:center;gap:18px;padding:12px 0">
    <span class="sl-brand" style="font-size:20px"><span class="sl-brand__mark" style="width:40px;height:40px;border-radius:12px;font-size:18px">${a.mark}</span>${a.brand}</span>
    <form class="sl-login" onsubmit="return false">
      <label class="sl-field"><span class="sl-label">${a.userLabel}</span><input class="sl-input" placeholder="Введите логин"></label>
      <label class="sl-field"><span class="sl-label">${a.passLabel}</span><input class="sl-input" type="password" placeholder="Введите пароль"${a.error ? ' aria-invalid="true"' : ''}>${a.error ? `<span class="sl-error">${a.error}</span>` : ''}</label>
      <button class="sl-btn sl-btn--primary sl-btn--caps sl-btn--lg sl-btn--block">${a.button}</button>
      ${a.footer ? `<div class="sl-login__foot">${a.footer}</div>` : ''}</form></div>`,
};
