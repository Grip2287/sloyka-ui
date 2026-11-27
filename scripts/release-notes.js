// Заметки к выпуску «Что нового и где лежит»: сравнивает два манифеста components.json.
// Использование:
//   node scripts/release-notes.js --prev old.json --next components.json            → markdown в stdout
//   node scripts/release-notes.js --changelog [--prev old.json]                    → вставить в CHANGELOG.md под текущую версию
// В выпуске запускается после `changeset version` (npm run version:release).
// --prev можно не указывать (первый выпуск).
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const MARK_START = '<!-- release-notes:start -->';
const MARK_END = '<!-- release-notes:end -->';

/** Как Storybook строит id истории из заголовка и имени экспорта. */
export function sanitize(s) {
  return s.toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-')
    .replace(/-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

export function storyId(c) {
  if (!c || c.n === '00') return null;
  return `${sanitize(`Компоненты/${c.n} · ${c.group}`)}--default`;
}

/** Папка компонента в репозитории: ищем метку `name: 'X'` в src/react/components. */
export function findSources(root = 'src/react/components') {
  const map = {};
  if (!existsSync(root)) return map;
  for (const dir of readdirSync(root)) {
    const full = join(root, dir);
    let files = [];
    try { files = readdirSync(full).filter(f => /\.tsx?$/.test(f)); } catch { continue; }
    for (const f of files) {
      const text = readFileSync(join(full, f), 'utf8');
      for (const m of text.matchAll(/name:\s*'([A-Z][\w.]*)'/g)) map[m[1]] ??= `src/react/components/${dir}/${f}`;
    }
  }
  return map;
}

const base = name => name.split('.')[0];

function where(name, c, sources) {
  const parts = [`\`import { ${base(name)} } from 'sloyka'\``];
  if (sources[name]) parts.push(`\`${sources[name]}\``);
  const id = storyId(c);
  if (id) parts.push(`Storybook: \`${id}\``);
  return parts.join(' · ');
}

const list = a => (a === 'any' ? 'любые' : a === 'none' ? 'ничего' : a.join(', '));

/** Сравнение манифестов → { added, changed, removed, fix } (массивы строк markdown). */
export function diffManifests(prev, next, sources = {}) {
  const out = { added: [], changed: [], removed: [], fix: [] };
  const P = prev?.components ?? {};
  const N = next.components;

  for (const [name, c] of Object.entries(N)) {
    const old = P[name];
    if (!old) { out.added.push(`**${name}** (${c.n} · ${c.group}) — ${where(name, c, sources)}`); continue; }
    const head = `**${name}** (${c.n})`;
    for (const [p, s] of Object.entries(c.props)) {
      const o = old.props[p];
      if (!o) { out.changed.push(`${head}: новый проп \`${p}\`${s.options ? ` (${s.options.join(' · ')})` : ''}`); continue; }
      const newOpts = (s.options ?? []).filter(v => !(o.options ?? []).includes(v));
      const goneOpts = (o.options ?? []).filter(v => !(s.options ?? []).includes(v));
      if (newOpts.length) out.changed.push(`${head}: \`${p}\` — новые значения ${newOpts.map(v => `\`${v}\``).join(', ')}`);
      if (goneOpts.length) {
        out.removed.push(`${head}: \`${p}\` — убраны значения ${goneOpts.map(v => `\`${v}\``).join(', ')}`);
        out.fix.push(`${head}: замените \`${p}=${goneOpts.map(v => `"${v}"`).join('/')}\` на одно из: ${(s.options ?? []).join(' · ')} — ${where(name, c, sources)}`);
      }
      if (JSON.stringify(o.default) !== JSON.stringify(s.default)) out.changed.push(`${head}: \`${p}\` по умолчанию теперь \`${s.default ?? '—'}\` (было \`${o.default ?? '—'}\`)`);
      if (s.type !== o.type) out.changed.push(`${head}: \`${p}\` — тип \`${o.type}\` → \`${s.type}\``);
      if (s.required && !o.required) out.fix.push(`${head}: проп \`${p}\` стал обязательным — ${where(name, c, sources)}`);
    }
    for (const p of Object.keys(old.props)) {
      if (c.props[p]) continue;
      out.removed.push(`${head}: проп \`${p}\``);
      out.fix.push(`${head}: уберите проп \`${p}\` — ${where(name, c, sources)}`);
    }
    if (JSON.stringify(old.allowed) !== JSON.stringify(c.allowed)) {
      const was = Array.isArray(old.allowed) ? old.allowed : [];
      const now = Array.isArray(c.allowed) ? c.allowed : [];
      const gone = c.allowed === 'any' ? [] : old.allowed === 'any' ? ['(было: любые)'] : was.filter(x => !now.includes(x));
      out.changed.push(`${head}: внутрь можно — ${list(c.allowed)} (было — ${list(old.allowed)})`);
      if (gone.length) out.fix.push(`${head}: внутри больше нельзя ${gone.join(', ')} — ${where(name, c, sources)}`);
    }
  }
  for (const [name, c] of Object.entries(P)) {
    if (N[name]) continue;
    out.removed.push(`**${name}** (${c.n} · ${c.group})`);
    out.fix.push(`**${name}** удалён — уберите \`${name}\` из сайта и \`import { ${base(name)} }\`, если он больше не нужен.`);
  }
  const pt = prev?.templates ?? [];
  for (const t of next.templates ?? []) if (!pt.includes(t)) out.added.push(`Шаблон \`sloyka/templates/${t}\``);
  for (const t of pt) if (!(next.templates ?? []).includes(t)) {
    out.removed.push(`Шаблон \`${t}\``);
    out.fix.push(`Шаблон \`${t}\` удалён — уберите \`import 'sloyka/templates/${t}'\`.`);
  }
  return out;
}

export function renderNotes(prev, next, sources = {}) {
  const d = diffManifests(prev, next, sources);
  const lines = [MARK_START, '', '### Что нового и где лежит', ''];
  if (!prev) {
    lines.push(`Первый выпуск React-версии: ${Object.keys(next.components).length} компонентов в группах 00–24. Справочник: \`docs/GUIDE.md\`, полный список props: \`sloyka/components.json\`.`, '');
    for (const g of next.groups) lines.push(`- **${g.n} · ${g.title}:** ${g.components.join(', ')}`);
    lines.push('', MARK_END);
    return lines.join('\n');
  }
  const sect = (title, items, empty) => { lines.push(`#### ${title}`, '', ...(items.length ? items.map(i => `- ${i}`) : [empty]), ''); };
  sect('Добавлено', d.added, 'Ничего.');
  sect('Изменено', d.changed, 'Ничего.');
  sect('Удалено', d.removed, 'Ничего.');
  sect('Нужно поправить в сайтах', d.fix, 'Ничего: обновление без правок. После обновления запустите `npx sloyka-check src`.');
  lines.push(MARK_END);
  return lines.join('\n');
}

/** Вставляет блок заметок под заголовок «## <version>» в CHANGELOG (повторный запуск заменяет блок). */
export function insertIntoChangelog(notes, version, file = 'CHANGELOG.md') {
  const text = readFileSync(file, 'utf8');
  const head = `## ${version}`;
  const at = text.indexOf(head);
  if (at < 0) throw new Error(`release-notes: в ${file} нет заголовка «${head}»`);
  const bodyStart = at + head.length;
  const nextHead = text.indexOf('\n## ', bodyStart);
  let section = text.slice(bodyStart, nextHead < 0 ? text.length : nextHead);
  const s = section.indexOf(MARK_START), e = section.indexOf(MARK_END);
  if (s >= 0 && e > s) section = section.slice(0, s) + notes + section.slice(e + MARK_END.length);
  else section = `${section.trimEnd()}\n\n${notes}\n`;
  writeFileSync(file, text.slice(0, bodyStart) + section + (nextHead < 0 ? '' : text.slice(nextHead)));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
  const prevPath = arg('--prev');
  const prev = prevPath && existsSync(prevPath) ? JSON.parse(readFileSync(prevPath, 'utf8')) : null;
  const next = JSON.parse(readFileSync(arg('--next') ?? 'components.json', 'utf8'));
  const notes = renderNotes(prev, next, findSources());
  if (process.argv.includes('--changelog')) {
    const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
    insertIntoChangelog(notes, version);
    console.log(`release-notes: CHANGELOG.md ${version}${prev ? '' : ' (первый выпуск)'}`);
  } else console.log(notes);
}
