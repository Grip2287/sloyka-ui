// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/06 · Карточка объекта',
  tags: ["autodocs"],
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
