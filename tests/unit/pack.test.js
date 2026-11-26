import { it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

let files = [];
beforeAll(() => {
  const out = JSON.parse(execSync('npm pack --dry-run --json', { encoding: 'utf8' }));
  files = out[0].files.map(f => f.path.replace(/\\/g, '/'));
}, 120000);

it('npm pack contains public entry points', () => {
  for (const f of ['dist/sloyka.css', 'dist/sloyka.min.css', 'dist/core.css', 'dist/sloyka.js', 'dist/theme-init.js', 'dist/icons.js', 'README.md'])
    expect(files, f).toContain(f);
  expect(files.some(f => /^dist\/components\/.+\.css$/.test(f))).toBe(true);
  expect(files.some(f => /^dist\/fonts\/.+\.woff2$/.test(f))).toBe(true);
});

it('npm pack excludes sources, tests and stories', () => {
  expect(files.filter(f => /^(src|tests|\.storybook)\//.test(f) || f.endsWith('.stories.js'))).toEqual([]);
});

it('every export path exists after build', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  expect(pkg.exports['./core.css'], 'core.css exported').toBe('./dist/core.css');
  for (const [key, target] of Object.entries(pkg.exports)) {
    const probe = target.replace('*', key.includes('components') ? 'button' : 'inter-latin-400-normal').replace(/^\.\//, '');
    const path = key.includes('fonts') ? probe + '.woff2' : probe;
    expect(existsSync(path), `${key} → ${path}`).toBe(true);
  }
});
