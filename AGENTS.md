# AGENTS.md — работа над самой библиотекой Sloyka

Этот файл для ИИ-агентов (Codex, Cursor, Copilot, Gemini CLI, Claude…), которые меняют **репозиторий sloyka-ui**.
Если ты собираешь **сайт** на Sloyka, читай `agents/sloyka.md` (в установленном пакете: `node_modules/sloyka/agents/sloyka.md`).

## Команды
```bash
npm install
npm run build        # dist/, components.json, agents/components.md, проверка
npm test             # модульные тесты (нужен build)
npm run storybook    # витрина http://localhost:6006
npm run test:all     # build + тесты + Storybook + Playwright (скриншоты, axe, переполнение)
npm run gen:docs     # справочник скилла Claude из components.json
```

## Где что
- `src/react/components/<имя>/` — React-компоненты (TypeScript). Каждый помечен `defineMeta` (номер, группа, props, разрешённые дети) — из этого генерируется `components.json`.
- `src/components/<имя>/*.css` — стили (`@layer sl.components`, токены `--sl-*`); `src/tokens/` — токены и тема.
- `src/components/<имя>/<Имя>.stories.tsx` — истории Storybook; `tests/e2e/__screenshots__/win32` — эталоны.
- `src/check/` — `sloyka-check`, ESLint и Stylelint (общий модуль правил); `tests/check/fixtures/{good,bad}`.
- `templates/` — шаблоны темы; `references/` — референсы; `plugin/` — скиллы Claude; `agents/` — инструкция для агентов на сайтах.
- `examples/vite`, `examples/next` — сайты-примеры (зависимость `file:../..`).
- `scripts/release-notes.js` — заметки «Что нового и где лежит»; `.changeset/` — описания изменений.

## Правила
- **Вид компонентов меняется только с одобрения владельца** по скриншотам (светлая и тёмная тема рядом). Не обновляй эталоны (`--update-snapshots`) без его прямого «да».
- Компоненты не принимают `className`, `style` и `...rest`; варианты — только перечисленные props (`pick` из `src/react/core/props.ts`). Новому prop — метаданные в `defineMeta`.
- `'use client'` — только у модулей с хуками и обработчиками.
- Изменение для пользователей пакета → файл в `.changeset/` (`npx changeset`): `patch` — исправление, `minor` — новое, `major` — удалено или переименовано.
- TDD: сначала падающий тест, потом код. Перед коммитом: `npm run build && npm test && npx tsc --noEmit`.
- Тексты интерфейса и сообщений — по-русски.
- Не публикуй и не пушь без просьбы владельца. Выпуск делает GitHub Actions (PR «Version Packages» → слияние → npm).
