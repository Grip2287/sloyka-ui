// Генерирует plugin/skills/sloyka/components.md из историй Storybook, чтобы справочник не расходился с кодом.
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = 'src/components';
const parts = ['# Компоненты Sloyka — разметка для копирования', '', 'Сгенерировано `node scripts/gen-components-md.js` из историй Storybook. Иконки: `<i data-ic="имя">` + `slHydrateIcons()` или `slIcon(имя)`.', ''];
const files = readdirSync(dir).flatMap(d => readdirSync(join(dir, d)).filter(f => f.endsWith('.stories.js')).map(f => join(dir, d, f))).sort();
const mods = await Promise.all(files.map(async f => [f, await import(pathToFileURL(f).href)]));
mods.sort((a, b) => a[1].default.title.localeCompare(b[1].default.title, 'ru'));
for (const [, m] of mods) {
  const { title, parameters } = m.default;
  parts.push(`## ${title.split('/').pop()}`, '', parameters?.docs?.description?.component || '', '');
  for (const [name, story] of Object.entries(m)) {
    if (name === 'default' || !story.render) continue;
    parts.push(`### ${story.name || name}`, '', '```html', story.render({ ...(m.default.args || {}), ...(story.args || {}) }).trim(), '```', '');
  }
}
writeFileSync('plugin/skills/sloyka/components.md', parts.join('\n'));
console.log(`components.md: ${mods.length} stories files`);
