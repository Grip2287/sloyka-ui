// Проверка проекта написана на чистом JS: в dist/check попадает как есть (вместе с .d.ts).
import { cpSync, mkdirSync, readdirSync } from 'node:fs';

mkdirSync('dist/check', { recursive: true });
for (const f of readdirSync('src/check').filter(f => /\.(js|d\.ts)$/.test(f))) cpSync(`src/check/${f}`, `dist/check/${f}`);
