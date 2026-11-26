// Мини-API для `npm run storybook`: сохранить шаблон файлами в templates/ и прочитать сохранённые.
// В собранном Storybook (storybook-static) API нет — там шаблон можно только скачать или скопировать.
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SLUG = /^[a-z0-9][a-z0-9-]{0,39}$/;

export function createTemplateApi(dir) {
  const root = resolve(dir);
  const list = () => (existsSync(root) ? readdirSync(root).filter(f => f.endsWith('.json')).map(f => {
    const j = JSON.parse(readFileSync(join(root, f), 'utf8'));
    return { slug: j.slug, name: j.name, savedAt: j.savedAt };
  }) : []);

  return async function handle(method, slug, body) {
    if (method === 'GET' && !slug) return { status: 200, json: list() };
    if (!SLUG.test(slug || '')) return { status: 400, json: { error: 'Имя файла: латиница, цифры, дефис' } };
    const file = join(root, slug);
    if (method === 'GET') {
      if (!existsSync(file + '.json')) return { status: 404, json: { error: 'Нет такого шаблона' } };
      return { status: 200, json: JSON.parse(readFileSync(file + '.json', 'utf8')) };
    }
    if (method === 'POST') {
      const { name, draft, css } = body || {};
      if (typeof css !== 'string' || !draft || typeof draft !== 'object') return { status: 400, json: { error: 'Нужны draft и css' } };
      mkdirSync(root, { recursive: true });
      const meta = { slug, name: String(name || slug).slice(0, 80), savedAt: new Date().toISOString(), draft };
      writeFileSync(file + '.json', JSON.stringify(meta, null, 2) + '\n');
      writeFileSync(file + '.css', css);
      return { status: 200, json: { ok: true, slug, files: [`templates/${slug}.css`, `templates/${slug}.json`] } };
    }
    return { status: 405, json: { error: 'Метод не поддерживается' } };
  };
}

/** Vite-плагин: /__sloyka/templates[/<slug>] */
export function templateApiPlugin(dir) {
  const handle = createTemplateApi(dir);
  return {
    name: 'sloyka-template-api',
    configureServer(server) {
      server.middlewares.use('/__sloyka/templates', async (req, res) => {
        let raw = '';
        for await (const chunk of req) raw += chunk;
        let body;
        try { body = raw ? JSON.parse(raw) : undefined; } catch { body = undefined; }
        const slug = decodeURIComponent((req.url || '').replace(/^\/+|\?.*$/g, '')) || '';
        const out = await handle(req.method, slug, body);
        res.statusCode = out.status;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(out.json));
      });
    },
  };
}
