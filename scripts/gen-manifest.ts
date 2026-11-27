// Собирает components.json из меток `__sloyka`, которые компоненты несут в собранном dist/index.js.
// Запускается из `npm run build` после vite build. Вывод детерминирован.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

type Meta = { n: string; group: string; name: string; allowed: unknown; props: Record<string, Record<string, unknown>> };

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const mod: Record<string, any> = await import(pathToFileURL(resolve('dist/index.js')).href);

const seen = new Set<Meta>();
for (const value of Object.values(mod)) {
  if (!value || (typeof value !== 'function' && typeof value !== 'object')) continue;
  if (value.__sloyka) seen.add(value.__sloyka);
  for (const part of Object.values(value) as any[]) if (part && part.__sloyka) seen.add(part.__sloyka);
}

const metas = [...seen];
const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
metas.sort((a, b) => cmp(a.n, b.n) || cmp(a.name, b.name));

const sortKeys = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => cmp(a, b)));

const components: Record<string, unknown> = {};
const groups: { n: string; title: string; components: string[] }[] = [];
for (const m of metas) {
  if (components[m.name]) throw new Error(`Sloyka manifest: duplicate component ${m.name}`);
  const props = Object.fromEntries(
    Object.entries(m.props).sort(([a], [b]) => cmp(a, b)).map(([k, spec]) => [k, sortKeys(spec)]),
  );
  components[m.name] = { allowed: m.allowed, group: m.group, import: 'sloyka', n: m.n, name: m.name, props };
  let g = groups.find(x => x.n === m.n);
  if (!g) groups.push((g = { n: m.n, title: m.group, components: [] }));
  g.components.push(m.name);
}

const templates = readdirSync('templates').filter(f => f.endsWith('.css') && !f.startsWith('demo-')).sort();

const manifest = { name: pkg.name, version: pkg.version, groups, components, templates };
writeFileSync('components.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`components.json: ${metas.length} components, ${groups.length} groups, ${templates.length} templates`);
