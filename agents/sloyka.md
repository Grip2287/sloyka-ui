# Sloyka — инструкция для ИИ-агентов (Codex, Cursor, Copilot, Gemini CLI, Claude и др.)

Этот файл лежит в пакете: `node_modules/sloyka/agents/sloyka.md`. Справочник всех компонентов и их props — `node_modules/sloyka/agents/components.md` (машиночитаемо — `node_modules/sloyka/components.json`). Инструкция для людей — `node_modules/sloyka/docs/GUIDE.md`.

Sloyka — закрытый набор React-компонентов для панелей и админок (Vite или Next.js App Router). Ты **собираешь** страницы из компонентов и **не меняешь их вид**.

## Жёсткие правила

1. **Никаких своих HTML-тегов** в коде сайта: `div`, `span`, `p`, `h1`–`h6`, `a`, `button`, `input`, `table`, `ul`, `img`, `form`… Вместо них — компоненты Sloyka (`Stack`, `Grid`, `Text`, `Link`, `Button`, `Field`, `Table`, `List`, `Image`, `Form`…).
   Исключение: `<html>`, `<head>`, `<body>` в `app/layout.tsx`, `app/global-error.tsx` (Next) и `pages/_document.tsx`.
2. **Никаких `className`, `style`, `dangerouslySetInnerHTML`** у компонентов Sloyka и никаких spread-пропсов (`<Button {...props} />`) — передавай props явно.
3. **Никакого своего CSS** для классов `.sl-*` и никаких классов `sl-*` в разметке. Никаких `styled-components`, `@emotion/styled`, `goober`, `React.createElement('div')`.
4. **Только публичные импорты:** `sloyka`, `sloyka/styles.css`, `sloyka/templates/*`. Не импортируй `sloyka/dist/…` и `sloyka/src/…`.
5. **Значения `enum`-props — только из списка** в `agents/components.md` (`variant`, `size`, `tone`, `columns`, `gap`…).
6. **Нет нужного компонента — не выдумывай** и не собирай его из тегов. Скажи пользователю, чего не хватает, и предложи запросить компонент у владельца библиотеки (https://github.com/Grip2287/sloyka-ui/issues). До тех пор — ближайший существующий компонент или пропусти блок.
7. **Не добавляй исключения** в `sloyka.allow.json` без прямого согласия пользователя; у каждого исключения обязательна причина.

Разрешено: свои функции-компоненты, которые возвращают **только** компоненты Sloyka; любые тексты, данные, состояние, загрузка данных, роутинг; хуки `useToast()` и `useTheme()`.

## Порядок работы

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

## Минимальный пример

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

## Шаблон темы

«Сделай по шаблону N» → подключи `import 'sloyka/templates/template-N.css'` **после** `sloyka/styles.css`. Нет файла — спроси пользователя. Поверх шаблона ничего не переопределяй. Свои цвета — только через токены `--sl-*` в CSS сайта (без селекторов `.sl-*`).

## Обновление библиотеки

1. Сначала покажи пользователю, что нового: раздел новой версии в `node_modules/sloyka/CHANGELOG.md` или на https://github.com/Grip2287/sloyka-ui/releases («Добавлено / Изменено / Удалено / Нужно поправить в сайтах»). Дождись согласия.
2. `npm i sloyka@<версия>` (или `pnpm add` / `yarn add` — как в проекте), затем `npx sloyka-check src` и сборка; исправь пункты «Нужно поправить».
3. Откат — прежняя версия в `package.json` и `npm i`.

## Чего Sloyka не умеет

Секций лендинга (hero, цены, отзывы) и блоков магазина (товар, корзина) в библиотеке нет. Не верстай их тегами в проекте на Sloyka — скажи пользователю, каких компонентов не хватает.
