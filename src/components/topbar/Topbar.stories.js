// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/16 · Верхняя панель админки',
  tags: ["autodocs", "ref-base"],
  parameters: {"docs": {"description": {"component": "Знак продукта (заглушка), название раздела, справа переход, тема, аккаунт, выход."}}},
};

export const Default = {
  name: 'Верхняя панель админки',
  render: () => `<header class="sl-topbar" style="border-radius:var(--sl-r-md)">
    <span class="sl-brand"><span class="sl-brand__mark">S</span><span class="sl-brand__text">SLOYKA</span></span>
    <span style="width:1px;height:24px;background:var(--sl-border)"></span>
    <span class="sl-topbar__title">Панель администрирования</span>
    <div class="sl-topbar__end"><button class="sl-btn sl-btn--sm"><i data-ic="arrow-left"></i><span class="sl-hide-sm">Мониторинг</span></button><button class="sl-btn sl-btn--sm sl-btn--icon" aria-label="Тёмная тема"><i data-ic="moon"></i></button><button class="sl-btn sl-btn--sm" aria-label="ОД 12 — аккаунт"><i data-ic="user"></i><span class="sl-hide-sm">ОД 12</span></button><button class="sl-btn sl-btn--sm sl-btn--icon sl-btn--danger" aria-label="Выйти"><i data-ic="power"></i></button></div>
  </header>`,
};

export const Playground = {
  name: 'Песочница',
  args: { mark: 'S', brand: 'SLOYKA', title: 'Панель администрирования', back: 'Мониторинг', user: 'ОД 12', theme: true, logout: true },
  argTypes: {
    mark: { name: 'Знак (1–2 буквы)', control: 'text' },
    brand: { name: 'Название продукта', control: 'text' },
    title: { name: 'Название раздела', control: 'text' },
    back: { name: 'Кнопка перехода (пусто — нет)', control: 'text' },
    user: { name: 'Пользователь', control: 'text' },
    theme: { name: 'Кнопка темы', control: 'boolean' },
    logout: { name: 'Кнопка выхода', control: 'boolean' },
  },
  render: a => `<header class="sl-topbar" style="border-radius:var(--sl-r-md)">
    <span class="sl-brand"><span class="sl-brand__mark">${a.mark}</span><span class="sl-brand__text">${a.brand}</span></span>
    <span class="sl-topbar__title" style="margin-left:12px">${a.title}</span>
    <div class="sl-topbar__end">
      ${a.back ? `<button class="sl-btn sl-btn--sm"><i data-ic="arrow-left"></i><span class="sl-hide-sm">${a.back}</span></button>` : ''}
      ${a.theme ? '<button class="sl-btn sl-btn--sm sl-btn--icon" aria-label="Тёмная тема"><i data-ic="moon"></i></button>' : ''}
      ${a.user ? `<button class="sl-btn sl-btn--sm" aria-label="${a.user} — аккаунт"><i data-ic="user"></i><span class="sl-hide-sm">${a.user}</span></button>` : ''}
      ${a.logout ? '<button class="sl-btn sl-btn--sm sl-btn--icon sl-btn--danger" aria-label="Выйти"><i data-ic="power"></i></button>' : ''}
    </div></header>`,
};
