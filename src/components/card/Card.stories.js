// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/06 · Карточка объекта',
  tags: ["autodocs", "ref-base"],
  parameters: {"docs": {"description": {"component": "Цветная полоса слева по статусу, параметры «название — значение», статус внизу. Вариант для пользователя с иконкой и тегом."}}},
};

export const Default = {
  name: 'Карточка объекта',
  render: () => `<div class="g2">
    <article class="sl-card sl-card--interactive" data-accent="crit">
      <div class="sl-card__head"><div><div class="sl-card__title">Шлюз-04</div><div class="sl-card__sub">Связь · Шлюз-04</div></div></div>
      <dl class="sl-kv"><dt>Адрес</dt><dd>10.20.4.25:9100</dd><dt>На карте</dt><dd>не размещён</dd><dt>Последний ответ</dt><dd class="sl-muted">не поступало</dd></dl>
      <div class="sl-card__foot"><span class="sl-status sl-status--crit">Нет связи</span><button class="sl-btn sl-btn--sm sl-btn--ghost">Подробнее<i data-ic="chevron-right"></i></button></div>
    </article>
    <article class="sl-card sl-card--interactive" data-accent="ok">
      <div class="sl-card__head"><div><div class="sl-card__title">Камера КПП-1</div><div class="sl-card__sub">Видео · Модель V-200</div></div><span class="sl-tag">2 устройства</span></div>
      <dl class="sl-kv"><dt>Адрес</dt><dd>10.20.6.88:18080</dd><dt>На карте</dt><dd>размещена</dd><dt>Последний ответ</dt><dd>10:33</dd></dl>
      <div class="sl-card__foot"><span class="sl-status sl-status--ok">На связи</span></div>
    </article>
    <article class="sl-card" data-accent="ok">
      <div class="sl-card__head"><div style="display:flex;gap:12px;align-items:center"><span class="sl-avatar"><i data-ic="shield"></i></span><div><div class="sl-card__title">ivanov</div><div class="sl-card__sub">Иванов И. И.</div></div></div><span class="sl-tag">Администратор</span></div>
      <dl class="sl-kv"><dt>Должность</dt><dd>Дежурный</dd><dt>Последний вход</dt><dd>26.11.2026, 10:43</dd><dt>Посты</dt><dd><span class="sl-tag">Центр</span> <span class="sl-tag">Пост 2</span></dd></dl>
      <div class="sl-card__foot"><span class="sl-status sl-status--ok">Активен</span></div>
    </article>
    <article class="sl-card" data-accent="off">
      <div class="sl-card__head"><div><div class="sl-card__title">Сбор дежурной смены</div></div></div>
      <div style="color:var(--sl-text-2)">Внимание. Дежурной смене прибыть на пост охраны. Оповещение проводит дежурный оператор.</div>
      <div class="sl-card__foot"><span class="sl-status">Отключён</span></div>
    </article>
  </div>`,
};

export const Playground = {
  name: 'Песочница',
  args: { title: 'Камера КПП-1', subtitle: 'Видео · Модель V-200', accent: 'ok', tag: '2 устройства', rows: 'Адрес: 10.20.6.88:18080\nНа карте: размещена\nПоследний ответ: 10:33', status: 'На связи', interactive: true },
  argTypes: {
    title: { name: 'Заголовок', control: 'text' },
    subtitle: { name: 'Подзаголовок', control: 'text' },
    accent: { name: 'Полоса слева', control: 'inline-radio', options: ['ok', 'warn', 'crit', 'off', 'нет'] },
    tag: { name: 'Тег справа', control: 'text' },
    rows: { name: 'Строки «название: значение»', control: 'text' },
    status: { name: 'Статус внизу', control: 'text' },
    interactive: { name: 'Подъём при наведении', control: 'boolean' },
  },
  render: a => {
    const rows = a.rows.split('\n').filter(Boolean).map(r => { const [k, ...v] = r.split(':'); return `<dt>${k.trim()}</dt><dd>${v.join(':').trim()}</dd>`; }).join('');
    const st = { ok: 'sl-status--ok', warn: 'sl-status--warn', crit: 'sl-status--crit' }[a.accent] || '';
    return `<article class="sl-card${a.interactive ? ' sl-card--interactive' : ''}"${a.accent !== 'нет' ? ` data-accent="${a.accent}"` : ''} style="max-width:380px">
      <div class="sl-card__head"><div><div class="sl-card__title">${a.title}</div>${a.subtitle ? `<div class="sl-card__sub">${a.subtitle}</div>` : ''}</div>${a.tag ? `<span class="sl-tag">${a.tag}</span>` : ''}</div>
      ${rows ? `<dl class="sl-kv">${rows}</dl>` : ''}
      ${a.status ? `<div class="sl-card__foot"><span class="sl-status ${st}">${a.status}</span></div>` : ''}</article>`;
  },
};
