// Каркас админки: полное меню ≥1200, рейл 768–1199, выезжающее меню <768.
export default {
  title: 'Каркас/Админка',
  tags: ['progressive', "ref-base"],
  parameters: { layout: 'fullscreen', pair: false, progressiveText: ['Устройства', 'Журнал изменений'],
    docs: { description: { component: 'Верхняя панель, боковое меню и основная область. Сузьте окно, чтобы увидеть рейл и выезжающее меню.' } } },
};

export const Default = {
  name: 'Устройства',
  render: () => `<sl-shell class="sl-shell">
  <header class="sl-topbar">
    <button class="sl-btn sl-btn--icon sl-btn--ghost sl-shell__toggle" aria-label="Меню" aria-expanded="false" aria-controls="sl-nav" data-sl-nav-toggle><i data-ic="menu"></i></button>
    <span class="sl-brand"><span class="sl-brand__mark">S</span><span class="sl-brand__text">SLOYKA</span></span>
    <span class="sl-topbar__title" style="margin-left:12px">Панель администрирования</span>
    <div class="sl-topbar__end">
      <button class="sl-btn sl-btn--sm"><i data-ic="arrow-left"></i><span class="sl-hide-sm">Мониторинг</span></button>
      <sl-theme-toggle><button class="sl-btn sl-btn--sm sl-btn--icon" aria-label="Тёмная тема"><i data-ic="moon"></i></button></sl-theme-toggle>
      <button class="sl-btn sl-btn--sm"><i data-ic="user"></i><span class="sl-hide-sm">ОД 12</span></button>
      <button class="sl-btn sl-btn--sm sl-btn--icon sl-btn--danger" aria-label="Выйти"><i data-ic="power"></i></button>
    </div>
  </header>
  <nav class="sl-nav sl-shell__nav" id="sl-nav" aria-label="Разделы" data-nav></nav>
  <div class="sl-shell__backdrop" data-sl-nav-close></div>
  <main class="sl-shell__main">
    <div class="sl-page-head"><h1 class="sl-page-title">Устройства</h1></div>
    <div class="sl-toolbar">
      <label class="sl-search"><i data-ic="search"></i><input class="sl-input" placeholder="Поиск по названию и адресу"></label>
      <select class="sl-select" aria-label="Все классы"><option>Все классы</option></select>
      <select class="sl-select" aria-label="Все состояния"><option>Все состояния</option></select>
      <div class="sl-toolbar__end"><button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>Добавить устройство</button></div>
    </div>
    <div class="sl-banner sl-banner--warn"><div class="sl-banner__title"><i data-ic="alert"></i>2 устройства не размещены на карте</div><div class="sl-banner__text">Разместите их в разделе «Карты», иначе зоны не построятся.</div></div>
    <div class="sl-grid">
      <article class="sl-card" data-accent="crit"><div><div class="sl-card__title">Шлюз-04</div><div class="sl-card__sub">Связь · Шлюз-04</div></div><dl class="sl-kv"><dt>Адрес</dt><dd>10.20.4.25:9100</dd><dt>На карте</dt><dd>не размещён</dd><dt>Последний ответ</dt><dd>—</dd></dl><div class="sl-card__foot"><span class="sl-status sl-status--crit">Нет связи</span></div></article>
      <article class="sl-card" data-accent="ok"><div class="sl-card__head"><div><div class="sl-card__title">Камера КПП-1</div><div class="sl-card__sub">Видео · V-200</div></div><span class="sl-tag">2 устройства</span></div><dl class="sl-kv"><dt>Адрес</dt><dd>10.20.6.88:18080</dd><dt>На карте</dt><dd>размещена</dd><dt>Последний ответ</dt><dd>10:33</dd></dl><div class="sl-card__foot"><span class="sl-status sl-status--ok">На связи</span></div></article>
      <article class="sl-card" data-accent="off"><div><div class="sl-card__title">Датчик периметра</div><div class="sl-card__sub">Охрана · П-3</div></div><dl class="sl-kv"><dt>Адрес</dt><dd>не указан</dd><dt>На карте</dt><dd>не размещён</dd><dt>Последний ответ</dt><dd>10:33</dd></dl><div class="sl-card__foot"><span class="sl-status">Отключён</span></div></article>
    </div>
    <h2 class="sl-section-title">Журнал изменений</h2>
    <div class="sl-table-wrap"><table class="sl-table sl-table--stack">
      <thead><tr><th>Время</th><th>Пользователь</th><th>Действие</th><th>Подробности</th></tr></thead>
      <tbody>
        <tr><td data-label="Время">14.11.2026, 21:19</td><td data-label="Пользователь"><b>ivanov</b></td><td data-label="Действие"><span class="sl-status">Изменение</span></td><td data-label="Подробности">Камера КПП-1: изменён адрес</td></tr>
        <tr><td data-label="Время">02.11.2026, 18:41</td><td data-label="Пользователь"><b>ivanov</b></td><td data-label="Действие"><span class="sl-status sl-status--ok">Создание</span></td><td data-label="Подробности">Создано устройство «Шлюз-04»</td></tr>
        <tr><td data-label="Время">02.11.2026, 18:40</td><td data-label="Пользователь"><b>petrov</b></td><td data-label="Действие"><span class="sl-status sl-status--crit">Удаление</span></td><td data-label="Подробности">Удалено устройство «Шлюз-03»</td></tr>
      </tbody></table></div>
  </main></sl-shell>`,
};

export const Playground = {
  name: 'Песочница',
  args: { brand: 'SLOYKA', title: 'Устройства', banner: '2 устройства не размещены на карте', cards: 3 },
  argTypes: {
    brand: { name: 'Название продукта', control: 'text' },
    title: { name: 'Заголовок страницы', control: 'text' },
    banner: { name: 'Баннер (пусто — нет)', control: 'text' },
    cards: { name: 'Карточек', control: { type: 'range', min: 0, max: 9, step: 1 } },
  },
  render: a => {
    const base = Default.render();
    const cards = Array.from({ length: a.cards }, (_, i) => `<article class="sl-card" data-accent="${['ok', 'warn', 'crit', 'off'][i % 4]}"><div><div class="sl-card__title">Устройство ${i + 1}</div><div class="sl-card__sub">Класс · Модель</div></div><dl class="sl-kv"><dt>Адрес</dt><dd>10.0.0.${i + 1}:9100</dd></dl></article>`).join('');
    return base
      .replace('<span class="sl-brand__text">SLOYKA</span>', `<span class="sl-brand__text">${a.brand}</span>`)
      .replace('<h1 class="sl-page-title">Устройства</h1>', `<h1 class="sl-page-title">${a.title}</h1>`)
      .replace(/<div class="sl-banner sl-banner--warn">[\s\S]*?<\/div><\/div>/, a.banner ? `<div class="sl-banner sl-banner--warn"><div class="sl-banner__title"><i data-ic="alert"></i>${a.banner}</div></div>` : '')
      .replace(/<div class="sl-grid">[\s\S]*?<\/article>\n    <\/div>/, `<div class="sl-grid">${cards}</div>`);
  },
};
