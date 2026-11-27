# sloyka

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
