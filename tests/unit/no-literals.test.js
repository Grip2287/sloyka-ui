import { it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

it('components use only tokens for colour', () => {
  const offenders = [];
  for (const d of readdirSync('src/components')) {
    for (const f of readdirSync(join('src/components', d)).filter(f => f.endsWith('.css'))) {
      const css = readFileSync(join('src/components', d, f), 'utf8').replace(/url\([^)]*\)/g, '');
      const hits = css.match(/#[0-9a-f]{3,8}\b|rgba?\(|oklch\(|hsla?\(/gi);
      if (hits) offenders.push(`${d}/${f}: ${hits.join(', ')}`);
    }
  }
  expect(offenders).toEqual([]);
});
