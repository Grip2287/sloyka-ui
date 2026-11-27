// Публичный вход sloyka/check: checkProject(dir) обходит папку и применяет правила.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { RULE_IDS, loadManifest } from './rules.js';
import { scanJsx } from './scan-jsx.js';
import { scanCss } from './scan-css.js';

export { RULE_IDS };

export const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.next', 'storybook-static', 'out', 'coverage', '.turbo', '.vercel', '.nuxt', '.svelte-kit', '.git']);
const JS_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts']);
// Форматы, которые мы не умеем разбирать: пропускаем с предупреждением, чтобы их не приняли за проверенные.
const UNSUPPORTED_EXT = new Set(['.mdx', '.vue', '.svelte', '.astro', '.html', '.scss', '.sass', '.less', '.styl']);
export const ALLOW_FILE_NAME = 'sloyka.allow.json';

export class AllowFileError extends Error {}

const posix = p => p.split(sep).join('/');
const extOf = name => (name.lastIndexOf('.') > 0 ? name.slice(name.lastIndexOf('.')).toLowerCase() : '');

/** Простой glob: ** (любая глубина), * (внутри папки), ? (один символ). */
export function globToRegExp(glob, ignoreCase = process.platform === 'win32') {
  let re = '';
  const g = glob.split('\\').join('/').replace(/^\.\//, '');
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*' && g[i + 1] === '*') {
      if (g[i + 2] === '/') { re += '(?:.*/)?'; i += 2; } else { re += '.*'; i += 1; }
    } else if (c === '*') re += '[^/]*';
    else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`, ignoreCase ? 'i' : '');
}

export function loadAllow(file) {
  let data;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    throw new AllowFileError(`${ALLOW_FILE_NAME}: не удалось прочитать ${file}: ${e.message}`);
  }
  const list = data && data.ignore === undefined ? [] : data && data.ignore;
  if (!Array.isArray(list)) throw new AllowFileError(`${ALLOW_FILE_NAME}: поле "ignore" должно быть массивом`);
  return list.map((entry, i) => {
    const where = `${ALLOW_FILE_NAME}: ignore[${i}]`;
    if (!entry || typeof entry.path !== 'string' || !entry.path) throw new AllowFileError(`${where}: нужен "path" (glob)`);
    if (typeof entry.reason !== 'string' || !entry.reason.trim()) throw new AllowFileError(`${where}: нужна непустая "reason" (причина исключения)`);
    if (entry.rules !== undefined) {
      if (!Array.isArray(entry.rules)) throw new AllowFileError(`${where}: "rules" должен быть массивом`);
      for (const r of entry.rules) if (!RULE_IDS.includes(r)) throw new AllowFileError(`${where}: неизвестное правило "${r}" (есть: ${RULE_IDS.join(', ')})`);
    }
    return { re: globToRegExp(entry.path), rules: entry.rules, reason: entry.reason.trim() };
  });
}

function* files(dir, root = dir) {
  for (const d of readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (d.isDirectory()) {
      if (!SKIP_DIRS.has(d.name)) yield* files(join(dir, d.name), root);
    } else if (d.isFile()) yield posix(relative(root, join(dir, d.name)));
  }
}

/** Ищет sloyka.allow.json от проверяемой папки вверх до ближайшего package.json (включительно). */
export function findAllowFile(root) {
  for (let cur = root; ; ) {
    const candidate = join(cur, ALLOW_FILE_NAME);
    if (existsSync(candidate)) return candidate;
    const parent = dirname(cur);
    if (existsSync(join(cur, 'package.json')) || parent === cur) return null;
    cur = parent;
  }
}

/**
 * Проверяет папку. allowFile: путь к sloyka.allow.json, false (не читать) или не задан
 * (искать вверх до package.json). Пути нарушений относительны проверяемой папке,
 * glob-ы исключений относительны папке файла исключений.
 * Возвращает { violations, allowed, warnings, errors, files, allowFile }.
 * errors: файлы, которые не удалось разобрать; при их наличии проверка не считается пройденной.
 */
export function checkProject(dir, { allowFile } = {}) {
  const root = resolve(dir);
  if (!existsSync(root) || !statSync(root).isDirectory()) throw new Error(`Папка не найдена: ${dir}`);
  const manifest = loadManifest();
  const found = [];
  const warnings = [];
  const errors = [];
  let scanned = 0;
  for (const file of files(root)) {
    const ext = extOf(file);
    const abs = join(root, file);
    let hits;
    if (JS_EXT.has(ext)) {
      let res;
      try {
        res = scanJsx(readFileSync(abs, 'utf8'), file, manifest, abs);
      } catch (e) {
        errors.push(`${file}: ${e.message}`);
        continue;
      }
      hits = res.hits;
      errors.push(...res.errors);
    } else if (ext === '.css') hits = scanCss(readFileSync(abs, 'utf8'));
    else {
      if (UNSUPPORTED_EXT.has(ext)) warnings.push(`Пропущен ${file}: формат ${ext} пока не проверяется`);
      continue;
    }
    scanned++;
    for (const h of hits) found.push({ file, line: h.line, rule: h.rule, message: h.message });
  }
  found.sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : a.line - b.line || (a.rule < b.rule ? -1 : 1)));

  const allowPath = allowFile === false ? null : allowFile ? resolve(allowFile) : findAllowFile(root);
  const allow = allowPath ? loadAllow(allowPath) : [];
  const allowDir = allowPath ? dirname(allowPath) : root;
  const violations = [];
  const allowed = [];
  for (const v of found) {
    const rel = posix(relative(allowDir, join(root, v.file)));
    const rule = allow.find(a => a.re.test(rel) && (!a.rules || a.rules.includes(v.rule)));
    if (rule) allowed.push({ ...v, reason: rule.reason });
    else violations.push(v);
  }
  return { violations, allowed, warnings, errors, files: scanned, allowFile: allowPath };
}
