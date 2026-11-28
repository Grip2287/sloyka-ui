---
'sloyka': patch
---

Исправлено: компоненты в 1.0.0 были собраны в режиме разработки (`jsxDEV`), из-за чего боевая сборка Next.js падала на пререндере (`jsxDEV is not a function`). Теперь пакет всегда собирается как production; тест следит за этим.

Документация: установка через pnpm и yarn (`pnpm add sloyka`, `pnpm exec sloyka-check`), проверка встраивается в команду `build` (`"build": "sloyka-check src && vite build"`) — так она работает во всех менеджерах пакетов.
