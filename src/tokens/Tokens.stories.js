export default { title: 'Основа/Токены', argTypes: { slScale: { table: { disable: true } }, slRadius: { table: { disable: true } } }, parameters: { docs: { description: { component: 'Цвета, размеры текста и радиусы. Меняются только здесь — компоненты берут всё из токенов.' } } } };
const COLORS = ['bg', 'surface', 'surface-2', 'surface-hover', 'rail', 'text', 'text-2', 'text-3', 'border', 'border-soft', 'border-strong', 'inverse', 'on-inverse', 'ok', 'ok-bg', 'warn', 'warn-bg', 'crit', 'crit-bg', 'off'];
export const Colors = {
  name: 'Цвета',
  render: () => `<div class="g3">${COLORS.map(c => `<div style="display:flex;gap:10px;align-items:center"><span style="width:36px;height:36px;border-radius:var(--sl-r-sm);background:var(--sl-${c});border:1px solid var(--sl-border)"></span><code style="font-size:12px;color:var(--sl-text-2)">--sl-${c}</code></div>`).join('')}</div>`,
};
export const Type = {
  name: 'Текст и радиусы',
  render: () => `<div class="col">
    <div style="font-size:var(--sl-fs-h1);font-weight:600;letter-spacing:.04em;text-transform:uppercase">Заголовок страницы · 20</div>
    <div style="font-size:var(--sl-fs-title);font-weight:600">Заголовок окна · 16</div>
    <div style="font-size:var(--sl-fs-strong);font-weight:600">Заголовок карточки · 14</div>
    <div>Основной текст · 13</div><div style="font-size:var(--sl-fs-small);color:var(--sl-text-2)">Мелкий текст · 12</div>
    <div class="sl-caps">Подпись капсом · 11</div>
    <div class="row">${['xs', 'sm', 'md', 'lg'].map(r => `<span style="width:64px;height:40px;border:1px solid var(--sl-border-strong);border-radius:var(--sl-r-${r});display:grid;place-items:center;font-size:11px">${r}</span>`).join('')}</div>
  </div>`,
};
