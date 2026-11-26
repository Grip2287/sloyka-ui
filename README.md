# Sloyka

Библиотека компонентов для операторских панелей и админок. В ней светлая и тёмная тема и адаптив под телефон, планшет и монитор. Работает в любом стеке: чистый HTML, React, Vue, Astro.

- **CSS-основа**: токены (цвета, шрифт Inter, размеры) и классы `sl-*` в каскадных слоях `@layer sl.*`. Стили вашего сайта всегда сильнее библиотеки, `!important` не нужен.
- **Поведение**: маленькие веб-компоненты без зависимостей. Это выезжающее меню, сворачиваемые группы, переключатели, тема, модалка и уведомления.
- **Витрина**: Storybook. В нём каждый компонент показан в двух темах и на любой ширине экрана.

> Пакет приватный: пользоваться им могут только те, кому владелец открыл доступ к репозиторию `Grip2287/sloyka-ui`.

## Установка

1. Получите доступ к репозиторию у владельца.
2. Создайте на GitHub личный токен (Settings → Developer settings → Personal access tokens) с правом `read:packages`.
3. Положите в корень проекта файл `.npmrc` (пример есть в `.npmrc.example`) и не коммитьте его:
   ```
   @grip2287:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=ВАШ_ТОКЕН
   ```
4. Установите пакет с точной версией:
   ```
   npm i @grip2287/sloyka@0.1.0
   ```

## Подключение

**Со сборщиком (Vite, Next, Nuxt, Astro):**
```js
import '@grip2287/sloyka/css';   // все стили
import '@grip2287/sloyka';       // поведение (меню, модалка, тема, уведомления)
```

**Без сборщика:** скопируйте папку `node_modules/@grip2287/sloyka/dist` на сайт и подключите:
```html
<link rel="stylesheet" href="/sloyka/sloyka.min.css">
<script type="module" src="/sloyka/sloyka.js"></script>
```

**Только нужные компоненты:** `core.css` (токены, шрифт, база) и файлы из `dist/components/`:
```html
<link rel="stylesheet" href="/sloyka/core.css">
<link rel="stylesheet" href="/sloyka/components/button.css">
```

**Тема без мигания при загрузке.** Вставьте эту строку в `<head>` до стилей:
```html
<script>try{var t=localStorage.getItem('sl-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script>
```
Тему задаёт атрибут `data-theme="light"` или `"dark"` на `<html>` (или на любом блоке). Если атрибута нет, тема берётся из настроек системы.

**React 19** понимает веб-компоненты напрямую: `<sl-shell class="sl-shell">…</sl-shell>`. В JSX пишите `className` у обычных тегов, а у `sl-*` можно оставить `class`.

## Каркас страницы

```html
<sl-shell class="sl-shell">
  <header class="sl-topbar">
    <button class="sl-btn sl-btn--icon sl-btn--ghost sl-shell__toggle" data-sl-nav-toggle aria-controls="sl-nav" aria-label="Меню">☰</button>
    <span class="sl-brand"><span class="sl-brand__mark">S</span><span class="sl-brand__text">ПРОДУКТ</span></span>
    <span class="sl-topbar__title">Панель администрирования</span>
    <div class="sl-topbar__end">
      <sl-theme-toggle><button class="sl-btn sl-btn--sm sl-btn--icon" aria-label="Тёмная тема">◐</button></sl-theme-toggle>
    </div>
  </header>
  <nav class="sl-nav sl-shell__nav" id="sl-nav" aria-label="Разделы">
    <div class="sl-nav__section sl-caps">Интеграции</div>
    <a class="sl-nav__item" href="/devices" aria-current="page"><svg class="sl-ic">…</svg><span class="sl-nav__label">Устройства</span></a>
  </nav>
  <div class="sl-shell__backdrop" data-sl-nav-close></div>
  <main class="sl-shell__main">…</main>
</sl-shell>
```
На ширине от 1200px меню полное, от 768 до 1199px сворачивается в рейл (иконка и подпись), до 768px открывается кнопкой ☰. Если нужно, чтобы меню работало и без JavaScript, сделайте кнопку ссылкой `<a href="#sl-nav">`.

## Компоненты

| Группа | Классы и теги |
|---|---|
| Кнопки | `.sl-btn` + `--primary`, `--ghost`, `--danger`, `--caps`, `--sm`, `--lg`, `--icon`, `--block`; `.sl-btn-group` |
| Поля | `.sl-field`, `.sl-label`, `.sl-input`, `.sl-select`, `.sl-textarea`, `.sl-search`, `.sl-hint`, `.sl-error`, `.sl-compose` |
| Переключатели | `<sl-segmented class="sl-segmented">`, `.sl-switch`, `.sl-check` |
| Теги и счётчики | `.sl-tag` (+ `--solid`, `--ok`, `--warn`, `--crit`), `.sl-count`, `.sl-chip` |
| Статусы | `.sl-status` (+ `--ok`, `--warn`, `--crit`, `--hollow`, `--plain`), `.sl-pill` |
| Карточки | `.sl-card[data-accent=ok\|warn\|crit\|off]`, `.sl-kv`, `.sl-avatar`, `.sl-metric__value`, `.sl-progress`, `.sl-link-card`, `.sl-steps`/`.sl-step` |
| Баннеры | `.sl-banner` (+ `--warn`, `--crit`) |
| Списки | `.sl-stats`, `<sl-group class="sl-group">`, `.sl-row[aria-current=true]`, `.sl-disclosure` |
| Таблица | `.sl-table-wrap` > `.sl-table` (+ `--stack`: на телефоне строки становятся карточками, нужен `data-label` у ячеек) |
| Пустое состояние | `.sl-empty`, `.sl-dropzone` |
| Страница | `.sl-page-head`, `.sl-page-title`, `.sl-section-title`, `.sl-toolbar`, `.sl-grid` |
| Каркас | `<sl-shell>`, `.sl-topbar`, `.sl-brand`, `.sl-nav` (+ `--rail`), `.sl-statusbar`, `.sl-dock-btn` |
| Всплывающее | `.sl-menu`, `.sl-picker` + `.sl-tile`, `.sl-window`, `.sl-tooltip` |
| Модалка | `<sl-modal id="x"><dialog class="sl-modal">`, кнопки `[data-sl-open="x"]` и `[data-sl-close]` |
| Уведомления | `import { toast } from '@grip2287/sloyka'; toast('Текст', { title, type: 'ok'\|'warn'\|'crit'\|'info' })` |
| Вход | `.sl-login` |
| Иконки | `import { slIcon } from '@grip2287/sloyka/icons'` или `<i data-ic="имя">` + `slHydrateIcons()` |

Живые примеры и разметка для копирования есть в Storybook.

## Перекраска под проект

Переопределите токены в своём CSS, без слоёв:
```css
:root, [data-theme="light"] { --sl-inverse: #1b2a4a; --sl-r-md: 12px; }
[data-theme="dark"] { --sl-inverse: #dfe7ff; }
```
Полный список токенов лежит в `src/tokens/` и в Storybook (Основа → Токены).

## Версии, обновление и откат

- Версии идут по semver: `0.x` — первые выпуски, а ломающие изменения бывают только при смене первой цифры.
- Чтобы обновить сайт, поставьте новую версию (`npm i @grip2287/sloyka@0.2.0`) и пересоберите. Каждый сайт обновляется отдельно.
- Чтобы откатить, верните прежний номер версии и пересоберите.
- Что изменилось, смотрите в `CHANGELOG.md`.

## Как выдать доступ

Владелец открывает репозиторий на GitHub, идёт в Settings → Collaborators → Add people и указывает ник. После этого человек может установить пакет по своему токену. Если убрать человека из списка, доступ к новым версиям у него пропадёт.

## Разработка

```
npm install
npm run storybook          # витрина на http://localhost:6006
npm run build              # dist/
npm test                   # модульные тесты (контраст, поведение, пакет)
npm run test:all           # сборка + модульные + Storybook + браузерные проверки
```
Браузерные проверки прогоняют каждую историю в двух темах на ширинах 390, 1024 и 1440. Они ловят горизонтальную прокрутку, обрезанный текст и ошибки доступности (axe), а также сравнивают скриншоты.
