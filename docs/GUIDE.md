# Sloyka — инструкция для разработчика

Sloyka — React-библиотека компонентов для операторских панелей и админок. Светлая и тёмная тема, адаптив (телефон, планшет, монитор). Работает в Vite и Next.js (App Router).

## 1. Главное правило

**Страница собирается только из компонентов Sloyka.** Вид и вёрстка компонентов закрыты.

| Можно | Нельзя |
|---|---|
| Менять тексты, данные, логику, порядок блоков | Писать свои теги: `<div>`, `<button>`, `<table>`… |
| Выбирать компоненты 01–24 и их разрешённые варианты (`variant`, `size`, `tone`…) | Передавать компонентам `className` и `style` |
| Писать свои функции-компоненты, которые возвращают **только** компоненты Sloyka (страницы, обёртки с состоянием, загрузку данных) | Писать CSS для классов `.sl-*` и использовать их в разметке |
| Подключать шаблон темы `sloyka/templates/…` | Импортировать внутренности пакета (`sloyka/dist/…`) |
| Управлять вкладками, модалками, меню через props | Подключать `styled-components`, `@emotion/styled` для обхода правил |

Почему так: все сайты выглядят одинаково и обновляются одной версией пакета. Правка вида делается один раз в библиотеке, а не в каждом проекте.

**Нужного компонента нет?** Не собирайте его из тегов. Напишите владельцу библиотеки, что нужно и где. Он добавит компонент в Sloyka, и он появится в следующей версии.

Правила проверяются автоматически (раздел 6). Сборка с нарушением падает.

## 2. Установка

```bash
npm i sloyka@1.0.0
```

Ставьте точную версию. Обновление — смена версии в `package.json` (раздел 8).

Подключение один раз в корне приложения:

```tsx
// Vite: src/main.tsx
import 'sloyka/styles.css';
import { ThemeProvider, ToastProvider } from 'sloyka';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </ThemeProvider>,
);
```

```tsx
// Next.js: app/layout.tsx — здесь <html> и <body> разрешены
import 'sloyka/styles.css';
import { ThemeProvider, ThemeScript, ToastProvider } from 'sloyka';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

`ThemeScript` ставит сохранённую тему до отрисовки, поэтому страница не мигает. `suppressHydrationWarning` нужен, потому что скрипт меняет атрибут `data-theme` у `<html>` раньше React.

## 3. Где что лежит

| Что | В репозитории | В пакете (`node_modules/sloyka`) | Импорт |
|---|---|---|---|
| Компоненты | `src/react/components/<имя>/` | `dist/` | `import { Button } from 'sloyka'` |
| Стили | `src/components/*/*.css`, `src/tokens/` | `dist/styles.css` | `import 'sloyka/styles.css'` |
| Шаблоны темы | `templates/*.css` | `templates/` | `import 'sloyka/templates/<имя>.css'` |
| Список компонентов и props | генерируется | `components.json` | `sloyka/components.json` |
| Проверка проекта | `src/check/`, `bin/` | `dist/check/`, `bin/sloyka-check.js` | `sloyka-check`, `sloyka/eslint`, `sloyka/stylelint` |
| Истории Storybook | `src/components/<имя>/<Имя>.stories.tsx` | — | `npm run storybook` |
| Справочник для Claude | `plugin/skills/sloyka/` | — | плагин `sloyka` |

## 4. Компоненты

Полный список props с допустимыми значениями — `plugin/skills/sloyka/components.md` (генерируется из `components.json`) и вкладка Controls в Storybook.

| № | Группа | Компоненты |
|---|---|---|
| 00 | Основа | `Text`, `Stack`, `Grid`, `Page`, `Link`, `Image`, `Form`, `Icon`, `ThemeProvider`, `ThemeScript`, `ThemeToggle` |
| 01 | Кнопки | `Button`, `ButtonGroup` |
| 02 | Поля ввода | `Field`, `Search`, `Select`, `Textarea`, `Compose` |
| 03 | Переключатели | `Segmented`, `Switch`, `Checkbox`, `Radio`, `RadioGroup` |
| 04 | Теги и счётчики | `Tag`, `Count`, `Chip` |
| 05 | Статусы | `Status`, `StatusPill` |
| 06 | Карточка объекта | `Card`, `Card.Head`, `Card.Foot`, `KeyValue` |
| 07 | Карточка показателя | `Metric` |
| 08 | Карточки-ссылки и шаги | `LinkCard`, `Steps` |
| 09 | Баннеры | `Banner`, `Banner.Item` |
| 10 | Сводка цифрами | `Stats` |
| 11 | Список с группами | `List`, `Row`, `Group` |
| 12 | Раскрывающиеся разделы | `Disclosure` |
| 13 | Таблица | `Table` |
| 14 | Пустое состояние и загрузка файла | `Empty`, `Dropzone` |
| 15 | Заголовок страницы и панель фильтров | `PageHeader`, `Toolbar`, `Toolbar.End` |
| 16 | Верхняя панель | `Topbar` |
| 17 | Строка состояния и плавающие кнопки | `StatusBar`, `DockButton` |
| 18 | Меню аккаунта | `Menu`, `Menu.Item`, `Menu.Separator` |
| 19 | Выбор из плиток | `Picker`, `Tile` |
| 20 | Плавающее окно | `Window` |
| 21 | Модальное окно | `Modal` |
| 22 | Уведомления и подсказка | `ToastProvider` + `useToast()`, `Tooltip` |
| 23 | Карточка входа | `Login` |
| 24 | Боковое меню и каркас | `Shell`, `Nav`, `Nav.Section`, `Nav.Item` |

Пример страницы:

```tsx
import { Shell, Topbar, Nav, PageHeader, Toolbar, Search, Button, Grid, Card, KeyValue, Status, Table, ThemeToggle, useToast } from 'sloyka';

export function Objects({ rows, events }: { rows: Obj[]; events: Ev[] }) {
  const toast = useToast();
  return (
    <Shell
      topbar={
        <Topbar brand={{ mark: 'П', name: 'Пульт' }} title="Объекты">
          <ThemeToggle />
        </Topbar>
      }
      nav={
        <Nav current="/">
          <Nav.Item href="/" icon="grid">Объекты</Nav.Item>
          <Nav.Item href="/journal" icon="journal" count={3}>Журнал</Nav.Item>
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
        {rows.map(o => (
          <Card key={o.id} accent={o.state}>
            <Card.Head title={o.name} />
            <KeyValue items={[['Адрес', o.address], ['Статус', <Status tone={o.state}>{o.stateText}</Status>]]} />
          </Card>
        ))}
      </Grid>
      <Table
        columns={[{ key: 'time', title: 'Время', width: 'min' }, { key: 'text', title: 'Событие' }]}
        rows={events}
        rowKey="id"
        empty="Событий нет"
      />
    </Shell>
  );
}
```

Точные имена props у каждого компонента сверяйте со справочником: пример показывает подход, а не полный API.

### Ссылки в Next.js и react-router

Компоненты со ссылками (`Link`, `Button`, `LinkCard`, `Nav.Item`, `Row`) принимают `linkAs` — компонент роутера:

```tsx
import NextLink from 'next/link';            // или { Link } from 'react-router-dom'
<Nav.Item href="/journal" linkAs={NextLink}>Журнал</Nav.Item>
```

Без `linkAs` рисуется обычная ссылка `<a>`.

### Тема

`ThemeToggle` переключает светлую и тёмную тему и запоминает выбор (`localStorage`, ключ `sl-theme`). Из кода — `useTheme()`: `{ theme, resolvedTheme, setTheme }`.

### Уведомления

```tsx
const toast = useToast();
toast.ok('Сохранено');
toast.warn('Связь нестабильна', { title: 'Шлюз-04' });
toast.crit('Не удалось загрузить журнал');   // не исчезает сам
```

## 5. Шаблоны и референсы

**Шаблон** — свой вид поверх библиотеки: цвета темы, скругления, размеры отдельных компонентов. Собирается в Storybook на странице «Основа → Мой шаблон» и сохраняется как «Шаблон N». Подключается после стилей:

```tsx
import 'sloyka/styles.css';
import 'sloyka/templates/template-1.css';
```

Шаблон меняет только токены и размеры. Компоненты и их props остаются прежними.

**Референс** — сайт или макет, из которого берётся стиль. Добавляется в Storybook на странице «Референсы» (ссылка или файлы) и сразу даёт шаблон с тем же названием. Полный разбор делает Claude по команде «разбери референсы» (скилл `sloyka-references`).

## 6. Проверка проекта

Три входа, одни и те же правила и сообщения.

**CLI** — подключите перед сборкой:

```json
{ "scripts": { "prebuild": "sloyka-check src", "build": "vite build" } }
```

```
sloyka-check [папка] [--json] [--allow файл]
```

Вывод: `файл:строка правило → совет`. Код выхода: `0` — чисто, `1` — есть нарушения, `2` — ошибка (файл не разобран, плохой файл исключений).

**ESLint 9:**

```js
// eslint.config.js
import sloyka from 'sloyka/eslint';
export default [sloyka.configs.recommended];
```

Для `.tsx` нужен ваш обычный парсер (`typescript-eslint`).

**Stylelint 16:**

```json
{ "extends": ["sloyka/stylelint"] }
```

| Правило | Что ловит | Пример совета |
|---|---|---|
| `no-native-elements` | свои теги, `createElement('div')`, `styled.div` | `Нативный <button> не допускается. Используйте Button 01.` |
| `no-component-classname-style` | `className`, `style`, `dangerouslySetInnerHTML`, spread-пропсы у компонентов | `Button не принимает className. Внешний вид задаётся пропсами: …` |
| `no-invalid-prop-value` | значение не из списка | `Button: variant="huge" недопустимо. Допустимо: primary · default · ghost · danger.` |
| `no-deep-imports` | `sloyka/dist/…`, `sloyka/src/…` | `Импорт закрыт. Используйте публичные входы: …` |
| `no-sl-css-overrides` | CSS и классы `.sl-*` в коде сайта | `Селектор .sl-btn нацелен на внутренний класс Sloyka.` |

`<html>`, `<head>`, `<body>` разрешены в `app/layout.*`, `app/global-error.*` (Next) и `pages/_document.*`.

**Исключения** — только осознанные и временные. Файл `sloyka.allow.json` в корне проекта:

```json
{
  "ignore": [
    { "path": "src/legacy/**", "rules": ["no-native-elements"], "reason": "старая страница, переедет в марте" }
  ]
}
```

`reason` обязателен. Каждое исключение печатается при каждой проверке, чтобы не потерялось. Сейчас исключения понимает только CLI; ESLint и Stylelint их не читают.

## 7. Если правило мешает

1. Проверьте справочник: возможно, нужный вариант уже есть (`variant`, `tone`, `size`, `columns`).
2. Нет — напишите владельцу: какой компонент, где нужен, скриншот или описание.
3. Срочно и временно — исключение в `sloyka.allow.json` с причиной.

## 8. Выпуски и обновления

- Версии по semver: `1.1.0` — новое, `1.0.1` — исправления, `2.0.0` — что-то убрали или переименовали.
- В каждом выпуске на GitHub и в `CHANGELOG.md` есть раздел «Что нового и где лежит»: **Добавлено / Изменено / Удалено / Нужно поправить в сайтах** — с путём файла, историей в Storybook и строкой импорта.
- Обновление: поменяйте версию в `package.json`, `npm i`, затем `npm run build` — `sloyka-check` покажет, что нужно поправить.
- Откат: верните прежнюю версию в `package.json` и `npm i`.

## 9. Работа с Claude

Плагин `sloyka` (папка `plugin/`) учит Claude собирать страницы только из компонентов. Примеры запросов — `docs/PROMPTS.md`. На просьбу «обнови sloyka» Claude сначала показывает, что нового и где лежит, и только потом меняет код.
