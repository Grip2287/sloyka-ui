import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

describe('build', () => {

  it('build emits bundle files', () => {
    for (const f of ['dist/sloyka.css', 'dist/sloyka.min.css', 'dist/core.css', 'dist/sloyka.js', 'dist/theme-init.js', 'dist/icons.js'])
      expect(existsSync(f), f).toBe(true);
    expect(readdirSync('dist/fonts').filter(f => f.endsWith('.woff2')).length).toBe(6);
  });

  it('bundle starts with layer order', () => {
    const css = readFileSync('dist/sloyka.css', 'utf8').trimStart();
    expect(css.startsWith('@layer sl.reset, sl.tokens, sl.base, sl.components;')).toBe(true);
  });

  it('has no runtime dependencies', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(Object.keys(pkg.dependencies || {})).toEqual([]);
  });
});
