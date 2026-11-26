// Референсы: ссылка или файлы, из которых Claude собирает компоненты в стиле референса.
// Хранятся в references/<slug>/: reference.json (описание и статус) и source/ (загруженные файлы).
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, extname, basename } from 'node:path';
import { slugify } from './template-store.js';

const MAX_BYTES = 25 * 1024 * 1024;
const EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.pdf', '.html', '.htm', '.zip', '.fig', '.txt', '.md', '.css']);
export const STATUS = { new: 'Новый — ждёт разбора', working: 'Claude разбирает', review: 'Ждёт вашего одобрения', ready: 'Готов' };

const safeName = n => {
  const b = basename(String(n).replace(/\\/g, '/'));
  const ext = extname(b).toLowerCase();
  const stem = b.slice(0, b.length - ext.length).replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/^[-.]+|-+$/g, '') || 'file';
  return { name: stem + ext, ext };
};

export function createReferenceApi(dir) {
  const root = resolve(dir);
  const list = () => (existsSync(root) ? readdirSync(root, { withFileTypes: true })
    .filter(d => d.isDirectory() && existsSync(join(root, d.name, 'reference.json')))
    .map(d => JSON.parse(readFileSync(join(root, d.name, 'reference.json'), 'utf8')))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))) : []);

  return async function handle(method, body) {
    if (method === 'GET') return { status: 200, json: list() };
    if (method !== 'POST') return { status: 405, json: { error: 'Метод не поддерживается' } };

    const name = String(body?.name || '').trim().slice(0, 80);
    const url = String(body?.url || '').trim();
    const note = String(body?.note || '').trim().slice(0, 2000);
    const files = Array.isArray(body?.files) ? body.files : [];
    if (!name) return { status: 400, json: { error: 'Нужно название' } };
    if (!url && !files.length) return { status: 400, json: { error: 'Добавьте ссылку или файл' } };
    if (url && !/^https?:\/\/[^\s]+$/i.test(url)) return { status: 400, json: { error: 'Ссылка должна начинаться с http:// или https://' } };

    const decoded = [];
    let total = 0;
    for (const f of files) {
      const { name: fname, ext } = safeName(f?.name);
      if (!EXT.has(ext)) return { status: 400, json: { error: `Тип файла ${ext || '(без расширения)'} не поддерживается` } };
      const buf = Buffer.from(String(f?.data || ''), 'base64');
      total += buf.length;
      if (total > MAX_BYTES) return { status: 413, json: { error: 'Файлы больше 25 МБ — пришлите их Claude напрямую' } };
      decoded.push({ name: fname, buf });
    }

    let slug = slugify(name) || 'reference';
    for (let i = 2; existsSync(join(root, slug)); i++) slug = `${slugify(name)}-${i}`;
    const base = join(root, slug);
    mkdirSync(join(base, 'source'), { recursive: true });
    const names = [];
    for (const f of decoded) {
      let n = f.name;
      for (let i = 2; names.includes(n); i++) n = f.name.replace(/(\.[^.]+)?$/, `-${i}$1`);
      writeFileSync(join(base, 'source', n), f.buf);
      names.push(n);
    }
    const meta = { slug, name, url, note, files: names, status: 'new', createdAt: new Date().toISOString(), components: [] };
    writeFileSync(join(base, 'reference.json'), JSON.stringify(meta, null, 2) + '\n');
    return { status: 200, json: meta };
  };
}

/** Vite-плагин: /__sloyka/references (GET — список, POST — добавить). */
export function referenceApiPlugin(dir) {
  const handle = createReferenceApi(dir);
  return {
    name: 'sloyka-reference-api',
    configureServer(server) {
      server.middlewares.use('/__sloyka/references', async (req, res) => {
        let raw = '';
        for await (const chunk of req) {
          raw += chunk;
          if (raw.length > MAX_BYTES * 1.4) { res.statusCode = 413; res.end('{"error":"Слишком большой запрос"}'); return; }
        }
        let body;
        try { body = raw ? JSON.parse(raw) : undefined; } catch { body = undefined; }
        const out = await handle(req.method, body);
        res.statusCode = out.status;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(out.json));
      });
    },
  };
}
