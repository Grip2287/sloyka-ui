// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/24 · Боковое меню: полное и рейл',
  tags: ["autodocs", "progressive"],
  parameters: {"docs": {"description": {"component": "Одно и то же меню. Слева полное (широкие экраны), справа узкий рейл с иконками и подписями (планшет). На телефоне выезжает по кнопке — см. отдельные скриншоты shell-*."}}, "progressiveText": ["Пользователи", "Устройства"]},
};

export const Default = {
  name: 'Боковое меню: полное и рейл',
  render: () => `<div class="row" style="align-items:stretch;gap:16px">
    <nav class="sl-nav" style="border-radius:var(--sl-r-lg)" data-nav></nav>
    <nav class="sl-nav sl-nav--rail" style="border-radius:var(--sl-r-lg)" data-nav></nav>
  </div>`,
};
