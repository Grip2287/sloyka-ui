// Нативные компоненты (HTML + CSS): разметка получается из React-компонентов через renderToStaticMarkup,
// поэтому она всегда совпадает с React. Запускается из `npm run build` после gen-manifest.
//   native/<компонент>.html      — готовые фрагменты по вариантам
//   native/<скрипт>.js           — скрипты компонентов с поведением (из src/native/scripts/)
//   native/components.json       — то же для программ
//   agents/native-components.md  — справочник для ИИ-агентов
import { build } from 'esbuild';
import { mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve, join } from 'node:path';

export const slug = (name) => name.replace(/\./g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

/** id из useId (`«r0»`, `_R_…_`, `:r0:`) → читаемые `sl-id-1`, одинаковые на каждой сборке. */
export function normalizeIds(html) {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).filter((v) => /[«»:]|^_R_/.test(v));
  let out = html;
  [...new Set(ids)].forEach((raw, i) => { out = out.split(raw).join(`sl-id-${i + 1}`); });
  return out;
}

const INLINE = new Set(['span', 'strong', 'b', 'i', 'em', 'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'code', 'small', 'input', 'img', 'br']);

const isInlineLine = (l) => { const t = l.trim().match(/^<\/?([a-zA-Z0-9-]+)/)?.[1]; return !t || INLINE.has(t.toLowerCase()); };

/** Простое оформление: блочные теги с новой строки и отступом, строчные — внутри строки. */
export function formatHtml(html) {
  const tokens = html.match(/<[^>]+>|[^<]+/g) ?? [];
  const lines = [];
  let depth = 0;
  let line = '';
  let inlineDepth = 0;
  const flush = () => { if (line.trim()) lines.push('  '.repeat(depth) + line.trim()); line = ''; };
  for (const t of tokens) {
    const m = t.match(/^<\/?([a-zA-Z0-9-]+)/);
    const tag = m?.[1].toLowerCase();
    const closing = t.startsWith('</');
    const selfClose = t.endsWith('/>') || ['input', 'img', 'br', 'hr', 'meta', 'link'].includes(tag ?? '');
    if (!tag || INLINE.has(tag) || inlineDepth > 0) {
      line += t;
      if (tag === 'svg' && !closing && !selfClose) inlineDepth++;
      if (tag === 'svg' && closing) inlineDepth--;
      continue;
    }
    if (closing) { flush(); depth = Math.max(0, depth - 1); lines.push('  '.repeat(depth) + t); continue; }
    flush();
    lines.push('  '.repeat(depth) + t);
    if (!selfClose) depth++;
  }
  flush();
  // «<tag>текст</tag>» без вложенных блоков — в одну строку
  const joined = [];
  for (let i = 0; i < lines.length; i++) {
    const a = lines[i], b = lines[i + 1], c = lines[i + 2];
    const tag = a.trim().match(/^<([a-zA-Z0-9-]+)/)?.[1];
    if (tag && c !== undefined && !a.trim().endsWith('/>') && c.trim() === `</${tag}>` && isInlineLine(b)) {
      joined.push(a + b.trim() + c.trim()); i += 2; continue;
    }
    if (tag && b !== undefined && b.trim() === `</${tag}>`) { joined.push(a + b.trim()); i += 1; continue; }
    joined.push(a);
  }
  return joined.join('\n');
}

export async function generate({ root = process.cwd(), write = true } = {}) {
  const out = resolve(root, 'node_modules/.cache', `sloyka-native-${process.pid}-${Date.now()}.mjs`);
  await build({
    entryPoints: [resolve(root, 'src/native/samples.tsx')], bundle: true, platform: 'node', format: 'esm',
    jsx: 'automatic', outfile: out, external: ['react', 'react-dom'], logLevel: 'silent',
    define: { 'process.env.NODE_ENV': '"production"' },
    nodePaths: [resolve(root, 'node_modules')],
  });
  const { createRequire } = await import('node:module');
  const req = createRequire(resolve(root, 'package.json'));
  const { renderToStaticMarkup } = req('react-dom/server');
  const { SAMPLES, SCRIPTS, Icon, themeScriptSource } = await import(pathToFileURL(out).href);
  const { createElement } = req('react');
  rmSync(out, { force: true });

  const manifest = JSON.parse(readFileSync(resolve(root, 'components.json'), 'utf8'));
  const result = [];
  for (const [name, meta] of Object.entries(manifest.components)) {
    const samples = SAMPLES[name];
    if (!samples?.length) throw new Error(`Sloyka native: у компонента ${name} нет нативного примера в src/native/samples.tsx`);
    // id нумеруются сквозь все варианты компонента: фрагменты можно ставить на одну страницу.
    const SEP = '<!--sl-sample-->';
    const raw = normalizeIds(samples.map((s) => (s.post ? s.post(renderToStaticMarkup(s.node)) : renderToStaticMarkup(s.node))).join(SEP)).split(SEP);
    const items = samples.map((s, i) => ({ title: s.title, html: formatHtml(raw[i]) }));
    const script = SCRIPTS[name];
    result.push({ name, n: meta.n, group: meta.group, file: `${slug(name)}.html`, script: script?.file, scriptAbout: script?.about, samples: items });
  }

  if (write) {
    const dir = resolve(root, 'native');
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    for (const c of result) {
      const head = `<!-- Sloyka · ${c.n} · ${c.name}. Сгенерировано из React-компонента, не править руками. -->\n` +
        `<!-- Стили: <link rel="stylesheet" href="…/sloyka/dist/styles.css">${c.script ? `. Поведение: <script src="…/sloyka/native/${c.script}"></script>` : ''} -->\n`;
      writeFileSync(join(dir, c.file), head + c.samples.map((s) => `\n<!-- ${s.title} -->\n${s.html}\n`).join(''));
    }
    const scriptsDir = resolve(root, 'src/native/scripts');
    // Иконки в скриптах — та же разметка, что у <Icon>: метки __SL_ICON_<имя>__ заменяются при сборке.
    const icon = (name) => renderToStaticMarkup(createElement(Icon, { name }));
    for (const f of readdirSync(scriptsDir).filter((f) => f.endsWith('.js'))) {
      const src = readFileSync(join(scriptsDir, f), 'utf8').replace(/__SL_ICON_([a-z-]+)__/g, (_, n) => icon(n).replace(/'/g, "\'"));
      writeFileSync(join(dir, f), src);
    }
    writeFileSync(join(dir, 'theme-head.js'), `/* Sloyka · 00 · ThemeScript — ставится в <head> до стилей: тема применяется до первой отрисовки, без мигания. */
${themeScriptSource()};
`);
    writeFileSync(join(dir, 'components.json'), JSON.stringify({ name: 'sloyka', version: manifest.version, components: result }, null, 2) + '\n');
    mkdirSync(resolve(root, 'agents'), { recursive: true });
    writeFileSync(resolve(root, 'agents/native-components.md'), renderMd(result, manifest.version));
  }
  return result;
}

function renderMd(list, version) {
  const out = [
    '# Нативные компоненты Sloyka (HTML + CSS) — справочник',
    '',
    `Сгенерировано из React-компонентов (sloyka ${version}). Не править руками. Разметка совпадает с React один в один.`,
    '',
    'Подключение на странице:',
    '',
    '```html',
    '<link rel="stylesheet" href="node_modules/sloyka/dist/styles.css">',
    '<script src="node_modules/sloyka/native/theme-head.js"></script>   <!-- в <head>, тема без мигания -->',
    '<!-- в конце <body> — только скрипты тех компонентов, что есть на странице: -->',
    '<script src="node_modules/sloyka/native/modal.js"></script>',
    '```',
    '',
    'Правила: копируй разметку как есть; меняй только тексты, ссылки, `name`, `value`, `id` и количество повторяющихся элементов (строки, пункты, карточки). Свои классы, `style`, `<style>` для `.sl-*` и свои теги вне этих фрагментов запрещены. Свой JS — только обработчики событий (`addEventListener`, отправка данных), не меняющие вид.',
    '',
  ];
  let group = '';
  for (const c of list) {
    if (c.group !== group) { group = c.group; out.push(`## ${c.n} · ${group}`, ''); }
    out.push(`### ${c.name}`, '', `Файл: \`native/${c.file}\`.${c.script ? ` Скрипт: \`native/${c.script}\` — ${c.scriptAbout}` : ' Скрипт не нужен.'}`, '');
    for (const s of c.samples) out.push(`**${s.title}**`, '', '```html', s.html, '```', '');
  }
  return out.join('\n');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const list = await generate();
  console.log(`native: ${list.length} компонентов → native/, agents/native-components.md`);
}
