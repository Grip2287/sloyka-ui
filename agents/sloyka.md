# Sloyka — инструкция для ИИ-агентов (Codex, Cursor, Copilot, Gemini CLI, Claude и др.)

Этот файл лежит в пакете: `node_modules/sloyka/agents/sloyka.md`. Инструкция для людей — `node_modules/sloyka/docs/GUIDE.md`.

Sloyka — закрытый набор компонентов для панелей и админок. Каждый компонент есть **в двух вариантах с одинаковым видом**:

- **React** — `import { Button } from 'sloyka'` (Vite или Next.js App Router). Справочник: `agents/components.md`, машиночитаемо — `components.json`.
- **Нативный (HTML + CSS)** — готовая разметка с классами `sl-*` и файл `sloyka/dist/styles.css`. Если у компонента есть поведение, к нему прилагается свой маленький скрипт `sloyka/native/<компонент>.js`. Справочник: `agents/native-components.md`, фрагменты — `native/*.html`, машиночитаемо — `native/components.json`.

Ты **собираешь** страницы из компонентов и **не меняешь их вид**.

## Шаг 0. Выбери способ сборки

Используй **только нативные компоненты (HTML + CSS)**, если в запросе есть хотя бы одно из этого:

1. Слово **«Предикат»** в любой форме и с любой буквы: «предикат», «Предиката», «для предикату», «модуль предикат». Это значит, что ты пишешь модуль для системы «Предикат», а её модули — только HTML и CSS.
2. Прямая просьба: «только HTML и CSS», «на чистом HTML», «без React», «нативные компоненты», «без фреймворка».

Пример запроса: «я хочу написать модуль для предикат. Создай мне админ панель используя библиотеку sloyka». Здесь есть слово «предикат», поэтому ты пишешь модуль для Предиката и собираешь админ-панель **только из нативных компонентов**: `.html` + `styles.css` + скрипты нужных компонентов. React, JSX и сборщик не нужны.

Во всех остальных случаях — **React-компоненты**. Если в проекте уже есть страницы на Sloyka, продолжай тем же способом, что и они (`.tsx` с `from 'sloyka'` — React; `.html` с классами `sl-*` — нативный). Если запрос противоречит проекту, спроси пользователя.

Первой строкой ответа скажи, какой способ выбран и почему, например: «Собираю нативными компонентами (HTML + CSS): в запросе есть „Предикат“».

---

## Способ A. React-компоненты

### Жёсткие правила

1. **Никаких своих HTML-тегов** в коде сайта: `div`, `span`, `p`, `h1`–`h6`, `a`, `button`, `input`, `table`, `ul`, `img`, `form`… Вместо них — компоненты Sloyka (`Stack`, `Grid`, `Text`, `Link`, `Button`, `Field`, `Table`, `List`, `Image`, `Form`…).
   Исключение: `<html>`, `<head>`, `<body>` в `app/layout.tsx`, `app/global-error.tsx` (Next) и `pages/_document.tsx`.
2. **Никаких `className`, `style`, `dangerouslySetInnerHTML`** у компонентов Sloyka и никаких spread-пропсов (`<Button {...props} />`) — передавай props явно.
3. **Никакого своего CSS** для классов `.sl-*` и никаких классов `sl-*` в разметке. Никаких `styled-components`, `@emotion/styled`, `goober`, `React.createElement('div')`.
4. **Только публичные импорты:** `sloyka`, `sloyka/styles.css`, `sloyka/templates/*`. Не импортируй `sloyka/dist/…` и `sloyka/src/…`.
5. **Значения `enum`-props — только из списка** в `agents/components.md` (`variant`, `size`, `tone`, `columns`, `gap`…).
6. **Нет нужного компонента — не выдумывай** и не собирай его из тегов. Скажи пользователю, чего не хватает, и предложи запросить компонент у владельца библиотеки (https://github.com/Grip2287/sloyka-ui/issues). До тех пор — ближайший существующий компонент или пропусти блок.
7. **Не добавляй исключения** в `sloyka.allow.json` без прямого согласия пользователя; у каждого исключения обязательна причина.

Разрешено: свои функции-компоненты, которые возвращают **только** компоненты Sloyka; любые тексты, данные, состояние, загрузка данных, роутинг; хуки `useToast()` и `useTheme()`.

### Порядок работы

1. **Запрос → номера компонентов.** Разложи задачу на группы 01–24 и коротко покажи план, например: «каркас — 24 Shell + Nav, 16 Topbar; список — 06 Card в Grid; журнал — 13 Table; добавление — 21 Modal с 02 Field; результат — 22 useToast».
2. **Сверь props** каждого компонента с `agents/components.md`. Не угадывай имена props.
3. **Подключение** (один раз):
   - установи пакет менеджером проекта: есть `pnpm-lock.yaml` → `pnpm add sloyka@<версия>`, `yarn.lock` → `yarn add sloyka@<версия>`, иначе `npm i sloyka@<версия>`;
   - `import 'sloyka/styles.css'` в корне приложения;
   - `<ThemeProvider>` и `<ToastProvider>` вокруг приложения;
   - Next.js: `<ThemeScript />` в `<head>` и `suppressHydrationWarning` на `<html>`; компоненты с состоянием и обработчиками — в файлах с `'use client'`.
   - Ссылки роутера: `linkAs={Link}` (Next `next/link`, `react-router-dom`).
4. **Проверка (обязательно перед сдачей):**
   ```bash
   npx sloyka-check src        # pnpm: pnpm exec sloyka-check src; папка — где код: src, app, components
   ```
   Ноль нарушений, код выхода 0. Если команда `build` в `package.json` не начинается с проверки — сделай так: `"build": "sloyka-check src && <прежняя сборка>"`. Нарушение исправляй заменой на компонент из подсказки, а не исключением. Затем сборка проекта (`npm run build` / `pnpm build`).
5. Проверь обе темы и ширины 390, 1024, 1440: нет горизонтальной прокрутки и обрезанного текста. У кнопок-иконок есть `aria-label`; статус не передаётся только цветом.

### Минимальный пример

```tsx
// app/page.tsx (Next.js) — или src/App.tsx (Vite)
'use client';
import { Shell, Topbar, Nav, PageHeader, Toolbar, Search, Button, Grid, Card, KeyValue, Status, ThemeToggle, useToast } from 'sloyka';

export default function Page() {
  const toast = useToast();
  return (
    <Shell
      topbar={<Topbar brand={{ mark: 'П', name: 'Пульт' }} title="Объекты"><ThemeToggle /></Topbar>}
      nav={
        <Nav current="/">
          <Nav.Section title="Мониторинг" />
          <Nav.Item href="/" icon="grid">Объекты</Nav.Item>
          <Nav.Item href="/journal" icon="journal">Журнал</Nav.Item>
        </Nav>
      }
    >
      <PageHeader title="Объекты" />
      <Toolbar>
        <Search aria-label="Поиск объекта" />
        <Toolbar.End>
          <Button variant="primary" icon="plus" onClick={() => toast.ok('Объект добавлен')}>Добавить</Button>
        </Toolbar.End>
      </Toolbar>
      <Grid columns="auto">
        <Card accent="ok">
          <Card.Head title="КПП-1" subtitle="ул. Заводская, 12" />
          <KeyValue items={[['Состояние', <Status tone="ok">На связи</Status>]]} />
        </Card>
      </Grid>
    </Shell>
  );
}
```

---

## Способ B. Нативные компоненты (HTML + CSS) — «Предикат» и «только HTML и CSS»

### Жёсткие правила

1. **Разметка — только из фрагментов** `native/*.html` (справочник `agents/native-components.md`). Копируй фрагмент целиком. Менять можно только: тексты, `href`, `name`, `value`, `placeholder`, `id` (с сохранением связей `aria-labelledby`, `aria-controls`, `for`), число повторяющихся элементов (строки таблицы, пункты меню, карточки).
2. **Варианты — только классами из фрагментов**: `sl-btn--primary`, `sl-tag--ok`, `sl-stack--gap-2` и т. д. Не придумывай классы `sl-*`, не добавляй свои классы.
3. **Никаких своих тегов и обёрток.** Раскладка — Stack и Grid (`native/stack.html`, `native/grid.html`), заголовки и текст — Text (`native/text.html`). Внутри Stack, Grid, Card, модального окна и т. п. — только целые компоненты.
4. **Никаких `style="…"`, своего `<style>` и своего CSS для `.sl-*`.** Единственное исключение — значения, которые ставит сам компонент: ширина шкалы Metric (`style="width:72%"`) и цвет цифры Stats (`style="--c:var(--sl-ok)"`).
5. **Свой JavaScript — только обработчики событий**: `addEventListener`, получение и отправка данных, заполнение текстов (`textContent`), `value` полей, вызовы `slModal.open('id')` и `slToast.ok('…')`. JS **не создаёт** разметку Sloyka (`innerHTML` с `class="sl-…"`) и **не меняет** классы `sl-*` (`classList`, `className`). Нужен ещё один элемент — скопируй фрагмент в HTML или клонируй `<template>` с фрагментом.
6. **Поведение компонентов — их скриптами**, а не своим кодом: модальное окно — `native/modal.js`, меню — `menu.js`, тема — `theme.js` + `theme-head.js`, уведомления — `toast.js`, сворачиваемая группа — `group.js`, подсказка — `tooltip.js`, сегменты — `segmented.js`, строка сообщения — `compose.js`, меню на телефоне — `shell.js`, плавающее окно — `window.js`. Подключай только скрипты тех компонентов, что есть на странице.
7. Нет нужного компонента — правило 6 способа A: не выдумывай, скажи пользователю.

### Подключение

Пакет ставится так же (`npm i sloyka` / `pnpm add sloyka`). Если сборщика нет, скопируй в проект `node_modules/sloyka/dist/` (стили и шрифты) и нужные файлы `node_modules/sloyka/native/*.js`, пути поправь.

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Пульт</title>
  <script src="node_modules/sloyka/native/theme-head.js"></script>   <!-- тема без мигания -->
  <link rel="stylesheet" href="node_modules/sloyka/dist/styles.css">
  <!-- шаблон темы, если нужен: <link rel="stylesheet" href="node_modules/sloyka/templates/template-1.css"> -->
</head>
<body>
  <!-- каркас: native/shell.html; кнопка и окно: native/modal.html; … -->
  <script src="node_modules/sloyka/native/shell.js"></script>
  <script src="node_modules/sloyka/native/theme.js"></script>
  <script src="node_modules/sloyka/native/modal.js"></script>
  <script src="node_modules/sloyka/native/toast.js"></script>
  <script src="app.js"></script>   <!-- свой код: только обработчики событий -->
</body>
</html>
```

### Порядок работы

1. **Запрос → номера компонентов**, как в способе A, но с файлами: «каркас — 24 `native/shell.html`; заголовок — 15 `native/page-header.html`; добавление — 21 `native/modal.html` + `modal.js`».
2. **Скопируй фрагменты** из `agents/native-components.md`, поменяй тексты и данные.
3. **Свяжи поведение:** кнопка открывает окно атрибутом `data-sl-open="<id окна>"`, кнопка «Отменить» закрывает окно атрибутом `data-sl-close`. Свои действия вешай на события: `sl-open`, `sl-close` (окно), `sl-toggle` (меню, группа), `change` (сегменты), `sl-send` (строка сообщения), `submit` (форма).
4. **Проверка (обязательно перед сдачей):**
   ```bash
   npx sloyka-check .          # проверяет .html, встроенные <script>, свои .js и .css
   ```
   Ноль нарушений, код выхода 0. Подсказки называют нужный фрагмент (`native/<компонент>.html`).
5. Открой страницу в браузере: обе темы (кнопка темы), ширины 390, 1024, 1440, окно открывается и закрывается (Esc, «Отменить», затемнение), фокус возвращается на кнопку.

### Пример: кнопка и модальное окно на 4 поля

```html
<button class="sl-btn sl-btn--primary" type="button" data-sl-open="user-modal">Добавить пользователя</button>
<dialog class="sl-modal" id="user-modal" aria-labelledby="user-modal-title">
  <div class="sl-modal__head">
    <span class="sl-modal__title" id="user-modal-title">Новый пользователь</span>
    <button class="sl-btn sl-btn--ghost sl-btn--sm sl-btn--icon" type="button" aria-label="Закрыть"><!-- иконка x из native/modal.html --></button>
  </div>
  <div class="sl-modal__body">
    <!-- 4 поля native/field.html: Имя пользователя, Почта, Логин, Пароль -->
  </div>
  <div class="sl-modal__foot">
    <button class="sl-btn sl-btn--ghost" type="button" data-sl-close="">Отменить</button>
    <button class="sl-btn sl-btn--primary" type="button" id="save-user">Сохранить</button>
  </div>
</dialog>
<script>
  document.getElementById('save-user').addEventListener('click', () => {
    // проверка полей и отправка данных
    slModal.close('user-modal');
    slToast.ok('Пользователь сохранён');
  });
</script>
```

Иконки (`<svg class="sl-ic" …>`) копируй из фрагментов как есть.

---

## Шаблон темы

«Сделай по шаблону N» → подключи `sloyka/templates/template-N.css` **после** стилей Sloyka: в React — `import 'sloyka/templates/template-N.css'`, в нативной вёрстке — `<link rel="stylesheet" href="…/sloyka/templates/template-N.css">`. Нет файла — спроси пользователя. Поверх шаблона ничего не переопределяй. Свои цвета — только через токены `--sl-*` в CSS сайта (без селекторов `.sl-*`).

## Обновление библиотеки

1. Сначала покажи пользователю, что нового: раздел новой версии в `node_modules/sloyka/CHANGELOG.md` или на https://github.com/Grip2287/sloyka-ui/releases («Добавлено / Изменено / Удалено / Нужно поправить в сайтах»). Дождись согласия.
2. `npm i sloyka@<версия>` (или `pnpm add` / `yarn add` — как в проекте), затем `npx sloyka-check` и сборка; исправь пункты «Нужно поправить». В нативной вёрстке после обновления сверь свои фрагменты с новыми `native/*.html`.
3. Откат — прежняя версия в `package.json` и `npm i`.

## Чего Sloyka не умеет

Секций лендинга (hero, цены, отзывы) и блоков магазина (товар, корзина) в библиотеке нет — ни в React, ни в нативном варианте. Не верстай их тегами в проекте на Sloyka — скажи пользователю, каких компонентов не хватает.
