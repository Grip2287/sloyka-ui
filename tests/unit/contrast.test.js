import { describe, it, expect } from 'vitest';
import { readTheme, contrast } from './tokens.js';

// подписи капсом 11px — обычный текст для WCAG, поэтому статусы тоже 4.5:1
const AA = [['ok', 'surface'], ['ok', 'bg'], ['ok', 'surface-2'], ['ok', 'ok-bg'], ['warn', 'surface'], ['warn', 'bg'], ['warn', 'warn-bg'], ['crit', 'surface'], ['crit', 'bg'], ['crit', 'crit-bg'], ['off', 'surface'], ['off', 'surface-2'], ['text-3', 'rail'], ['text-3', 'surface-hover'],
['text', 'bg'], ['text', 'surface'], ['text-2', 'surface'], ['text-3', 'surface'], ['text-3', 'bg'], ['text-3', 'surface-2'], ['on-inverse', 'inverse'], ['text-2', 'rail']];
const LARGE = [['ok', 'surface'], ['warn', 'surface'], ['crit', 'surface'], ['ok', 'ok-bg'], ['warn', 'warn-bg'], ['crit', 'crit-bg'], ['border-strong', 'surface']];

describe.each(['light', 'dark'])('%s theme', theme => {
  const t = readTheme(theme);
  it('defines all colour tokens', () => {
    for (const k of ['bg', 'surface', 'surface-2', 'text', 'text-2', 'text-3', 'inverse', 'on-inverse', 'ok', 'warn', 'crit', 'rail']) expect(t[k], k).toMatch(/^#[0-9a-f]{6}$/i);
  });
  it.each(AA)('%s on %s ≥ 4.5', (fg, bg) => expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5));
  it.each(LARGE)('%s on %s ≥ 3', (fg, bg) => expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(3));
});
