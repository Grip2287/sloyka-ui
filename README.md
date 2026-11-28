# Sloyka

Библиотека компонентов для операторских панелей и админок. Светлая и тёмная тема, адаптив под телефон, планшет и монитор.

Каждый компонент есть **в двух вариантах с одинаковым видом**: React (Vite, Next.js App Router) и **нативный — HTML + CSS** без React (у компонентов с поведением — свой маленький скрипт). ИИ-агент сам выбирает нативный вариант, если в запросе есть слово «Предикат» или «только HTML и CSS».

Сайт собирается **только из компонентов** Sloyka: свои теги, `className`, `style` и CSS для `.sl-*` запрещены, и это проверяется при сборке. Поэтому все сайты выглядят одинаково и обновляются одной версией пакета.

📘 **Полная инструкция — [docs/GUIDE.md](docs/GUIDE.md).** Примеры запросов к Claude — [docs/PROMPTS.md](docs/PROMPTS.md).

## Быстрый старт

```bash
npm i sloyka@2.0.0     # или: pnpm add sloyka@2.0.0 · yarn add sloyka@2.0.0
```

```tsx
import 'sloyka/styles.css';
import { ThemeProvider, ToastProvider, Shell, Topbar, Nav, PageHeader, Button, ThemeToggle } from 'sloyka';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Shell
          topbar={<Topbar brand={{ mark: 'П', name: 'Пульт' }}><ThemeToggle /></Topbar>}
          nav={<Nav current="/"><Nav.Item href="/" icon="grid">Объекты</Nav.Item></Nav>}
        >
          <PageHeader title="Объекты" />
          <Button variant="primary" icon="plus">Добавить</Button>
        </Shell>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

Тот же пример нативными компонентами (HTML + CSS):

```html
<link rel="stylesheet" href="node_modules/sloyka/dist/styles.css">
<!-- каркас из node_modules/sloyka/native/shell.html, кнопка из native/button.html -->
<button class="sl-btn sl-btn--primary">Добавить</button>
<script src="node_modules/sloyka/native/shell.js"></script>
```

Все фрагменты — `native/*.html`, справочник — `agents/native-components.md`, подробно — [GUIDE, раздел 4А](docs/GUIDE.md#4а-нативные-компоненты-html--css).

Проверка проекта перед сборкой:

```json
{ "scripts": { "build": "sloyka-check src && vite build" } }
```

Плюс по желанию `sloyka/eslint` и `sloyka/stylelint` — см. GUIDE, раздел 6.

## Что внутри

| Вход | Что это |
|---|---|
| `sloyka` | компоненты 01–24, `useToast`, `useTheme` |
| `sloyka/styles.css` | все стили (один файл) |
| `sloyka/templates/*` | шаблоны темы |
| `sloyka/native/*` | нативные компоненты: фрагменты `*.html`, скрипты поведения `*.js`, `components.json` |
| `sloyka/components.json` | список компонентов, props и допустимых значений |
| `sloyka-check`, `sloyka/check` | проверка проекта (CLI и API) |
| `sloyka/eslint`, `sloyka/stylelint` | те же правила в редакторе |

## Storybook

```bash
npm install
npm run storybook        # http://localhost:6006
```

Каждый компонент показан в двух темах на любой ширине, у каждого есть песочница (Controls) с размером и скруглением, а панель **«Код»** показывает пример на React и тот же пример на HTML + CSS. В npm-пакет Storybook не входит — только в репозитории. Подробно: [GUIDE → Storybook](docs/GUIDE.md#storybook--витрина-компонентов).

**Шаблоны.** В песочнице настройте размер и скругление и нажмите «＋ В шаблон». Цвета — «Основа → Редактор темы». Всё собирается на странице «Основа → Мой шаблон», сохраняется как «Шаблон N» в `templates/`. На сайте: `import 'sloyka/templates/template-1.css'` после стилей. Все шаблоны — «Основа → Все шаблоны».

**Референсы.** «Референсы → Добавить референс»: ссылка или файлы. Шаблон с названием референса создаётся сразу. Подробный разбор по компонентам — команда Claude «разбери референсы».

## Версии

Semver. Каждый выпуск сопровождается заметкой «Что нового и где лежит» (Добавлено / Изменено / Удалено / Нужно поправить в сайтах) в `CHANGELOG.md` и на странице выпуска. Обновление — смена версии и `npm i`; откат — вернуть прежнюю версию.

Версия 0.1.x (HTML + веб-компоненты) сохранена тегом `v0.1.0` и пакетом `@grip2287/sloyka@0.1.0`.

## ИИ-агенты (Codex, Cursor, Copilot, Gemini CLI)

В пакете есть инструкция для агентов: `node_modules/sloyka/agents/sloyka.md` (выбор React или HTML + CSS, правила) и справочники `agents/components.md` и `agents/native-components.md`. Добавьте в корень сайта `AGENTS.md` со ссылкой на них — готовый текст в [GUIDE, раздел 9](docs/GUIDE.md#9-работа-с-ии-агентами). Для работы над самой библиотекой — [AGENTS.md](AGENTS.md).

## Плагин для Claude Code

В `plugin/` лежат скиллы `sloyka` (сборка страниц из компонентов) и `sloyka-references` (разбор референсов).

```
/plugin marketplace add Grip2287/sloyka-ui
/plugin install sloyka@sloyka
```

Справочник компонентов для скилла собирается командой `npm run gen:docs` (после `npm run build`).

## Разработка

```bash
npm run build       # dist/, components.json, проверка
npm test            # модульные тесты
npm run test:all    # сборка + тесты + Storybook + браузерные проверки
```

Браузерные проверки прогоняют каждую историю в двух темах на ширинах 390, 1024 и 1440: горизонтальная прокрутка, обрезанный текст, доступность (axe) и сравнение со скриншотами-эталонами.

## Лицензия

MIT
