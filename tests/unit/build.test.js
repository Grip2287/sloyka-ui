import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

describe('build', () => {

  it('build emits library files', () => {
    for (const f of ['dist/index.js', 'dist/index.d.ts', 'dist/styles.css'])
      expect(existsSync(f), f).toBe(true);
    expect(readdirSync('dist/fonts').filter(f => f.endsWith('.woff2')).length).toBe(6);
  });

  it('does not emit 0.1.x css outputs', () => {
    for (const f of ['dist/sloyka.css', 'dist/sloyka.min.css', 'dist/core.css'])
      expect(existsSync(f), f).toBe(false);
    // dist/components теперь содержит React-модули; css там быть не должно
    const css = existsSync('dist/components')
      ? readdirSync('dist/components', { recursive: true }).filter(f => String(f).endsWith('.css'))
      : [];
    expect(css).toEqual([]);
  });

  it('bundle starts with layer order', () => {
    const css = readFileSync('dist/styles.css', 'utf8').trimStart();
    expect(css.startsWith('@layer sl.reset, sl.tokens, sl.base, sl.components;')).toBe(true);
  });

  it('has only the CLI parser as dependency and react as peer', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(Object.keys(pkg.dependencies || {})).toEqual(['@babel/parser']);
    expect(pkg.peerDependencies.react).toBe('>=18.3');
    expect(pkg.peerDependencies['react-dom']).toBe('>=18.3');
  });
});
