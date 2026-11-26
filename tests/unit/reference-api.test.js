import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createReferenceApi } from '../../.storybook/reference-api.js';

const png = Buffer.from('89504e470d0a1a0a', 'hex').toString('base64');

const FACTS = { bg: 'rgb(244, 241, 234)', accent: 'rgb(15, 118, 110)', radius: 12, fontSize: 15, controlHeight: 42 };

describe('reference api', () => {
  let dir, tdir, api, calls;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'sl-ref-'));
    tdir = mkdtempSync(join(tmpdir(), 'sl-tpl-'));
    calls = [];
    api = createReferenceApi(dir, { templatesDir: tdir, analyze: async (url, opts) => { calls.push([url, opts]); return FACTS; } });
  });

  it('link → template named after the reference is created right away', async () => {
    const r = await api('POST', { name: 'Тёмная CRM', url: 'https://example.com/app' });
    expect(calls[0][0]).toBe('https://example.com/app');
    expect(calls[0][1].shot).toMatch(/temnaya-crm[\\/]shots[\\/]page-1440\.png$/);
    expect(r.json.template).toEqual({ slug: 'temnaya-crm', name: 'Тёмная CRM' });
    const t = JSON.parse(readFileSync(join(tdir, 'temnaya-crm.json'), 'utf8'));
    expect(t.name).toBe('Тёмная CRM');
    expect(t.draft.theme).toMatchObject({ accentLight: '#0f766e', bgLight: '#f4f1ea', radius: 12 });
    expect(readFileSync(join(tdir, 'temnaya-crm.css'), 'utf8')).toContain('--sl-inverse: #0f766e;');
  });

  it('image palette from the page → template without opening a browser', async () => {
    const r = await api('POST', { name: 'Макет 2', files: [{ name: 'a.png', data: png }], palette: { bg: '#111827', accent: '#6366f1' } });
    expect(calls).toEqual([]);
    expect(r.json.template.slug).toBe('maket-2');
    expect(JSON.parse(readFileSync(join(tdir, 'maket-2.json'), 'utf8')).draft.theme.bgDark).toBe('#111827');
  });

  it('analysis failure keeps the reference and explains why', async () => {
    const bad = createReferenceApi(dir, { templatesDir: tdir, analyze: async () => { throw new Error('timeout'); } });
    const r = await bad('POST', { name: 'Упал', url: 'https://example.com' });
    expect(r.status).toBe(200);
    expect(r.json.template).toBe(null);
    expect(r.json.autoError).toContain('timeout');
  });

  it('does not overwrite an existing template with the same name', async () => {
    await api('POST', { name: 'CRM', url: 'https://a.example' });
    const r = await api('POST', { name: 'CRM', url: 'https://b.example' });
    expect(r.json.template.slug).toBe('crm-2');
  });

  it('saves a link reference with status new and lists it', async () => {
    const r = await api('POST', { name: 'Тёмная CRM', url: 'https://example.com/app', note: 'нравятся карточки' });
    expect(r.status).toBe(200);
    expect(r.json.slug).toBe('temnaya-crm');
    const meta = JSON.parse(readFileSync(join(dir, 'temnaya-crm', 'reference.json'), 'utf8'));
    expect(meta).toMatchObject({ name: 'Тёмная CRM', url: 'https://example.com/app', note: 'нравятся карточки', status: 'new', files: [] });
    const l = await api('GET');
    expect(l.json.map(x => x.slug)).toEqual(['temnaya-crm']);
  });

  it('saves uploaded files with safe names', async () => {
    const r = await api('POST', { name: 'Макет', files: [{ name: '../../evil shot.png', data: png }] });
    expect(r.status).toBe(200);
    const files = readdirSync(join(dir, 'maket', 'source'));
    expect(files).toEqual(['evil-shot.png']);
    expect(existsSync(join(dir, '..', 'evil shot.png'))).toBe(false);
  });

  it('needs a link or a file', async () => {
    expect((await api('POST', { name: 'Пусто' })).status).toBe(400);
  });

  it('rejects non-http links and unknown file types', async () => {
    expect((await api('POST', { name: 'a', url: 'javascript:alert(1)' })).status).toBe(400);
    expect((await api('POST', { name: 'b', url: 'file:///C:/secret' })).status).toBe(400);
    expect((await api('POST', { name: 'c', files: [{ name: 'run.exe', data: png }] })).status).toBe(400);
  });

  it('does not overwrite an existing reference — adds a number', async () => {
    await api('POST', { name: 'CRM', url: 'https://a.example' });
    const r = await api('POST', { name: 'CRM', url: 'https://b.example' });
    expect(r.json.slug).toBe('crm-2');
  });

  it('rejects too large uploads', async () => {
    const big = Buffer.alloc(26 * 1024 * 1024).toString('base64');
    expect((await api('POST', { name: 'big', files: [{ name: 'a.png', data: big }] })).status).toBe(413);
  });
});
