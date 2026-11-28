# AGENTS.md

Модуль для «Предиката»: интерфейс — только нативные компоненты Sloyka (HTML + CSS), без React.
Перед любой правкой интерфейса прочитай и выполняй:
- node_modules/sloyka/agents/sloyka.md — правила, «Способ B. Нативные компоненты»
- node_modules/sloyka/agents/native-components.md — разметка всех компонентов

Свой JS (app.js) — только обработчики событий: разметку и классы sl-* не создаёт и не меняет.
Перед сдачей: `npx sloyka-check .` — ноль нарушений.
