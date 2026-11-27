# Компоненты Sloyka — справочник

Сгенерировано `npm run gen:docs` из `components.json` (sloyka 0.1.0). Не править руками.

Импорт всех компонентов: `import { … } from 'sloyka'`. Стили один раз в корне: `import 'sloyka/styles.css'`.
Другого API нет: ни `className`, ни `style`, ни своих тегов. Значения `enum` — только из списка.

## 00 · Основа

### Form

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `action` | string |  |  |  |
| `method` | enum | get · post | 'get' |  |
| `onSubmit` | function |  |  |  |

### Grid

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `columns` | enum | 1 · 2 · 3 · 4 · auto | 'auto' |  |
| `gap` | enum | 1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 | '3' |  |
| `min` | enum | sm · md · lg | 'md' |  |

### Icon

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `name` * | enum | search · chevron-down · chevron-up · chevron-right · plus · minus · x · arrow-left · arrow-right · refresh · moon · sun · power · user · users · layers · map · panel · chat · edit · grid · filter · bell · shield · plug · server · journal · login · pulse · help · check · alert · info · upload · maximize · menu · key · target · wrench · camera · phone |  | Имя иконки из набора Sloyka |
| `size` | enum | 16 · 20 | '16' |  |

### Image

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `alt` * | string |  |  |  |
| `fit` | enum | cover · contain | 'cover' |  |
| `height` | number |  |  |  |
| `priority` | boolean |  |  |  |
| `radius` | enum | none · sm · md · lg | 'none' |  |
| `src` * | string |  |  |  |
| `width` | number |  |  |  |

### Link

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `external` | boolean |  |  |  |
| `href` * | string |  |  |  |
| `linkAs` | component |  |  |  |

### Page

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `width` | enum | narrow · default · wide · full | 'default' |  |

### Stack

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `align` | enum | start · center · end · stretch | 'stretch' |  |
| `direction` | enum | column · row | 'column' |  |
| `gap` | enum | 1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 | '3' |  |
| `justify` | enum | start · center · end · between | 'start' |  |
| `wrap` | boolean |  |  |  |

### Text

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `as` | enum | page · section · title · body · small · caption | 'body' |  |
| `inline` | boolean |  |  |  |
| `tone` | enum | default · muted · ok · warn · crit | 'default' |  |
| `weight` | enum | normal · strong | 'normal' |  |

### ThemeProvider

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `defaultTheme` | enum | light · dark · system | 'system' |  |
| `storageKey` | string |  | 'sl-theme' |  |

### ThemeScript

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `defaultTheme` | enum | light · dark · system | 'system' |  |
| `storageKey` | string |  | 'sl-theme' |  |

### ThemeToggle

Внутрь: ничего.

Без настроек.

## 01 · Кнопки

### Button

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `aria-label` | string |  |  | Обязателен при iconOnly |
| `block` | boolean |  |  |  |
| `busy` | boolean |  |  |  |
| `caps` | boolean |  |  |  |
| `disabled` | boolean |  |  |  |
| `external` | boolean |  |  |  |
| `hideLabelOnPhone` | boolean |  |  | На телефоне видна только иконка |
| `href` | string |  |  |  |
| `icon` | IconName |  |  |  |
| `iconOnly` | boolean |  |  |  |
| `linkAs` | component |  |  |  |
| `onClick` | function |  |  |  |
| `size` | enum | sm · md · lg | 'md' |  |
| `type` | enum | button · submit · reset |  |  |
| `variant` | enum | primary · default · ghost · danger | 'default' |  |

### ButtonGroup

Внутрь: Button.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `direction` | enum | column · row | 'column' |  |

## 02 · Поля ввода

### Compose

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `aria-label` | string |  | 'Сообщение' |  |
| `defaultValue` | string |  |  |  |
| `disabled` | boolean |  |  |  |
| `name` | string |  |  |  |
| `onChange` | function |  |  |  |
| `onSend` * | function |  |  |  |
| `placeholder` | string |  |  |  |
| `value` | string |  |  |  |

### Field

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `aria-label` | string |  |  |  |
| `autoComplete` | string |  |  |  |
| `defaultValue` | string |  |  |  |
| `disabled` | boolean |  |  |  |
| `error` | string |  |  |  |
| `hint` | string |  |  |  |
| `inputMode` | string |  |  |  |
| `label` | string |  |  |  |
| `name` | string |  |  |  |
| `onChange` | function |  |  |  |
| `placeholder` | string |  |  |  |
| `required` | boolean |  |  |  |
| `type` | enum | text · email · password · tel · number · url | 'text' |  |
| `value` | string |  |  |  |

### Search

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `aria-label` | string |  | 'Поиск' |  |
| `defaultValue` | string |  |  |  |
| `disabled` | boolean |  |  |  |
| `name` | string |  |  |  |
| `onChange` | function |  |  |  |
| `placeholder` | string |  |  |  |
| `value` | string |  |  |  |

### Select

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `aria-label` | string |  |  |  |
| `defaultValue` | string |  |  |  |
| `disabled` | boolean |  |  |  |
| `error` | string |  |  |  |
| `hint` | string |  |  |  |
| `label` | string |  |  |  |
| `name` | string |  |  |  |
| `onChange` | function |  |  |  |
| `options` * | { value: string; label: string }[] |  |  |  |
| `required` | boolean |  |  |  |
| `value` | string |  |  |  |

### Textarea

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `aria-label` | string |  |  |  |
| `defaultValue` | string |  |  |  |
| `disabled` | boolean |  |  |  |
| `error` | string |  |  |  |
| `hint` | string |  |  |  |
| `label` | string |  |  |  |
| `name` | string |  |  |  |
| `onChange` | function |  |  |  |
| `placeholder` | string |  |  |  |
| `required` | boolean |  |  |  |
| `value` | string |  |  |  |

## 03 · Переключатели

### Checkbox

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `checked` | boolean |  |  |  |
| `defaultChecked` | boolean |  |  |  |
| `disabled` | boolean |  |  |  |
| `name` | string |  |  |  |
| `onChange` | function |  |  |  |

### Radio

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `checked` | boolean |  |  |  |
| `defaultChecked` | boolean |  |  |  |
| `disabled` | boolean |  |  |  |
| `name` | string |  |  |  |
| `onChange` | function |  |  |  |
| `value` * | string |  |  |  |

### RadioGroup

Внутрь: Radio.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `aria-label` | string |  |  |  |
| `defaultValue` | string |  |  |  |
| `direction` | enum | column · row | 'column' |  |
| `name` | string |  |  |  |
| `onChange` | function |  |  |  |
| `value` | string |  |  |  |

### Segmented

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `aria-label` | string |  |  |  |
| `block` | boolean |  |  |  |
| `defaultValue` | string |  |  |  |
| `onChange` | function |  |  |  |
| `options` * | { value: string; label: string }[] |  |  |  |
| `value` | string |  |  |  |

### Switch

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `checked` | boolean |  |  |  |
| `defaultChecked` | boolean |  |  |  |
| `disabled` | boolean |  |  |  |
| `name` | string |  |  |  |
| `onChange` | function |  |  |  |

## 04 · Теги и счётчики

### Chip

Внутрь: Count.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `count` | number |  |  |  |
| `icon` | IconName |  |  |  |

### Count

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `solid` | boolean |  |  |  |

### Tag

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `tone` | enum | default · solid · ok · warn · crit | 'default' |  |

## 05 · Статусы

### Status

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `note` | string |  |  |  |
| `plain` | boolean |  |  |  |
| `tone` | enum | ok · warn · crit · off · hollow | 'off' |  |

### StatusPill

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `tone` | enum | ok · warn · crit · off · hollow | 'off' |  |

## 06 · Карточка объекта

### Card

Внутрь: Card.Head, Card.Foot, KeyValue, Metric, Table, Button, ButtonGroup, Field, Search, Select, Textarea, Compose, Segmented, Switch, Checkbox, Radio, RadioGroup, Tag, Count, Chip, Status, StatusPill, Text, Stack, Grid, Link, Image.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `accent` | enum | ok · warn · crit · off |  |  |
| `href` | string |  |  |  |
| `interactive` | boolean |  |  |  |
| `linkAs` | component |  |  |  |

### Card.Foot

Внутрь: Status, StatusPill, Tag, Count, Button, ButtonGroup, Text, Link.

Без настроек.

### Card.Head

Внутрь: Tag, Count, Chip, Status, StatusPill, Button.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `aside` | ReactNode |  |  |  |
| `icon` | IconName |  |  |  |
| `subtitle` | string |  |  |  |
| `title` * | string |  |  |  |

### KeyValue

Внутрь: Tag, Count, Chip, Status, StatusPill, Text, Link.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `items` * | [label, node][] |  |  |  |

## 07 · Карточка показателя

### Metric

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `label` * | string |  |  |  |
| `note` | string |  |  |  |
| `unit` | string |  | '%' |  |
| `value` * | number |  |  |  |

## 08 · Карточки-ссылки и шаги

### LinkCard

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `href` * | string |  |  |  |
| `icon` * | IconName |  |  |  |
| `linkAs` | component |  |  |  |
| `text` * | string |  |  |  |
| `title` * | string |  |  |  |

### Steps

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `items` * | { title, text }[] |  |  |  |

## 09 · Баннеры

### Banner

Внутрь: Banner.Item, Button, Text, Stack.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `icon` | IconName |  |  |  |
| `title` * | string |  |  |  |
| `tone` | enum | ok · warn · crit | 'ok' |  |

### Banner.Item

Внутрь: Button, Text, Link.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `action` | ReactNode |  |  |  |

## 10 · Сводка цифрами

### Stats

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `items` * | { label, value, tone? }[] |  |  |  |

## 11 · Список с группами

### Group

Внутрь: Row.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `collapsed` | boolean |  |  |  |
| `count` | number |  |  |  |
| `defaultCollapsed` | boolean |  |  |  |
| `onToggle` | function |  |  |  |
| `title` * | string |  |  |  |

### List

Внутрь: Group, Row.

Без настроек.

### Row

Внутрь: Status, StatusPill.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `chevron` | boolean |  |  |  |
| `current` | boolean |  |  |  |
| `href` | string |  |  |  |
| `linkAs` | component |  |  |  |
| `onClick` | function |  |  |  |
| `status` | ReactNode |  |  |  |
| `title` * | string |  |  |  |

## 12 · Раскрывающиеся разделы

### Disclosure

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `defaultOpen` | boolean |  |  |  |
| `title` * | string |  |  |  |

## 13 · Таблица

### Table

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `columns` * | TableColumn[] |  |  |  |
| `empty` | ReactNode |  |  |  |
| `onRowClick` | function |  |  |  |
| `rowKey` * | string \| function |  |  |  |
| `rows` * | object[] |  |  |  |
| `stack` | boolean |  | true |  |

## 14 · Пустое состояние и загрузка файла

### Dropzone

Внутрь: Button, Text, Stack.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `action` | ReactNode |  |  |  |
| `icon` * | IconName |  |  |  |
| `text` | string |  |  |  |
| `title` * | string |  |  |  |

### Empty

Внутрь: Button, Text, Stack.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `action` | ReactNode |  |  |  |
| `icon` * | IconName |  |  |  |
| `text` | string |  |  |  |
| `title` * | string |  |  |  |

## 15 · Заголовок страницы и панель фильтров

### PageHeader

Внутрь: Text, Tag, Count, Status, StatusPill, Chip.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `aside` | ReactNode |  |  |  |
| `title` * | string |  |  |  |

### Toolbar

Внутрь: Button, ButtonGroup, Field, Search, Select, Textarea, Compose, Segmented, Switch, Checkbox, Radio, RadioGroup, Toolbar.End.

Без настроек.

### Toolbar.End

Внутрь: Button, ButtonGroup, Field, Search, Select, Textarea, Compose, Segmented, Switch, Checkbox, Radio, RadioGroup.

Без настроек.

## 16 · Верхняя панель админки

### Topbar

Внутрь: Button, ButtonGroup, ThemeToggle, Menu.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `brand` * | { mark, name } |  |  |  |
| `title` | string |  |  |  |

## 17 · Строка состояния и плавающие кнопки

### DockButton

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `chevron` | enum | up · down |  |  |
| `icon` | IconName |  |  |  |
| `onClick` | function |  |  |  |

### StatusBar

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `items` * | { label, value }[] |  |  |  |
| `system` | { tone, text, label? } |  |  |  |

## 18 · Меню аккаунта

### Menu

Внутрь: Menu.Item, Menu.Separator.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `header` | { name, role? } |  |  |  |

### Menu.Item

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `danger` | boolean |  |  |  |
| `href` | string |  |  |  |
| `icon` | IconName |  |  |  |
| `linkAs` | component |  |  |  |
| `onClick` | function |  |  |  |

### Menu.Separator

Внутрь: ничего.

Без настроек.

## 19 · Выбор из плиток

### Picker

Внутрь: Tile.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `title` * | string |  |  |  |

### Tile

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `disabled` | boolean |  |  |  |
| `href` | string |  |  |  |
| `linkAs` | component |  |  |  |
| `note` | string |  |  |  |
| `onClick` | function |  |  |  |
| `selected` | boolean |  |  |  |

## 20 · Плавающее окно

### Window

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `bar` | ReactNode |  |  |  |
| `footer` | ReactNode |  |  |  |
| `icon` | IconName |  |  |  |
| `onClose` | function |  |  |  |
| `title` * | string |  |  |  |

## 21 · Модальное окно

### Modal

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `defaultOpen` | boolean |  |  |  |
| `footer` | ReactNode |  |  |  |
| `onOpenChange` | function |  |  |  |
| `open` | boolean |  |  |  |
| `size` | enum | sm · md · lg | 'md' |  |
| `title` * | string |  |  |  |

## 22 · Уведомления и подсказка

### ToastProvider

Внутрь: текст и любые компоненты Sloyka.

Без настроек.

### Tooltip

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `defaultOpen` | boolean |  |  |  |
| `onOpenChange` | function |  |  |  |
| `open` | boolean |  |  |  |
| `text` * | string |  |  |  |

## 23 · Карточка входа

### Login

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `brand` * | { mark, name } |  |  |  |
| `button` | string |  | 'Войти' |  |
| `error` | string |  |  |  |
| `footer` | ReactNode |  |  |  |
| `onSubmit` * | function |  |  |  |
| `passLabel` | string |  | 'Пароль' |  |
| `userLabel` | string |  | 'Имя пользователя' |  |

## 24 · Боковое меню: полное и рейл

### Nav

Внутрь: Nav.Section, Nav.Item.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `aria-label` | string |  | 'Разделы' |  |
| `current` | string |  |  |  |
| `id` | string |  |  |  |
| `rail` | boolean |  |  |  |

### Nav.Item

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `count` | number \| string |  |  |  |
| `href` * | string |  |  |  |
| `icon` * | IconName |  |  |  |
| `id` | string |  |  |  |
| `linkAs` | component |  |  |  |

### Nav.Section

Внутрь: ничего.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `title` * | string |  |  |  |

### Shell

Внутрь: текст и любые компоненты Sloyka.

| Проп | Тип | Значения | По умолчанию | Заметка |
|---|---|---|---|---|
| `defaultNavOpen` | boolean |  |  |  |
| `nav` * | ReactNode |  |  |  |
| `navOpen` | boolean |  |  |  |
| `onNavOpenChange` | function |  |  |  |
| `topbar` * | ReactNode |  |  |  |

## Хуки

- `useToast()` → `{ ok, warn, crit, info }`, каждый вызывается как `(text, { title?, duration? })` и возвращает `{ close }`. `crit` не скрывается сам, остальные — через 5 с. Только внутри `<ToastProvider>`.
- `useTheme()` → `{ theme, resolvedTheme, setTheme }`, `theme`: `light | dark | system`. Только внутри `<ThemeProvider>`.

## Шаблоны в пакете

Пока нет опубликованных шаблонов.
