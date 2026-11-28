# sloyka

## 2.0.0

### Major Changes

- 1cee050: Нативные компоненты (HTML + CSS) рядом с React.
  
  - Каждый компонент 01–24 теперь есть и в нативном варианте: готовая разметка в `sloyka/native/<компонент>.html`, справочник `agents/native-components.md`, машиночитаемо `sloyka/native/components.json`. Разметка генерируется из React-компонентов, поэтому выглядит один в один.
  - Компонентам с поведением прилагается свой скрипт `sloyka/native/<компонент>.js`: модальное окно (`data-sl-open` / `data-sl-close`, Esc, затемнение, фокус), меню, тема (`theme.js` + `theme-head.js`), уведомления (`slToast.ok()`), сворачиваемая группа, подсказка, сегменты, строка сообщения, меню на телефоне, плавающее окно.
  - ИИ-агенты выбирают способ сборки сами: слово «Предикат» в запросе (в любой форме) или «только HTML и CSS» — нативные компоненты, иначе React. Пример: «я хочу написать модуль для предикат. Создай мне админ панель используя библиотеку sloyka».
  - `sloyka-check` проверяет `.html`: новые правила `native-unknown-class`, `native-own-class`, `native-own-tag`, `native-no-inline-style`, `native-no-style-tag`, `native-js-markup`.
  - Storybook: панель «Код» у каждого примера — вкладки «React», «HTML + CSS» и «JS компонента».
  - Меню аккаунта (18): кнопка-аватар `trigger={{ label, initials }}` открывает меню; Esc, щелчок снаружи и выбор пункта закрывают.
  - Новый компонент создаётся сразу в двух вариантах: `npm run new:component`.
  - Атрибут `hidden` всегда прячет элемент, даже если у компонента задан `display`.

<!-- release-notes:start -->

### Что нового и где лежит

#### Добавлено

Ничего.

#### Изменено

- **Menu** (18): новый проп `defaultOpen`
- **Menu** (18): новый проп `onOpenChange`
- **Menu** (18): новый проп `open`
- **Menu** (18): новый проп `trigger`

#### Удалено

Ничего.

#### Нужно поправить в сайтах

Ничего: обновление без правок. После обновления запустите `npx sloyka-check src`.

<!-- release-notes:end -->

## 1.0.1

### Patch Changes

- 489fcaf: Исправлено: компоненты в 1.0.0 были собраны в режиме разработки (`jsxDEV`), из-за чего боевая сборка Next.js падала на пререндере (`jsxDEV is not a function`). Теперь пакет всегда собирается как production; тест следит за этим.
  
  Документация: установка через pnpm и yarn (`pnpm add sloyka`, `pnpm exec sloyka-check`), проверка встраивается в команду `build` (`"build": "sloyka-check src && vite build"`) — так она работает во всех менеджерах пакетов.
  
  Storybook (витрина компонентов) в npm-пакет не входит — он запускается из репозитория: `git clone https://github.com/Grip2287/sloyka-ui`, затем `npm install` и `npm run storybook` (http://localhost:6006). Как пользоваться — темы, ширины, песочница Controls, шаблоны и референсы — в `docs/GUIDE.md`, раздел «Storybook — витрина компонентов».

<!-- release-notes:start -->

### Что нового и где лежит

#### Добавлено

Ничего.

#### Изменено

Ничего.

#### Удалено

Ничего.

#### Нужно поправить в сайтах

Ничего: обновление без правок. После обновления запустите `npx sloyka-check src`.

<!-- release-notes:end -->

## 1.0.0

### Major Changes

- afd3418: Sloyka 1.0 — React-библиотека. HTML-версия и веб-компоненты 0.1.x удалены (они остаются в `@grip2287/sloyka@0.1.0` и теге `v0.1.0`). Пакет называется `sloyka` и публикуется на npmjs.com. Сайты собираются только из компонентов: проверка `sloyka-check`, правила `sloyka/eslint` и `sloyka/stylelint`. Инструкция: `docs/GUIDE.md`; для ИИ-агентов (Codex, Cursor, Copilot, Gemini CLI) — `agents/sloyka.md` в пакете.

<!-- release-notes:start -->

### Что нового и где лежит

Первый выпуск React-версии: 65 компонентов в группах 00–24. Справочник: `docs/GUIDE.md`, полный список props: `sloyka/components.json`.

- **00 · Основа:** Form, Grid, Icon, Image, Link, Page, Stack, Text, ThemeProvider, ThemeScript, ThemeToggle
- **01 · Кнопки:** Button, ButtonGroup
- **02 · Поля ввода:** Compose, Field, Search, Select, Textarea
- **03 · Переключатели:** Checkbox, Radio, RadioGroup, Segmented, Switch
- **04 · Теги и счётчики:** Chip, Count, Tag
- **05 · Статусы:** Status, StatusPill
- **06 · Карточка объекта:** Card, Card.Foot, Card.Head, KeyValue
- **07 · Карточка показателя:** Metric
- **08 · Карточки-ссылки и шаги:** LinkCard, Steps
- **09 · Баннеры:** Banner, Banner.Item
- **10 · Сводка цифрами:** Stats
- **11 · Список с группами:** Group, List, Row
- **12 · Раскрывающиеся разделы:** Disclosure
- **13 · Таблица:** Table
- **14 · Пустое состояние и загрузка файла:** Dropzone, Empty
- **15 · Заголовок страницы и панель фильтров:** PageHeader, Toolbar, Toolbar.End
- **16 · Верхняя панель админки:** Topbar
- **17 · Строка состояния и плавающие кнопки:** DockButton, StatusBar
- **18 · Меню аккаунта:** Menu, Menu.Item, Menu.Separator
- **19 · Выбор из плиток:** Picker, Tile
- **20 · Плавающее окно:** Window
- **21 · Модальное окно:** Modal
- **22 · Уведомления и подсказка:** ToastProvider, Tooltip
- **23 · Карточка входа:** Login
- **24 · Боковое меню: полное и рейл:** Nav, Nav.Item, Nav.Section, Shell

<!-- release-notes:end -->

## 0.1.0

### Minor Changes

- 907222d: Первая версия: 24 группы компонентов операторской панели, каркас с адаптивным меню, светлая и тёмная тема, Storybook.
