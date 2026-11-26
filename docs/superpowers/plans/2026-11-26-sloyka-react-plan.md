# Sloyka 1.0 (React) — план работ

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Публичный пакет `sloyka` 1.0.0: 24 группы компонентов как закрытые React-компоненты поверх существующего CSS, проверка проекта (`sloyka-check` + ESLint + Stylelint), работа в Vite и Next.js, Storybook на React, инструкция и автоматические «что нового и где лежит».

**Architecture:** CSS-слой (`src/components/*/*.css`, токены, шаблоны) не меняется и становится внутренней деталью. Поверх — `src/react/` на TypeScript: каждый компонент рисует ту же разметку с классами `sl-*`, принимает только свои props, несёт метаданные (номер, имя, props, разрешённые вложения). Из метаданных генерируются: манифест `components.json`, dev-предупреждения, справочник для скилла, заметки к выпуску. Проверки сайта — общий модуль правил, к нему три входа: CLI, ESLint-плагин, Stylelint-плагин.

**Tech Stack:** React 18.3/19 (peer), TypeScript, Vite (library mode, `preserveModules` + `rollup-preserve-directives` для `'use client'`), Lightning CSS (как сейчас), Vitest + @testing-library/react + happy-dom, Playwright + axe, Storybook 10 `@storybook/react-vite`, `@babel/parser` (только CLI), ESLint 9 (flat config), Stylelint 16, Changesets, GitHub Actions, npmjs.com.

**Spec:** `docs/superpowers/specs/2026-11-26-sloyka-react-design.md` (раздел «Уточнения после проверки строителем» — обязателен).

## Global Constraints
- Имя пакета `sloyka` (fallback `@grip2287/sloyka` на npmjs.com, если занято при публикации), версия 1.0.0 через changeset `major`, лицензия MIT, `"type": "module"`.
- `peerDependencies`: `react >=18.3`, `react-dom >=18.3`. Runtime-зависимостей нет; `@babel/parser` — `dependencies` только ради CLI (в бандл компонентов не попадает — проверяется тестом).
- Публичные входы ровно: `sloyka`, `sloyka/styles.css`, `sloyka/templates/*`, `sloyka/check` (+ bin `sloyka-check`), `sloyka/eslint`, `sloyka/stylelint`, `sloyka/components.json`. Всё прочее закрыто `exports`.
- Ни один компонент не принимает `className`, `style`, `dangerouslySetInnerHTML`, `...rest`. Варианты — фиксированные строки; неизвестное значение → dev-предупреждение и значение по умолчанию.
- Номера 01–24 и названия групп — как в Storybook 0.1.x. Заголовки и имена экспортов историй сохраняются, чтобы id историй совпали с эталонными скриншотами `tests/e2e/__screenshots__/win32` (допуск `maxDiffPixelRatio 0.01`).
- Интерактивные модули начинаются с `'use client'`; ни один компонент не обращается к `window/document` во время отрисовки (только в эффектах/обработчиках).
- Поведение 0.1.x — контракт: фокус-ловушка и возврат фокуса, Esc и «нажал+отпустил на фоне» в `Modal`, меню телефона в `Shell`, ←/→ в `Segmented`, ARIA. Управляемые и неуправляемые варианты у всех интерактивных.
- Тексты интерфейса компонентов (aria-label по умолчанию и т.п.) — на русском.
- Публикация, смена видимости репозитория и создание секретов — только по прямому «да» пользователя в чате (смена видимости уже одобрена: «можно выкладывать в общий доступ»; публикация npm — после Merge «Version Packages» владельцем или по его прямому «слей»).

## Review Focus
1. **Next.js гидрация**: `ThemeProvider`/`ThemeScript` на сервере и клиенте дают одинаковую разметку; без мигания темы. Тест: `examples/next` собирается и в Playwright нет `hydration` ошибок в консоли (Task 10).
2. **Ложные срабатывания проверки**: `<html>/<head>/<body>` в `app/layout.tsx`, фрагменты, `null`, условия, `.map()`, строки, компоненты сайта из компонентов Sloyka — не нарушения. Тест-фикстуры «good» в Task 9.
3. **Белый список вложений**: строки, числа, `null/false`, фрагменты, массивы и пользовательские компоненты, которые сами отдают Sloyka, не дают предупреждений; нативный `<div>` даёт. Тест в Task 2.
4. **Длинные русские слова** в `Card`, `Nav` (рейл), `Row`, `Tag`, `Table` на 390px — без обрезки и прокрутки (существующий stress-тест переносится в React, Task 8).
5. **Двойная загрузка / два ToastProvider** — без ошибок; `useToast` вне провайдера — понятная ошибка с текстом «оберните приложение в ToastProvider». Тест в Task 6.

---

### Task 1: Перестройка репозитория под React
**Files:** `package.json`, `tsconfig.json`, `vite.config.ts`, `scripts/build-css.js` (выход `dist/styles.css` вместо `sloyka.css`), удалить `src/index.js`, `src/core/define.js`, `src/components/*/*.js` (веб-компоненты), `src/theme-init.js`, `src/icons.js` (перенос в `src/react/icons.ts`); `tests/unit/build.test.js`, `tests/unit/pack.test.js`.
- [ ] `git tag v0.1.0` на текущем `main`.
- [ ] Тесты пакета (обновить): `dist/index.js`, `dist/index.d.ts`, `dist/styles.css`, `dist/fonts/*.woff2`, `bin/sloyka-check.js`, `dist/check/*`, `components.json` в `npm pack`; нет `src/`, историй, `@babel/parser` в `dist/index.js` и его чанках; каждый путь `exports` существует; `package.json.name === 'sloyka'`, `license === 'MIT'`.
- [ ] FAIL → новый `package.json` (имя, MIT, peerDeps, exports, bin, files: `dist`, `templates`, `bin`, `components.json`), Vite lib (`src/react/index.ts`, `preserveModules`, `rollup-preserve-directives`, `external: react*`), `tsc --emitDeclarationOnly`. `LICENSE` → MIT. → PASS. Commit `chore!: switch package to React (sloyka 1.0)`.

### Task 2: Ядро React-слоя
**Files:** `src/react/core/{meta.ts,props.ts,children.ts,cx.ts}`, `src/react/icons.tsx`, `tests/unit/react/core.test.tsx`.
**Produces:**
- `defineMeta(Comp, { n: '21', group: 'Модальное окно', name: 'Modal', allowed: 'any' | string[] | 'none', props: Record<string, PropSpec> })` — вешает метку `Comp.__sloyka`.
- `pick<T>(component, prop, value, options: readonly T[], fallback: T): T` — dev-предупреждение `Sloyka · Modal: size="xl" недопустимо, варианты: sm, md, lg`.
- `checkChildren(component, children)` — dev-only; пропускает строки, числа, null/false, фрагменты, массивы, элементы с `__sloyka` из `allowed`, функции-компоненты без метки (не проверяет вглубь); на нативный тег — предупреждение со списком разрешённого.
- `Icon({ name: IconName, size?: 16 | 20 })`, тип `IconName` = ключи набора иконок 0.1.x.
- [ ] Тесты: `pick` с допустимым/недопустимым значением (console.warn один раз на компонент+prop); `checkChildren` для случаев из Review Focus 3; `Icon` рисует `<svg class="sl-ic">` с путём иконки и `aria-hidden`.
- [ ] FAIL → реализация → PASS. Commit.

### Task 3: Текст, раскладка, ссылки, картинки, формы
**Files:** `src/react/components/{text,layout,link,image,form}/*.tsx`, `src/components/layout/layout.css` (новые `.sl-stack`, `.sl-grid--*`, `.sl-page--*`, `.sl-text--*`, `.sl-image--*` на токенах), тесты.
**Produces:** `Text { as: 'page'|'section'|'title'|'body'|'small'|'caption', tone, weight: 'normal'|'strong', children }`; `Stack { gap: 1..8, direction, align, justify, wrap }`; `Grid { columns: 1|2|3|4|'auto', min: 'sm'|'md'|'lg', gap }`; `Page { width: 'narrow'|'default'|'wide'|'full' }`; `Link { href, linkAs?, external?, children }`; `Image { src, alt, width, height, fit, radius }`; `Form { onSubmit, action?, method?, children }`. Общий `LinkLike` для `href`+`linkAs` переиспользуется в Task 4–6.
- [ ] Тесты: классы и теги на выходе, `linkAs` рендерит переданный компонент с `href`, `Image` без `alt` → ошибка типа и dev-предупреждение, `Grid columns="auto" min="md"` → `.sl-grid--auto-md`, `Form` вызывает `onSubmit` с `preventDefault` только если нет `action`.
- [ ] FAIL → реализация + CSS → PASS. Commit.

### Task 4: Элементы 01–05
**Files:** `src/react/components/{button,field,toggle,tag,status}/*.tsx` + тесты.
**Produces (props сверх общих):** `Button { variant: 'primary'|'default'|'ghost'|'danger', size: 'sm'|'md'|'lg', icon?, iconOnly?, caps?, block?, busy?, disabled?, type?, onClick?, href?, linkAs?, 'aria-label'? }`, `ButtonGroup { direction }`; `Field { label?, hint?, error?, …input props по белому списку: name, value, defaultValue, onChange, placeholder, type: 'text'|'email'|'password'|'tel'|'number'|'url', required, disabled, autoComplete, inputMode }`, `Search`, `Select { options: {value,label}[] }`, `Textarea`, `Compose { onSend }`; `Segmented { options, value?, defaultValue?, onChange?, block? }`, `Switch`, `Checkbox`, `Radio`, `RadioGroup`; `Tag { tone: 'default'|'solid'|'ok'|'warn'|'crit' }`, `Count { solid? }`, `Chip`; `Status { tone: 'ok'|'warn'|'crit'|'off'|'hollow', plain?, note? }`, `StatusPill`.
- [ ] Тесты: на каждый — разметка совпадает с историями 0.1.x (снимок `container.innerHTML` нормализованный), `Segmented` ←/→ и `onChange`, `Field` с `error` ставит `aria-invalid` и `aria-describedby`, `Button busy` → `aria-busy` + `disabled`, лишний prop `className` отбрасывается (нет в DOM) и даёт ошибку типа (`// @ts-expect-error` в тесте).
- [ ] FAIL → реализация → PASS. Commit.

### Task 5: Данные и карточки 06–14
**Files:** `src/react/components/{card,metric,link-card,banner,stats,list,disclosure,table,empty}/*.tsx` + тесты.
**Produces:** `Card { accent?: 'ok'|'warn'|'crit'|'off', interactive?, href?, linkAs? }` + `Card.Head { title, subtitle?, aside? }`, `Card.Foot`, `KeyValue { items: [label, node][] }`; `Metric { label, value: number, note?, unit? }` (уровни 70/90 как в песочнице); `LinkCard { icon, title, text, href, linkAs? }`, `Steps { items: {title,text}[] }`; `Banner { tone: 'ok'|'warn'|'crit', title, children? }` + `Banner.Item { action? }`; `Stats { items: {label, value, tone?}[] }`; `List`, `Group { title, count?, defaultCollapsed?, collapsed?, onToggle? }`, `Row { title, status?, current?, chevron?, href?, onClick? }`; `Disclosure { title, defaultOpen? }`; `Table { columns, rows, rowKey, empty?, stack? = true, onRowClick? }`; `Empty { icon, title, text?, action? }`, `Dropzone`.
- [ ] Тесты: `Group` сворачивание + `aria-expanded`, `Table` рендерит `data-label` для режима телефона и `render` ячеек, пустая таблица показывает `empty`, `Card` в `allowed` пропускает `Field`, а `<div>` даёт предупреждение.
- [ ] FAIL → реализация → PASS. Commit.

### Task 6: Каркас, оверлеи, тема 15–24
**Files:** `src/react/components/{page-header,toolbar,topbar,statusbar,menu,picker,window,modal,toast,tooltip,login,nav,shell,theme}/*.tsx` + тесты.
**Produces:** `PageHeader { title, aside? }`, `Toolbar` + `Toolbar.End`; `Topbar { brand: {mark, name}, title? }`; `StatusBar { items: {label, value}[], system?: {tone, text} }`, `DockButton`; `Menu { header?: {name, role} }` + `Menu.Item { icon?, danger?, onClick?, href? }` + `Menu.Separator`; `Picker { title }` + `Tile { selected?, disabled?, note? }`; `Window { title, icon?, onClose?, bar?, footer? }`; `Modal { title, open?, defaultOpen?, onOpenChange?, footer?, size: 'sm'|'md'|'lg' }` (нативный `<dialog>` + `showModal`, Esc, фон с проверкой pointerdown, возврат фокуса); `ToastProvider`, `useToast() → { ok, warn, crit, info }` (crit без автоскрытия, `role=alert`, регион создаётся провайдером заранее); `Tooltip { text, children }`; `Login { brand, onSubmit, error?, footer? }`; `Nav { current }` + `Nav.Section { title }` + `Nav.Item { icon, href, linkAs?, count? }`; `Shell { topbar, nav, children }` (рейл/телефон как в 0.1.x, кнопка меню, фон, Esc, закрытие по пункту); `ThemeProvider { defaultTheme: 'light'|'dark'|'system' }`, `ThemeToggle`, `ThemeScript` (inline-скрипт для `<head>`).
- [ ] Тесты: Modal (открытие/закрытие/Esc/фон/фокус/контролируемый), Shell (меню телефона: открытие, Esc, пункт закрывает, фокус), Toast (crit остаётся, info 5000 мс, `useToast` вне провайдера — ошибка с текстом), Theme (сохранение в `localStorage['sl-theme']`, `ThemeScript` рендерит строку без зависимостей), Nav (`current` → `aria-current="page"`).
- [ ] FAIL → реализация → PASS. Commit.

### Task 7: Манифест и экспорт
**Files:** `src/react/index.ts`, `scripts/gen-manifest.ts` → `components.json`, `tests/unit/manifest.test.ts`.
- [ ] Тест: в манифесте 24 группы с номерами `01`–`24`, у каждого компонента `name`, `n`, `props` (имя, тип, варианты, по умолчанию), `allowed`; все экспорты `index.ts` с `__sloyka` есть в манифесте; нет компонентов без номера, кроме служебных (`Icon`, `Text`, `Stack`, `Grid`, `Page`, `Link`, `Image`, `Form`, `Theme*`) — у них `n: '00'`.
- [ ] FAIL → генерация в `npm run build` → PASS. Commit.

### Task 8: Storybook на React
**Files:** `.storybook/main.ts` (`@storybook/react-vite`), `.storybook/preview.tsx` (те же глобалы темы/ширин, «обе темы рядом», панель «＋ В шаблон», API шаблонов и референсов без изменений), все `src/**/*.stories.tsx` (вместо `.stories.js`), `src/tokens/*.stories.tsx` (редактор темы, «Мой шаблон», «Все шаблоны»), `src/references/References.stories.tsx`, `tests/e2e/*.spec.js`.
- [ ] Истории 01–24: `Default` повторяет пример 0.1.x на React-компонентах, `Playground` — args как в 0.1.x + «Размер и форма»; заголовки и имена экспортов — прежние (id историй не меняются). Служебные страницы портируются как React-компоненты (им разрешены нативные теги — это не сайт).
- [ ] Прогон `npx playwright test` **без** `--update-snapshots` против эталонов `win32`: расхождения > 1% — исправить компонент, а не эталон; если расхождение намеренное — показать пользователю скриншоты и обновлять эталон только после его «да».
- [ ] Все прежние проверки (прокрутка, обрезка, axe, поведение, шаблоны, референсы) PASS. Commit.

### Task 9: Проверка проекта: правила, CLI, ESLint, Stylelint
**Files:** `src/check/rules.js` (единый список правил и подсказок «чем заменить» из манифеста), `src/check/scan-jsx.js` (`@babel/parser`), `src/check/scan-css.js`, `bin/sloyka-check.js`, `src/check/eslint.js`, `src/check/stylelint.js`, `tests/check/fixtures/{good,bad}/**`, `tests/unit/check.test.js`.
**Produces:** правила `no-native-elements`, `no-component-classname-style`, `no-deep-imports`, `no-sl-css-overrides`; `sloyka.allow.json` (`{ "ignore": [{ "path": "glob", "rules": [...] , "reason": "…" }] }`) — каждое исключение печатается. CLI: `sloyka-check [dir]` → код 1 и список `файл:строка правило → совет`; `--json`.
- [ ] Тесты: каждый файл из `bad/` даёт ровно ожидаемые нарушения (ожидание записано комментарием `// expect: rule@line`); `good/` (Next `app/layout.tsx` с `html/body`, фрагменты, `.map()`, страницы из компонентов, шаблон через `@import 'sloyka/templates/…'`) — ноль нарушений; ESLint и Stylelint на тех же фикстурах дают те же нарушения, что CLI; `sloyka.allow.json` снимает нарушение и печатает его.
- [ ] FAIL → реализация → PASS. Commit.

### Task 10: Примеры Vite и Next.js
**Files:** `examples/vite/**`, `examples/next/**` (App Router), `examples/bad-file.tsx`, `tests/e2e/examples.spec.js`, `.github/workflows/ci.yml`.
- [ ] Оба примера: зависимость `"sloyka": "file:../.."`, `prebuild: sloyka-check`, ESLint и Stylelint с конфигами из пакета; страница-админка (Shell + Nav + PageHeader + Toolbar + Grid карточек + Table + Modal с полями + Toast + ThemeToggle).
- [ ] e2e: оба примера собираются; в браузере нет ошибок консоли и гидрации (Next), тема из `localStorage` применяется до отрисовки; копия примера с `bad-file.tsx` → `npm run build` падает с кодом 1 и сообщением правила.
- [ ] CI: build пакета → тесты → Storybook → e2e → сборка обоих примеров → «плохая» сборка обязана упасть. Commit.

### Task 11: Документация, скиллы, запросы
**Files:** `docs/GUIDE.md`, `README.md`, `docs/PROMPTS.md`, `plugin/skills/sloyka/SKILL.md`, `plugin/skills/sloyka/components.md` (генерируется из манифеста), `plugin/skills/sloyka-references/SKILL.md`, `scripts/gen-components-md.js`.
- [ ] `GUIDE.md`: правила (собирать только из компонентов; что запрещено и почему), где что лежит (репозиторий/пакет — таблица путей), 01–24 с импортом и примером, `linkAs` для Next/react-router, шаблоны и референсы, проверки и исключения, выпуски и обновления, «нужного компонента нет → запрос владельцу».
- [ ] Скилл `sloyka`: только React; порядок «запрос → номера компонентов → сборка»; запрет нативных тегов и своих стилей; «обнови sloyka» — сначала «что нового и где лежит»; если компонента нет — не выдумывать.
- [ ] `PROMPTS.md` — переписать на React (Vite/Next) с номерами компонентов. `claude plugin validate .` PASS. Commit.

### Task 12: Заметки к выпуску и публикация
**Files:** `scripts/release-notes.js`, `.changeset/sloyka-1-0.md` (major), `.github/workflows/{release.yml,pages.yml}`, `tests/unit/release-notes.test.js`.
- [ ] Тест: `release-notes.js` на двух манифестах (старый/новый) выдаёт разделы «Добавлено / Изменено / Удалено / Нужно поправить в сайтах» с путём файла, id истории Storybook и строкой импорта; добавленный prop — «Изменено», удалённый prop или компонент — «Нужно поправить».
- [ ] `release.yml`: перед `changeset version` — запуск `release-notes.js` против манифеста последней опубликованной версии (`npm view sloyka dist.tarball` → `components.json`) и вставка в changeset; публикация `npm publish --provenance --access public` с `NPM_TOKEN`. `pages.yml`: Storybook на GitHub Pages.
- [ ] Commit, push.

### Task 13: Открытый доступ и выпуск 1.0.0 (с пользователем)
- [ ] Проверить историю на секреты и чужие данные (`git grep` по всем коммитам, как перед первым push).
- [ ] Перевести `Grip2287/sloyka-ui` в public (`gh repo edit --visibility public --accept-visibility-change-consequences`), включить Pages.
- [ ] **Пользователь:** создаёт аккаунт npmjs.com, токен типа Automation, добавляет секрет `NPM_TOKEN` в репозиторий (дать пошаговую инструкцию).
- [ ] Перепроверить имя `sloyka` на npm; если занято — переименовать в `@grip2287/sloyka` (+ тесты пакета).
- [ ] Выпуск: PR «Version Packages 1.0.0» → Merge (по слову пользователя) → проверить `npm view sloyka version` = `1.0.0`, установку в чистую папку без токена, сборку `examples/vite` на опубликованном пакете.
