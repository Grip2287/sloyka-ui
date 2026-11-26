// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/16 · Верхняя панель админки',
  tags: ["autodocs"],
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
