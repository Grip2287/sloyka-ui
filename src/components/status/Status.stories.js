// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/05 · Статусы',
  tags: ["autodocs", "ref-base"],
  parameters: {"docs": {"description": {"component": "Точка + подпись капсом: на связи, предупреждение, нет связи, отключён, офлайн (полая точка). Обычный текстовый статус и плашка «Система в норме»."}}},
};

export const Default = {
  name: 'Статусы',
  render: () => `<div class="row" style="gap:22px">
    <span class="sl-status sl-status--ok">На связи</span>
    <span class="sl-status sl-status--warn">Предупреждение</span>
    <span class="sl-status sl-status--crit">Нет связи</span>
    <span class="sl-status">Отключён</span>
    <span class="sl-status sl-status--hollow">Офлайн <span class="sl-status__note">· Нет связи</span></span>
  </div>
  <div class="row" style="gap:22px">
    <span class="sl-status sl-status--ok sl-status--plain">Работает</span>
    <span class="sl-status sl-status--warn sl-status--plain">Повышенная нагрузка</span>
    <span class="sl-pill"><span class="sl-status sl-status--ok">В норме</span></span>
  </div>`,
};

export const Playground = {
  name: 'Песочница',
  args: { text: 'На связи', kind: 'ok', style: 'капсом', note: '' },
  argTypes: {
    text: { name: 'Текст', control: 'text' },
    kind: { name: 'Состояние', control: 'inline-radio', options: ['ok', 'warn', 'crit', 'off', 'hollow'] },
    style: { name: 'Начертание', control: 'inline-radio', options: ['капсом', 'обычный'] },
    note: { name: 'Пояснение', control: 'text' },
  },
  render: a => {
    const cls = ['sl-status', ['ok', 'warn', 'crit'].includes(a.kind) && `sl-status--${a.kind}`, a.kind === 'hollow' && 'sl-status--hollow', a.style === 'обычный' && 'sl-status--plain'].filter(Boolean).join(' ');
    return `<span class="${cls}">${a.text}${a.note ? ` <span class="sl-status__note">· ${a.note}</span>` : ''}</span>`;
  },
};
