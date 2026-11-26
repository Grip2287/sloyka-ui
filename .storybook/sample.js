// Пример панели для редактора темы и страницы «Мой шаблон»: по одному экземпляру основных компонентов.
export const SAMPLE = `
  <header class="sl-topbar" style="border-radius:var(--sl-r-md)"><span class="sl-brand"><span class="sl-brand__mark">S</span><span class="sl-brand__text">SLOYKA</span></span><span class="sl-topbar__title" style="margin-left:12px">Панель</span>
    <div class="sl-topbar__end"><button class="sl-btn sl-btn--sm sl-btn--icon" aria-label="Тёмная тема"><i data-ic="moon"></i></button><button class="sl-btn sl-btn--sm sl-btn--icon sl-btn--danger" aria-label="Выйти"><i data-ic="power"></i></button></div></header>
  <div class="sl-page-head"><h1 class="sl-page-title">Устройства</h1></div>
  <div class="sl-toolbar"><label class="sl-search"><i data-ic="search"></i><input class="sl-input" placeholder="Поиск"></label><select class="sl-select" aria-label="Все классы"><option>Все классы</option></select>
    <div class="sl-toolbar__end"><button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>Добавить устройство</button></div></div>
  <div class="row"><button class="sl-btn"><i data-ic="refresh"></i>Обновить</button><button class="sl-btn sl-btn--ghost">Отмена</button>
    <sl-segmented class="sl-segmented"><button>Схема</button><button aria-pressed="true">Спутник</button></sl-segmented>
    <label class="sl-switch"><input type="checkbox" checked>Зоны охраны</label><span class="sl-tag">Администратор</span><span class="sl-chip">На линии <span class="sl-count">1</span></span></div>
  <div class="sl-banner sl-banner--warn"><div class="sl-banner__title"><i data-ic="alert"></i>2 устройства не размещены на карте</div></div>
  <div class="sl-stats" style="max-width:420px"><div class="sl-stat"><span class="sl-stat__value" style="--c:var(--sl-ok)">10</span><span class="sl-caps">Онлайн</span></div><div class="sl-stat"><span class="sl-stat__value">1</span><span class="sl-caps">Офлайн</span></div></div>
  <div class="g2">
    <article class="sl-card" data-accent="ok"><div class="sl-card__head"><div><div class="sl-card__title">Камера КПП-1</div><div class="sl-card__sub">Видео · V-200</div></div><span class="sl-tag">2 устройства</span></div>
      <dl class="sl-kv"><dt>Адрес</dt><dd>10.20.6.88:18080</dd><dt>Последний ответ</dt><dd>10:33</dd></dl><div class="sl-card__foot"><span class="sl-status sl-status--ok">На связи</span></div></article>
    <div class="sl-card"><span class="sl-caps">Память</span><div class="sl-card__head"><span class="sl-metric__value">78%</span><span class="sl-status sl-status--warn sl-status--plain">Повышенная</span></div><div class="sl-progress sl-progress--warn"><span style="width:78%"></span></div></div>
  </div>
  <div class="sl-list panel" style="max-width:420px"><div class="sl-row" aria-current="true"><div class="sl-row__main"><span class="sl-row__title">Шлюз-2</span><span class="sl-status sl-status--ok">Онлайн</span></div></div><div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Шлюз-04</span><span class="sl-status sl-status--hollow">Офлайн</span></div></div></div>
  <div class="sl-table-wrap"><table class="sl-table sl-table--stack"><thead><tr><th>Время</th><th>Пользователь</th><th>Событие</th></tr></thead>
    <tbody><tr><td data-label="Время">26.11.2026, 11:04</td><td data-label="Пользователь"><b>ivanov</b></td><td data-label="Событие"><span class="sl-status sl-status--ok">Вход</span></td></tr></tbody></table></div>
  <div class="row" style="align-items:flex-start"><div class="sl-toast" style="--c:var(--sl-ok)"><i data-ic="check" class="sl-toast__icon"></i><div class="sl-toast__body"><span class="sl-toast__title">Сохранено</span></div></div>
    <div class="sl-menu" style="width:220px"><button class="sl-menu__item"><i data-ic="user"></i>Профиль</button><button class="sl-menu__item sl-menu__item--danger"><i data-ic="power"></i>Выйти</button></div></div>`;
