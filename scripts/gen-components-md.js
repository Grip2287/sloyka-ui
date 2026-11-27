// Генерирует plugin/skills/sloyka/components.md из components.json (манифест собирается в npm run build),
// чтобы справочник для Claude не расходился с кодом.
import { readFileSync, writeFileSync } from 'node:fs';

const m = JSON.parse(readFileSync('components.json', 'utf8'));
const out = [
  '# Компоненты Sloyka — справочник',
  '',
  `Сгенерировано \`npm run gen:docs\` из \`components.json\` (sloyka ${m.version}). Не править руками.`,
  '',
  "Импорт всех компонентов: `import { … } from 'sloyka'`. Стили один раз в корне: `import 'sloyka/styles.css'`.",
  'Другого API нет: ни `className`, ни `style`, ни своих тегов. Значения `enum` — только из списка.',
  '',
];

const cell = x => String(x ?? '').replace(/\|/g, '\\|');
const fmt = v => (typeof v === 'string' ? `'${v}'` : JSON.stringify(v));
const allowed = a => (a === 'any' ? 'текст и любые компоненты Sloyka' : a === 'none' ? 'ничего' : a.join(', '));

for (const g of m.groups) {
  out.push(`## ${g.n} · ${g.title}`, '');
  for (const name of g.components) {
    const c = m.components[name];
    out.push(`### ${name}`, '', `Внутрь: ${allowed(c.allowed)}.`, '');
    const props = Object.entries(c.props);
    if (!props.length) { out.push('Без настроек.', ''); continue; }
    out.push('| Проп | Тип | Значения | По умолчанию | Заметка |', '|---|---|---|---|---|');
    for (const [p, s] of props) {
      out.push(`| \`${p}\`${s.required ? ' *' : ''} | ${cell(s.type)} | ${cell(s.options?.join(' · '))} | ${s.default === undefined ? '' : cell(fmt(s.default))} | ${cell(s.description)} |`);
    }
    out.push('');
  }
}
out.push(
  '## Хуки',
  '',
  '- `useToast()` → `{ ok, warn, crit, info }`, каждый вызывается как `(text, { title?, duration? })` и возвращает `{ close }`. `crit` не скрывается сам, остальные — через 5 с. Только внутри `<ToastProvider>`.',
  '- `useTheme()` → `{ theme, resolvedTheme, setTheme }`, `theme`: `light | dark | system`. Только внутри `<ThemeProvider>`.',
  '',
  '## Шаблоны в пакете',
  '',
  m.templates.length ? m.templates.map(t => `- \`sloyka/templates/${t}\``).join('\n') : 'Пока нет опубликованных шаблонов.',
  '',
);
// Без аргумента — справочник скилла Claude; при сборке пакета — agents/components.md для других ИИ-агентов.
const target = process.argv[2] ?? 'plugin/skills/sloyka/components.md';
writeFileSync(target, out.join('\n'));
console.log(`${target}: ${Object.keys(m.components).length} компонентов`);
