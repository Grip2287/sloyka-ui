export default { title: 'Основа/Токены', argTypes: { slScale: { table: { disable: true } }, slRadius: { table: { disable: true } } }, parameters: { docs: { description: { component: 'Цвета, размеры текста и радиусы. Меняются только здесь — компоненты берут всё из токенов.' } } } };

const COLORS = ['bg', 'surface', 'surface-2', 'surface-hover', 'rail', 'text', 'text-2', 'text-3', 'border', 'border-soft', 'border-strong', 'inverse', 'on-inverse', 'ok', 'ok-bg', 'warn', 'warn-bg', 'crit', 'crit-bg', 'off'];

export const Colors = {
  name: 'Цвета',
  render: () => (
    <div className="g3">
      {COLORS.map((c) => (
        <div key={c} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ width: 36, height: 36, borderRadius: 'var(--sl-r-sm)', background: `var(--sl-${c})`, border: '1px solid var(--sl-border)' }} />
          <code style={{ fontSize: 12, color: 'var(--sl-text-2)' }}>--sl-{c}</code>
        </div>
      ))}
    </div>
  ),
};

export const Type = {
  name: 'Текст и радиусы',
  render: () => (
    <div className="col">
      <div style={{ fontSize: 'var(--sl-fs-h1)', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>Заголовок страницы · 20</div>
      <div style={{ fontSize: 'var(--sl-fs-title)', fontWeight: 600 }}>Заголовок окна · 16</div>
      <div style={{ fontSize: 'var(--sl-fs-strong)', fontWeight: 600 }}>Заголовок карточки · 14</div>
      <div>Основной текст · 13</div>
      <div style={{ fontSize: 'var(--sl-fs-small)', color: 'var(--sl-text-2)' }}>Мелкий текст · 12</div>
      <div className="sl-caps">Подпись капсом · 11</div>
      <div className="row">
        {['xs', 'sm', 'md', 'lg'].map((r) => (
          <span key={r} style={{ width: 64, height: 40, border: '1px solid var(--sl-border-strong)', borderRadius: `var(--sl-r-${r})`, display: 'grid', placeItems: 'center', fontSize: 11 }}>{r}</span>
        ))}
      </div>
    </div>
  ),
};
