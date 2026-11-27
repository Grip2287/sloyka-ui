import { it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

type Prop = { type: string; options?: string[]; default?: unknown; required?: boolean; description?: string };
type Comp = { name: string; n: string; group: string; import: string; allowed: 'any' | 'none' | string[]; props: Record<string, Prop> };
type Manifest = {
  name: string; version: string;
  groups: { n: string; title: string; components: string[] }[];
  components: Record<string, Comp>;
  templates: string[];
};

const load = (): Manifest => JSON.parse(readFileSync('components.json', 'utf8'));
const SERVICE = ['Icon', 'Text', 'Stack', 'Grid', 'Page', 'Link', 'Image', 'Form', 'ThemeProvider', 'ThemeToggle', 'ThemeScript'];

it('components.json exists and carries package identity', () => {
  expect(existsSync('components.json')).toBe(true);
  const m = load();
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  expect(m.name).toBe('sloyka');
  expect(m.version).toBe(pkg.version);
});

it('has 24 non-empty groups numbered 01-24 plus services under 00', () => {
  const m = load();
  const numbered = m.groups.filter(g => g.n !== '00');
  expect(numbered.map(g => g.n)).toEqual(Array.from({ length: 24 }, (_, i) => String(i + 1).padStart(2, '0')));
  for (const g of m.groups) expect(g.components.length, g.n).toBeGreaterThan(0);
  expect(m.groups[0].n).toBe('00');
});

it('every component has name, n, props and allowed', () => {
  const m = load();
  for (const [key, c] of Object.entries(m.components)) {
    expect(c.name, key).toBe(key);
    expect(c.n, key).toMatch(/^\d\d$/);
    expect(c.import).toBe('sloyka');
    expect(c.props && typeof c.props, key).toBe('object');
    expect(c.allowed === 'any' || c.allowed === 'none' || Array.isArray(c.allowed), key).toBe(true);
    for (const [p, spec] of Object.entries(c.props)) expect(typeof spec.type, `${key}.${p}`).toBe('string');
  }
});

it('only service components use 00; everything else is numbered 01-24', () => {
  const m = load();
  for (const c of Object.values(m.components)) {
    const root = c.name.split('.')[0];
    if (c.n === '00') expect(SERVICE, c.name).toContain(root);
    else expect(SERVICE, c.name).not.toContain(root);
  }
  for (const s of SERVICE) expect(m.components[s]?.n, s).toBe('00');
});

it('groups list exactly the components of their number, sorted', () => {
  const m = load();
  for (const g of m.groups) {
    const expected = Object.values(m.components).filter(c => c.n === g.n).map(c => c.name);
    expect([...g.components].sort(), g.n).toEqual([...expected].sort());
    expect(new Set(Object.values(m.components).filter(c => c.n === g.n).map(c => c.group)).size, g.n).toBe(1);
  }
});

it('every marked export of dist/index.js (and its parts) is in the manifest', async () => {
  const m = load();
  const mod: Record<string, any> = await import('../../dist/index.js');
  const found: string[] = [];
  for (const [key, val] of Object.entries(mod)) {
    if (!val || (typeof val !== 'function' && typeof val !== 'object')) continue;
    if (val.__sloyka) found.push(val.__sloyka.name);
    for (const sub of Object.values(val) as any[]) if (sub && sub.__sloyka) found.push(sub.__sloyka.name);
    if (val.__sloyka) expect(m.components[val.__sloyka.name], key).toBeDefined();
  }
  expect(found.length).toBeGreaterThan(50);
  for (const name of found) expect(m.components[name], name).toBeDefined();
  expect(Object.keys(m.components).sort()).toEqual([...new Set(found)].sort());
});

it('allowed lists only name components present in the manifest', () => {
  const m = load();
  for (const c of Object.values(m.components))
    if (Array.isArray(c.allowed)) for (const a of c.allowed) expect(m.components[a], `${c.name} → ${a}`).toBeDefined();
});

it('prop defaults lie within their options', () => {
  const m = load();
  for (const c of Object.values(m.components))
    for (const [p, s] of Object.entries(c.props))
      if (s.options && s.default !== undefined) expect(s.options, `${c.name}.${p}`).toContain(s.default);
});

it('output is deterministic: sorted by n then name, 2-space JSON, trailing newline', () => {
  const raw = readFileSync('components.json', 'utf8');
  expect(raw.endsWith('}\n')).toBe(true);
  expect(raw).toBe(JSON.stringify(JSON.parse(raw), null, 2) + '\n');
  const m = load();
  const keys = Object.keys(m.components);
  expect(keys).toEqual([...keys].sort((a, b) => {
    const A = m.components[a], B = m.components[b];
    return A.n === B.n ? (a < b ? -1 : a > b ? 1 : 0) : A.n < B.n ? -1 : 1;
  }));
});

it('templates list matches published templates/*.css without demo-*', () => {
  const expected = readdirSync('templates').filter(f => f.endsWith('.css') && !f.startsWith('demo-')).sort();
  expect(load().templates).toEqual(expected);
});
