import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createReferenceApi } from '../../.storybook/reference-api.js';

const png = Buffer.from('89504e470d0a1a0a', 'hex').toString('base64');

describe('reference api', () => {
  let dir, api;
  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'sl-ref-')); api = createReferenceApi(dir); });

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
