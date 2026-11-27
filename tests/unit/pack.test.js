import { it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

let files = [];
beforeAll(() => {
  const out = JSON.parse(execSync('npm pack --dry-run --json', { encoding: 'utf8' }));
  files = out[0].files.map(f => f.path.replace(/\\/g, '/'));
}, 120000);

it('package identity', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  expect(pkg.name).toBe('sloyka');
  expect(pkg.license).toBe('MIT');
  expect(pkg.publishConfig).toBeUndefined();
});

it('npm pack contains public entry points', () => {
  for (const f of ['dist/index.js', 'components.json', 'dist/index.d.ts', 'dist/styles.css', 'README.md', 'LICENSE'])
    expect(files, f).toContain(f);
  expect(files.some(f => /^dist\/fonts\/.+\.woff2$/.test(f))).toBe(true);
  expect(files.some(f => /^templates\/.+/.test(f))).toBe(true);
});

it('npm pack excludes sources, tests and stories', () => {
  expect(files.filter(f => /^(src|tests|\.storybook)\//.test(f) || f.endsWith('.stories.js'))).toEqual([]);
});

it('every export path exists after build', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  for (const [key, target] of Object.entries(pkg.exports)) {
    const t = typeof target === 'string' ? target : target.import;
    const path = t.replace('*', 'README.md').replace(/^\.\//, '');
    expect(existsSync(path), `${key} → ${path}`).toBe(true);
  }
});
