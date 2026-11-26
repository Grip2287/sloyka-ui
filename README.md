# Sloyka

Библиотека компонентов для операторских панелей и админок. В ней светлая и тёмная тема и адаптив под телефон, планшет и монитор. Работает в любом стеке: чистый HTML, React, Vue, Astro.

- **CSS-основа**: токены (цвета, шрифт Inter, размеры) и классы `sl-*` в каскадных слоях `@layer sl.*`. Ваши стили вне слоёв всегда сильнее библиотеки, `!important` не нужен. Если ваш CSS тоже лежит в слоях (например, Tailwind v4), объявите их порядок после библиотеки: `@layer sl.reset, sl.tokens, sl.base, sl.components, base, components, utilities;`.
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
Тему задаёт атрибут `data-theme="light"` или `"dark"` на `<html>` или на любом блоке. Блок со своей темой сам рисует фон своей темы. Если атрибута нет, тема берётся из настроек системы.

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
/* тёмная тема по настройкам системы, когда атрибута нет */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --sl-inverse: #dfe7ff; }
}
```
Размеры и радиусы общие для обеих тем, цвета задавайте во всех трёх местах.
Полный список токенов лежит в `src/tokens/` и в Storybook (Основа → Токены).

## Шаблоны: примерить в Storybook и сохранить

1. `npm run storybook`.
2. В песочнице любого компонента настройте «Размер компонента, %» и «Скругление» (группа «Размер и форма» в «Элементах управления»), затем нажмите **«＋ В шаблон»** над примером. Для цветов и общих размеров есть «Основа → Редактор темы», там тоже есть «＋ В шаблон».
3. Откройте **«Основа → Мой шаблон»** (ссылка «Открыть в новой вкладке» есть над каждым примером). Там все примерки в одном месте: их можно поправить или удалить, а результат сразу видно в обеих темах.
4. Задайте название, например «Шаблон 1», и нажмите **«Сохранить в библиотеку»**. Появятся `templates/template-1.css` и `templates/template-1.json`. Ещё можно «Скопировать CSS» или «Скачать CSS».
5. На сайте подключите шаблон после стилей библиотеки:
   ```js
   import '@grip2287/sloyka/css';
   import '@grip2287/sloyka/templates/template-1.css';
   ```
Черновик шаблона хранится в браузере, поэтому к нему можно возвращаться. Сохранённый шаблон открывается обратно через «Открыть сохранённый…». В собранном Storybook (без `npm run storybook`) сохранять в библиотеку нельзя, только копировать и скачивать.

## Референсы: стиль с другого сайта или макета

1. `npm run storybook` → **«Референсы → Добавить референс»**: название, ссылка и/или файлы (скриншоты, PDF, HTML, архив до 25 МБ) и что из него взять.
   **Шаблон создаётся сразу.** По ссылке библиотека открывает сайт в фоне и снимает главный цвет, фон, скругление, размер текста и высоту кнопок. По картинке берёт палитру. Результат сохраняется как шаблон с названием референса: `templates/<имя>.css`. В карточке референса есть кнопка «Открыть в „Мой шаблон“», где его можно поправить.
2. Для подробного разбора по компонентам напишите Claude **«разбери референсы»**. Скилл `sloyka-references` снимет экраны, разложит стиль по группам 01–24 и сделает «шкурку»: те же компоненты Sloyka в стиле референса. Вам придут скриншоты на одобрение.
3. Компоненты референса лежат в разделе «Референсы / <название>» с меткой `ref-<имя>`. Базовые помечены `ref-base`. Чтобы смотреть только один референс, включите фильтр меток в боковом списке Storybook.
4. Понравившееся можно собрать в шаблон: кнопка «＋ В шаблон» есть и у компонентов референса.

## Версии, обновление и откат

- Версии идут по semver: `0.x` — первые выпуски, а ломающие изменения бывают только при смене первой цифры.
- Чтобы обновить сайт, поставьте новую версию (`npm i @grip2287/sloyka@0.2.0`) и пересоберите. Каждый сайт обновляется отдельно.
- Чтобы откатить, верните прежний номер версии и пересоберите.
- Что изменилось, смотрите в `CHANGELOG.md`.

## Плагин для Claude Code

В репозитории лежит плагин со скиллом `sloyka`. С ним Claude собирает панели на этой библиотеке и знает разметку всех компонентов. Ставится только у тех, у кого есть доступ к репозиторию:
```
/plugin install sloyka --marketplace Grip2287/sloyka-ui
```
В старых версиях Claude Code ставится в два шага: `/plugin marketplace add Grip2287/sloyka-ui`, затем `/plugin install sloyka@sloyka`.
Справочник компонентов для скилла собирается из историй Storybook командой `npm run gen:docs`.

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
