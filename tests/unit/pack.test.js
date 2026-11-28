import { it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { sep } from 'node:path';

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
  for (const f of ['dist/index.js', 'components.json', 'dist/index.d.ts', 'dist/styles.css', 'README.md', 'LICENSE',
    'bin/sloyka-check.js', 'dist/check/index.js', 'dist/check/index.d.ts', 'dist/check/cli.js', 'dist/check/rules.js', 'dist/check/analyze.js',
    'dist/check/scan-jsx.js', 'dist/check/scan-css.js', 'dist/check/eslint.js', 'dist/check/stylelint.js',
    'agents/sloyka.md', 'agents/components.md', 'agents/native-components.md', 'native/components.json', 'native/modal.html', 'native/modal.js', 'native/theme-head.js', 'docs/GUIDE.md', 'CHANGELOG.md'])
    expect(files, f).toContain(f);
  expect(files.some(f => /^dist\/fonts\/.+\.woff2$/.test(f))).toBe(true);
  expect(files.some(f => /^templates\/.+/.test(f))).toBe(true);
});

it('npm pack excludes sources, tests and stories', () => {
  expect(files.filter(f => /^(src|tests|\.storybook)\//.test(f) || /\.stories\.(js|tsx)$/.test(f))).toEqual([]);
});

it('every export path exists after build', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  for (const [key, target] of Object.entries(pkg.exports)) {
    const t = typeof target === 'string' ? target : target.import;
    const path = t.replace('*', key === './native/*' ? 'components.json' : 'README.md').replace(/^\.\//, '');
    expect(existsSync(path), `${key} → ${path}`).toBe(true);
  }
});


it('@babel/parser belongs to the CLI only, not to the component bundle', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  expect(Object.keys(pkg.dependencies)).toEqual(['@babel/parser']);
  expect(pkg.bin['sloyka-check']).toBe('bin/sloyka-check.js');
  expect(pkg.peerDependenciesMeta).toEqual({ eslint: { optional: true }, stylelint: { optional: true } });
  const bundle = readdirSync('dist', { recursive: true })
    .map(f => String(f).split(sep).join('/'))
    .filter(f => (f.endsWith('.js') || f.endsWith('.d.ts')) && !f.startsWith('check/'));
  expect(bundle.length).toBeGreaterThan(10);
  for (const f of bundle) expect(readFileSync(`dist/${f}`, 'utf8'), f).not.toMatch(/@babel\/parser|from ['"](eslint|stylelint)/);
});

it('components are a production build: no jsxDEV / react/jsx-dev-runtime (Next prerender fails on it)', () => {
  const offenders = [];
  const walk = d => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = `${d}/${e.name}`;
      if (e.isDirectory()) { if (p !== 'dist/check') walk(p); }
      else if (p.endsWith('.js') && /jsxDEV|react\/jsx-dev-runtime/.test(readFileSync(p, 'utf8'))) offenders.push(p);
    }
  };
  walk('dist');
  expect(offenders).toEqual([]);
});
