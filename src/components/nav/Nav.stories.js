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

export const Playground = {
  name: 'Песочница',
  args: { mode: 'полное', items: 'Управление\nusers: Пользователи\nlogin: Журнал входов\nИнтеграции\nplug: Устройства\nmap: Карты\npulse: Логи системы | 3', current: 'Устройства' },
  argTypes: {
    mode: { name: 'Вид меню', control: 'inline-radio', options: ['полное', 'рейл'] },
    items: { name: 'Строки: раздел, или «иконка: пункт | счётчик»', control: 'text' },
    current: { name: 'Текущий пункт', control: 'text' },
  },
  render: a => `<nav class="sl-nav${a.mode === 'рейл' ? ' sl-nav--rail' : ''}" style="border-radius:var(--sl-r-lg)">${a.items.split('\n').filter(Boolean).map(r => {
    if (!r.includes(':')) return `<div class="sl-nav__section sl-caps">${r.trim()}</div>`;
    const [ic, rest] = [r.slice(0, r.indexOf(':')).trim(), r.slice(r.indexOf(':') + 1)];
    const [label, n] = rest.split('|').map(s => s.trim());
    return `<a class="sl-nav__item" href="#"${label === a.current ? ' aria-current="page"' : ''}><i data-ic="${ic}"></i><span class="sl-nav__label">${label}</span>${n ? `<span class="sl-count sl-count--solid">${n}</span>` : ''}</a>`;
  }).join('')}</nav>`,
};
