import { describe, it, expect } from 'vitest';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { themeFromFacts, toHex } from '../../.storybook/reference-analyze.js';

describe('themeFromFacts', () => {
  it('light site → light bg and accent from the site, dark side stays default', () => {
    const t = themeFromFacts({ bg: 'rgb(244, 241, 234)', accent: 'rgb(15, 118, 110)', radius: 12, fontSize: 15, controlHeight: 42 });
    expect(t).toMatchObject({ bgLight: '#f4f1ea', accentLight: '#0f766e', bgDark: '#0c0e11', radius: 12, fontSize: 15, controlHeight: 42 });
    expect(t.accentDark).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('dark site → its colours go to the dark theme', () => {
    const t = themeFromFacts({ bg: 'rgb(17, 24, 39)', accent: 'rgb(99, 102, 241)', radius: 6, fontSize: 14, controlHeight: 36 });
    expect(t.bgDark).toBe('#111827');
    expect(t.accentDark).toBe('#6366f1');
    expect(t.bgLight).toBe('#e9ebee');
  });

  it('clamps odd values into the editor ranges', () => {
    const t = themeFromFacts({ bg: 'transparent', accent: null, radius: 999, fontSize: 30, controlHeight: 10 });
    expect(t.radius).toBe(16);
    expect(t.fontSize).toBe(16);
    expect(t.controlHeight).toBe(28);
    expect(t.bgLight).toBe('#e9ebee');
  });

  it('toHex', () => {
    expect(toHex('rgb(15, 118, 110)')).toBe('#0f766e');
    expect(toHex('rgba(0, 0, 0, 0)')).toBe(null);
    expect(toHex('#ABC')).toBe('#aabbcc');
  });
});

describe('analyzeUrl (real headless browser)', () => {
  it('reads colours, radius and sizes from a page', async () => {
    const { analyzeUrl } = await import('../../.storybook/reference-analyze.js');
    const facts = await analyzeUrl(pathToFileURL(resolve('tests/fixtures/ref-site.html')).href);
    expect(facts).toMatchObject({ bg: 'rgb(244, 241, 234)', accent: 'rgb(15, 118, 110)', radius: 12, fontSize: 15, controlHeight: 42 });
  }, 60000);
});
