# Компоненты Sloyka — разметка для копирования

Сгенерировано `node scripts/gen-components-md.js` из историй Storybook. Иконки: `<i data-ic="имя">` + `slHydrateIcons()` или `slIcon(имя)`.

## Админка

Верхняя панель, боковое меню и основная область. Сузьте окно, чтобы увидеть рейл и выезжающее меню.

### Устройства

```html
<sl-shell class="sl-shell">
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
  </main></sl-shell>
```

## 01 · Кнопки

Основная (тёмная), обычная, без рамки, капсом, иконочные, малые, опасное действие, недоступная, группа кнопок карты.

### Кнопки

```html
<div class="row">
    <button class="sl-btn sl-btn--primary">Сохранить</button>
    <button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>Добавить устройство</button>
    <button class="sl-btn"><i data-ic="refresh"></i>Обновить</button>
    <button class="sl-btn"><i data-ic="arrow-left"></i>Мониторинг</button>
    <button class="sl-btn sl-btn--ghost">Отмена</button>
  </div>
  <div class="row">
    <button class="sl-btn sl-btn--primary sl-btn--caps sl-btn--lg">Войти</button>
    <button class="sl-btn sl-btn--caps"><i data-ic="plus"></i>Создать тревогу</button>
    <button class="sl-btn sl-btn--sm">Скачать архив</button>
    <button class="sl-btn sl-btn--sm">Новый ключ</button>
    <button class="sl-btn" disabled>Обновить устаревшие</button>
  </div>
  <div class="row">
    <button class="sl-btn sl-btn--icon" aria-label="Фильтр"><i data-ic="filter"></i></button>
    <button class="sl-btn sl-btn--icon" aria-label="Тема"><i data-ic="moon"></i></button>
    <button class="sl-btn"><i data-ic="user"></i>ОД 12</button>
    <button class="sl-btn sl-btn--icon sl-btn--danger" aria-label="Выйти"><i data-ic="power"></i></button>
    <button class="sl-btn sl-btn--icon sl-btn--primary" aria-label="Отправить"><i data-ic="arrow-right"></i></button>
    <span style="width:16px"></span>
    <div class="sl-btn-group"><button class="sl-btn sl-btn--icon" aria-label="Приблизить"><i data-ic="plus"></i></button><button class="sl-btn sl-btn--icon" aria-label="Отдалить"><i data-ic="minus"></i></button><button class="sl-btn sl-btn--icon" aria-label="Во весь экран"><i data-ic="maximize"></i></button></div>
  </div>
```

## 02 · Поля ввода

Поле с подписью, с ошибкой, поиск, выпадающий список, многострочное, строка сообщения с кнопкой отправки.

### Поля ввода

```html
<div class="g2">
    <label class="sl-field"><span class="sl-label">Имя пользователя</span><input class="sl-input" placeholder="Введите логин"></label>
    <label class="sl-field"><span class="sl-label">Пароль</span><input class="sl-input" type="password" value="12345" aria-invalid="true"><span class="sl-error">Неверный пароль</span></label>
    <label class="sl-search"><i data-ic="search"></i><input class="sl-input" placeholder="Поиск устройства…"></label>
    <select class="sl-select" aria-label="Все статусы"><option>Все статусы</option><option>На связи</option></select>
  </div>
  <label class="sl-field"><span class="sl-label">Текст оповещения</span><textarea class="sl-textarea">Внимание. Проверка системы оповещения.</textarea><span class="sl-hint">До 500 символов</span></label>
  <div class="sl-compose"><input class="sl-input" placeholder="Сообщение в канал «Дежурная смена»…"><button class="sl-btn sl-btn--icon sl-btn--primary" aria-label="Отправить"><i data-ic="arrow-right"></i></button></div>
```

## 03 · Переключатели

Сегментированный переключатель (вид карты, режимы), тумблер, чекбокс и радиокнопка.

### Переключатели

```html
<div class="col">
    <sl-segmented class="sl-segmented sl-segmented--block"><button>Без зон</button><button>Рабочий</button><button aria-pressed="true">Всё</button></sl-segmented>
    <sl-segmented class="sl-segmented"><button>Схема</button><button aria-pressed="true">Спутник</button></sl-segmented>
    <sl-segmented class="sl-segmented"><button>Авто</button><button>Оба</button><button aria-pressed="true">Подавление</button><button>Обнаружение</button><button>Скрыть</button></sl-segmented>
  </div>
  <div class="row" style="gap:24px">
    <label class="sl-switch"><input type="checkbox" checked>Зоны охраны</label>
    <label class="sl-switch"><input type="checkbox">Птицы и шум</label>
    <label class="sl-check"><input type="checkbox" checked>Запомнить</label>
    <label class="sl-check"><input type="radio" name="r" checked>По приборам</label>
    <label class="sl-check"><input type="radio" name="r">Единой площадью</label>
  </div>
```

## 04 · Теги и счётчики

Тег роли, тег-количество, цветные теги, счётчики в группах и меню, «чип» с числом.

### Теги и счётчики

```html
<div class="row">
    <span class="sl-tag">Администратор</span>
    <span class="sl-tag">Оператор</span>
    <span class="sl-tag sl-tag--solid">Центр</span>
    <span class="sl-tag">2 устройства</span>
    <span class="sl-tag sl-tag--ok">Доступен</span>
    <span class="sl-tag sl-tag--warn">Предупреждение</span>
    <span class="sl-tag sl-tag--crit">Удаление</span>
  </div>
  <div class="row">
    <span class="sl-count">6</span><span class="sl-count sl-count--solid">4</span><span class="sl-count">128</span>
    <span class="sl-chip">На линии <span class="sl-count">1</span></span>
    <span class="sl-chip"><i data-ic="bell"></i>Голосовое оповещение</span>
  </div>
```

## 05 · Статусы

Точка + подпись капсом: на связи, предупреждение, нет связи, отключён, офлайн (полая точка). Обычный текстовый статус и плашка «Система в норме».

### Статусы

```html
<div class="row" style="gap:22px">
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
  </div>
```

## 06 · Карточка объекта

Цветная полоса слева по статусу, параметры «название — значение», статус внизу. Вариант для пользователя с иконкой и тегом.

### Карточка объекта

```html
<div class="g2">
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
  </div>
```

## 07 · Карточка показателя

Нагрузка процессора, памяти, диска: значение, оценка, полоса заполнения.

### Карточка показателя

```html
<div class="g3">
    <div class="sl-card"><span class="sl-caps">Процессор</span><div class="sl-card__head"><span class="sl-metric__value">5,3%</span><span class="sl-status sl-status--plain">Умеренная</span></div><div class="sl-progress"><span style="width:6%"></span></div><span class="sl-hint">Ядер: 12</span></div>
    <div class="sl-card"><span class="sl-caps">Память</span><div class="sl-card__head"><span class="sl-metric__value">78,2%</span><span class="sl-status sl-status--warn sl-status--plain">Повышенная</span></div><div class="sl-progress sl-progress--warn"><span style="width:78%"></span></div><span class="sl-hint">Доступно 3,4 из 15,7 ГБ</span></div>
    <div class="sl-card"><span class="sl-caps">Диск</span><div class="sl-card__head"><span class="sl-metric__value">93,4%</span><span class="sl-status sl-status--crit sl-status--plain">Критическая</span></div><div class="sl-progress sl-progress--crit"><span style="width:93%"></span></div><span class="sl-hint">Свободно 61 из 931 ГБ</span></div>
  </div>
```

## 08 · Карточки-ссылки и шаги

Раздел помощи: иконка, заголовок, описание, стрелка. Шаги «С чего начать» с номерами.

### Карточки-ссылки и шаги

```html
<div class="g2">
    <a class="sl-card sl-card--interactive sl-link-card"><i data-ic="bell" class="sl-ic--lg"></i><div><div class="sl-card__title">Работа с тревогой</div><div class="sl-card__sub">Принять, выполнить план, снять, оповестить.</div></div><i data-ic="chevron-right"></i></a>
    <a class="sl-card sl-card--interactive sl-link-card"><i data-ic="users" class="sl-ic--lg"></i><div><div class="sl-card__title">Пользователи и доступ</div><div class="sl-card__sub">Роли, права, блокировка, журналы входов.</div></div><i data-ic="chevron-right"></i></a>
  </div>
  <div class="sl-steps">
    <div class="sl-card sl-step"><span class="sl-step__num">1</span><div class="sl-card__title">Пользователи</div><div class="sl-card__sub">Заведите операторов и старших смены.</div></div>
    <div class="sl-card sl-step"><span class="sl-step__num">2</span><div class="sl-card__title">Карта объекта</div><div class="sl-card__sub">Загрузите карту, обведите периметр.</div></div>
    <div class="sl-card sl-step"><span class="sl-step__num">3</span><div class="sl-card__title">Устройства</div><div class="sl-card__sub">Подключите напрямую или через агента.</div></div>
  </div>
```

## 09 · Баннеры

Сообщение о состоянии раздела: штатно, предупреждение со списком причин и действиями, ошибка.

### Баннеры

```html
<div class="sl-banner"><div class="sl-banner__title"><i data-ic="check"></i>Система работает штатно</div><div class="sl-banner__text">Обновлено в 11:04:59</div></div>
  <div class="sl-banner sl-banner--warn"><div class="sl-banner__title"><i data-ic="alert"></i>План строится, но без части рекомендаций</div>
    <div class="sl-banner__item"><span>Группа «Дежурные силы» не подключена к оповещению</span><button class="sl-btn sl-btn--sm">Подключить группу</button></div>
    <div class="sl-banner__item"><span>Периметр объекта не нанесён на карту</span><button class="sl-btn sl-btn--sm">Открыть карту</button></div></div>
  <div class="sl-banner sl-banner--crit"><div class="sl-banner__title"><i data-ic="alert"></i>Сценарии недоступны</div><div class="sl-banner__text">Причина: устройства не привязаны к периметру объекта.</div></div>
```

## 10 · Сводка цифрами

Счётчики над списком: онлайн, предупреждения, офлайн, всего.

### Сводка цифрами

```html
<div class="sl-stats">
    <div class="sl-stat"><span class="sl-stat__value" style="--c:var(--sl-ok)">10</span><span class="sl-caps">Онлайн</span></div>
    <div class="sl-stat"><span class="sl-stat__value" style="--c:var(--sl-warn)">0</span><span class="sl-caps">Предупр.</span></div>
    <div class="sl-stat"><span class="sl-stat__value">1</span><span class="sl-caps">Офлайн</span></div>
    <div class="sl-stat"><span class="sl-stat__value">11</span><span class="sl-caps">Всего</span></div>
  </div>
```

## 11 · Список с группами

Сворачиваемая группа со счётчиком, строки с названием и статусом, выбранная строка (инверсия), стрелка у строк с подробностями.

### Список с группами

```html
<div class="panel sl-list">
    <sl-group class="sl-group">
      <button class="sl-group__head"><i data-ic="chevron-down"></i>Комплексные средства<span class="sl-count sl-count--solid">4</span></button>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Камера КПП-1</span><span class="sl-status sl-status--ok">Онлайн</span></div></div>
      <div class="sl-row" aria-current="true"><div class="sl-row__main"><span class="sl-row__title">Шлюз-2</span><span class="sl-status sl-status--ok">Онлайн</span></div><i data-ic="chevron-right"></i></div>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Датчик периметра</span><span class="sl-status sl-status--ok">Онлайн</span></div><i data-ic="chevron-right"></i></div>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Шлюз-04</span><span class="sl-status sl-status--hollow">Офлайн <span class="sl-status__note">· Нет связи</span></span></div></div>
    </sl-group>
    <sl-group class="sl-group" data-collapsed><button class="sl-group__head"><i data-ic="chevron-down"></i>Радары<span class="sl-count">1</span></button>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Радар-1</span><span class="sl-status sl-status--ok">Онлайн</span></div></div>
    </sl-group>
  </div>
```

## 12 · Раскрывающиеся разделы

Разделы панели редактирования: стрелка поворачивается, содержимое раскрывается.

### Раскрывающиеся разделы

```html
<div class="panel" style="padding:4px 14px">
    <details class="sl-disclosure" open><summary><i data-ic="chevron-right"></i><span class="sl-caps">Объект</span></summary><div class="sl-disclosure__body">Название, адрес, периметр объекта.</div></details>
    <details class="sl-disclosure"><summary><i data-ic="chevron-right"></i><span class="sl-caps">Состав объекта</span></summary></details>
    <details class="sl-disclosure"><summary><i data-ic="chevron-right"></i><span class="sl-caps">Зоны охраны</span></summary></details>
    <details class="sl-disclosure" style="border:0"><summary><i data-ic="chevron-right"></i><span class="sl-caps">Палитра</span></summary></details>
  </div>
```

## 13 · Таблица

Журнал: заголовки капсом, статус в ячейке, действия справа. На телефоне строки превращаются в карточки. Ниже — пустая таблица.

### Таблица

```html
<div class="sl-table-wrap"><table class="sl-table sl-table--stack">
    <thead><tr><th>Время</th><th>Пользователь</th><th>Событие</th><th>IP-адрес</th><th>Подробности</th></tr></thead>
    <tbody>
      <tr><td data-label="Время">26.11.2026, 11:04</td><td data-label="Пользователь"><b>ivanov</b></td><td data-label="Событие"><span class="sl-status sl-status--ok">Вход</span></td><td data-label="IP">127.0.0.1</td><td data-label="Подробности" class="sl-muted">Chrome 156 · Windows</td></tr>
      <tr><td data-label="Время">26.11.2026, 10:40</td><td data-label="Пользователь"><b>admin</b></td><td data-label="Событие"><span class="sl-status sl-status--crit">Ошибка входа</span></td><td data-label="IP">127.0.0.1</td><td data-label="Подробности">Пользователь не найден</td></tr>
      <tr><td data-label="Время">26.11.2026, 09:49</td><td data-label="Пользователь"><b>petrov</b></td><td data-label="Событие"><span class="sl-status">Изменение</span></td><td data-label="IP">10.0.0.12</td><td data-label="Подробности" class="sl-muted">Яндекс Браузер 26</td></tr>
    </tbody></table></div>
  <div class="sl-table-wrap"><table class="sl-table"><thead><tr><th>Время</th><th>Категория</th><th>Уровень</th><th>Сообщение</th></tr></thead>
    <tbody><tr><td colspan="4"><div class="sl-empty"><i data-ic="pulse"></i>Событий нет</div></td></tr></tbody></table></div>
```

## 14 · Пустое состояние и загрузка файла

Пунктирная зона: что сделать и кнопка действия.

### Пустое состояние и загрузка файла

```html
<div class="sl-dropzone sl-empty"><i data-ic="upload"></i><div class="sl-empty__title">Карты не загружены</div><div>Загрузите файл карты (.mbtiles или .zip с плитками) — она появится без интернета.</div><button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>Загрузить карту</button></div>
```

## 15 · Заголовок страницы и панель фильтров

Заголовок раздела капсом с линией, ряд фильтров слева и главное действие справа, подзаголовок секции.

### Заголовок страницы и панель фильтров

```html
<div class="sl-page-head"><h1 class="sl-page-title">Устройства</h1><span class="lbl">Сервер работает 31 мин</span></div>
  <div class="sl-toolbar">
    <label class="sl-search"><i data-ic="search"></i><input class="sl-input" placeholder="Поиск по названию и адресу"></label>
    <select class="sl-select" aria-label="Все классы"><option>Все классы</option></select>
    <select class="sl-select" aria-label="Все состояния"><option>Все состояния</option></select>
    <div class="sl-toolbar__end"><button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>Добавить устройство</button></div>
  </div>
  <h2 class="sl-section-title">Использование ресурсов сервера</h2>
```

## 16 · Верхняя панель админки

Знак продукта (заглушка), название раздела, справа переход, тема, аккаунт, выход.

### Верхняя панель админки

```html
<header class="sl-topbar" style="border-radius:var(--sl-r-md)">
    <span class="sl-brand"><span class="sl-brand__mark">S</span><span class="sl-brand__text">SLOYKA</span></span>
    <span style="width:1px;height:24px;background:var(--sl-border)"></span>
    <span class="sl-topbar__title">Панель администрирования</span>
    <div class="sl-topbar__end"><button class="sl-btn sl-btn--sm"><i data-ic="arrow-left"></i><span class="sl-hide-sm">Мониторинг</span></button><button class="sl-btn sl-btn--sm sl-btn--icon" aria-label="Тёмная тема"><i data-ic="moon"></i></button><button class="sl-btn sl-btn--sm" aria-label="ОД 12 — аккаунт"><i data-ic="user"></i><span class="sl-hide-sm">ОД 12</span></button><button class="sl-btn sl-btn--sm sl-btn--icon sl-btn--danger" aria-label="Выйти"><i data-ic="power"></i></button></div>
  </header>
```

## 17 · Строка состояния и плавающие кнопки

Часы и «Система в норме» поверх карты, выбор подсистемы, кнопка нижней панели «Силы и средства».

### Строка состояния и плавающие кнопки

```html
<div class="row" style="align-items:flex-start">
    <div class="sl-statusbar"><div><span class="sl-caps">Астрономическое</span><strong>11:04:18</strong></div><div><span class="sl-caps">Оперативное</span><strong>11:04:18 · 26 ноя 2026</strong></div><div><span class="sl-caps">Система</span><span class="sl-status sl-status--ok">В норме</span></div></div>
    <button class="sl-dock-btn"><i data-ic="grid"></i>Центр<i data-ic="chevron-down"></i></button>
  </div>
  <div class="row"><button class="sl-dock-btn">Силы и средства<i data-ic="chevron-up"></i></button></div>
```

## 18 · Меню аккаунта

Имя и роль, пункты с иконками, разделитель, выход красным.

### Меню аккаунта

```html
<div class="sl-menu" style="width:260px">
    <div class="sl-menu__head"><div class="sl-card__title">ОД</div><div class="sl-card__sub">Администратор</div></div>
    <button class="sl-menu__item"><i data-ic="user"></i>Профиль</button>
    <button class="sl-menu__item"><i data-ic="moon"></i>Тёмная тема</button>
    <div class="sl-menu__sep"></div>
    <button class="sl-menu__item sl-menu__item--danger"><i data-ic="power"></i>Выйти</button>
  </div>
```

## 19 · Выбор из плиток

Всплывающая панель выбора подсистемы: выбранная плитка инвертирована, недоступные с пометкой.

### Выбор из плиток

```html
<div class="sl-picker">
    <span class="sl-caps">Подсистема</span>
    <div class="sl-picker__grid">
      <button class="sl-tile">Центр</button>
      <button class="sl-tile" aria-pressed="true">Видеонаблюдение</button>
      <button class="sl-tile" disabled>Связь<small>В разработке</small></button>
      <button class="sl-tile" disabled>Разведка<small>В разработке</small></button>
      <button class="sl-tile">Периметр</button>
      <button class="sl-tile" disabled>Склад<small>В разработке</small></button>
    </div>
  </div>
```

## 20 · Плавающее окно

Окно поверх карты (чат смены): заголовок с иконкой и закрытием, панель кнопок, содержимое, строка ввода.

### Плавающее окно

```html
<section class="sl-window">
    <div class="sl-window__head"><i data-ic="chat"></i><span class="sl-window__title">Чат смены</span><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    <div class="sl-window__bar"><span class="sl-chip">На линии <span class="sl-count">1</span></span><button class="sl-btn sl-btn--sm">Голосовое оповещение</button></div>
    <div class="sl-window__body">Сообщений пока нет</div>
    <div class="sl-window__foot"><div class="sl-compose"><input class="sl-input" placeholder="Сообщение…"><button class="sl-btn sl-btn--icon sl-btn--primary" aria-label="Отправить"><i data-ic="arrow-right"></i></button></div></div>
  </section>
```

## 21 · Модальное окно

Форма поверх затемнения: заголовок, поля, кнопки внизу.

### Модальное окно

```html
<div style="display:grid;grid-template-columns:minmax(0,420px);justify-content:center;padding:28px;border-radius:var(--sl-r-lg);background:var(--sl-backdrop)"><div class="sl-modal" role="dialog" aria-labelledby="m1">
    <div class="sl-modal__head"><span class="sl-modal__title" id="m1">Новое устройство</span><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    <div class="sl-modal__body">
      <label class="sl-field"><span class="sl-label">Название</span><input class="sl-input" placeholder="Например, Камера КПП-2"></label>
      <div class="g2"><label class="sl-field"><span class="sl-label">Класс</span><select class="sl-select" aria-label="Видео"><option>Видео</option></select></label><label class="sl-field"><span class="sl-label">Адрес</span><input class="sl-input" placeholder="10.0.0.1:9100"></label></div>
      <label class="sl-switch"><input type="checkbox" checked>Принимать данные</label>
    </div>
    <div class="sl-modal__foot"><button class="sl-btn sl-btn--ghost">Отмена</button><button class="sl-btn sl-btn--primary">Добавить</button></div>
  </div></div>
```

### Открыть по кнопке

```html
<button class="sl-btn sl-btn--primary" data-sl-open="demo-modal"><i data-ic="plus"></i>Добавить устройство</button>
<sl-modal id="demo-modal"><dialog class="sl-modal" aria-labelledby="dm-title">
  <div class="sl-modal__head"><span class="sl-modal__title" id="dm-title">Новое устройство</span><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть" data-sl-close><i data-ic="x"></i></button></div>
  <div class="sl-modal__body"><label class="sl-field"><span class="sl-label">Название</span><input class="sl-input" placeholder="Например, Камера КПП-2"></label></div>
  <div class="sl-modal__foot"><button class="sl-btn sl-btn--ghost" data-sl-close>Отмена</button><button class="sl-btn sl-btn--primary" data-sl-close>Добавить</button></div>
</dialog></sl-modal>
```

## 22 · Уведомления и подсказка

Всплывающие уведомления: успех, предупреждение, ошибка. Тёмная подсказка при наведении.

### Уведомления и подсказка

```html
<div class="col">
    <div class="sl-toast" style="--c:var(--sl-ok)"><i data-ic="check" class="sl-toast__icon"></i><div class="sl-toast__body"><span class="sl-toast__title">Устройство добавлено</span><span class="sl-toast__text">Камера КПП-2 появится на карте после размещения.</span></div><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    <div class="sl-toast" style="--c:var(--sl-warn)"><i data-ic="alert" class="sl-toast__icon"></i><div class="sl-toast__body"><span class="sl-toast__title">Связь нестабильна</span><span class="sl-toast__text">Шлюз-04 отвечает с задержкой.</span></div><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    <div class="sl-toast" style="--c:var(--sl-crit)"><i data-ic="alert" class="sl-toast__icon"></i><div class="sl-toast__body"><span class="sl-toast__title">Не удалось загрузить журнал</span><span class="sl-toast__text">Проверьте соединение и обновите страницу.</span></div><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    <span><span class="sl-tooltip">Переключить тему</span></span>
  </div>
```

### Показать уведомление

```html
<div class="row">
  <button class="sl-btn" data-demo-toast="ok">Успех</button>
  <button class="sl-btn" data-demo-toast="warn">Предупреждение</button>
  <button class="sl-btn" data-demo-toast="crit">Ошибка</button>
</div>
```

## 23 · Карточка входа

Знак продукта (заглушка вместо логотипа), поля с подписями, кнопка, подпись внизу.

### Карточка входа

```html
<div style="display:grid;grid-template-columns:minmax(0,340px);justify-content:center;justify-items:center;gap:18px;padding:12px 0">
    <span class="sl-brand" style="font-size:20px"><span class="sl-brand__mark" style="width:40px;height:40px;border-radius:12px;font-size:18px">S</span>SLOYKA</span>
    <form class="sl-login" onsubmit="return false">
      <label class="sl-field"><span class="sl-label">Имя пользователя</span><input class="sl-input" placeholder="Введите логин"></label>
      <label class="sl-field"><span class="sl-label">Пароль</span><input class="sl-input" type="password" placeholder="Введите пароль"></label>
      <button class="sl-btn sl-btn--primary sl-btn--caps sl-btn--lg sl-btn--block">Войти</button>
      <div class="sl-login__foot">Название организации</div>
    </form>
  </div>
```

## 24 · Боковое меню: полное и рейл

Одно и то же меню. Слева полное (широкие экраны), справа узкий рейл с иконками и подписями (планшет). На телефоне выезжает по кнопке — см. отдельные скриншоты shell-*.

### Боковое меню: полное и рейл

```html
<div class="row" style="align-items:stretch;gap:16px">
    <nav class="sl-nav" style="border-radius:var(--sl-r-lg)" data-nav></nav>
    <nav class="sl-nav sl-nav--rail" style="border-radius:var(--sl-r-lg)" data-nav></nav>
  </div>
```
