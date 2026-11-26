import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTemplateApi } from '../../.storybook/template-api.js';

describe('template api', () => {
  let dir, api;
  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'sl-tpl-')); api = createTemplateApi(dir); });

  it('saves css + json and lists it', async () => {
    const r = await api('POST', 'template-1', { name: 'Шаблон 1', draft: { components: { button: { scale: 110, radius: -1 } } }, css: '/* x */' });
    expect(r.status).toBe(200);
    expect(readFileSync(join(dir, 'template-1.css'), 'utf8')).toBe('/* x */');
    expect(JSON.parse(readFileSync(join(dir, 'template-1.json'), 'utf8')).name).toBe('Шаблон 1');
    const l = await api('GET', '');
    expect(l.json.map(t => t.slug)).toEqual(['template-1']);
    const one = await api('GET', 'template-1');
    expect(one.json.draft.components.button.scale).toBe(110);
  });

  it('rejects unsafe names (no path traversal)', async () => {
    for (const bad of ['../x', 'a/b', 'A B', '', '..']) {
      const r = await api('POST', bad, { draft: {}, css: '' });
      expect(r.status, bad).toBe(400);
    }
    expect(existsSync(join(dir, '..', 'x.css'))).toBe(false);
  });

  it('deletes both files of a template', async () => {
    await api('POST', 'template-3', { name: 'Шаблон 3', draft: { components: {} }, css: '/* 3 */' });
    const r = await api('DELETE', 'template-3');
    expect(r.status).toBe(200);
    expect(existsSync(join(dir, 'template-3.css'))).toBe(false);
    expect(existsSync(join(dir, 'template-3.json'))).toBe(false);
    expect((await api('GET', '')).json).toEqual([]);
  });

  it('delete: unknown → 404, unsafe name → 400', async () => {
    expect((await api('DELETE', 'nope')).status).toBe(404);
    expect((await api('DELETE', '../x')).status).toBe(400);
  });

  it('rejects bodies without draft/css', async () => {
    expect((await api('POST', 'template-2', { name: 'x' })).status).toBe(400);
  });
});
