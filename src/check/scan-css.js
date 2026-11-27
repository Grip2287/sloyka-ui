// Проверка CSS без внешних зависимостей: достаточно найти @import и селекторы.
import { deepImportMessage, slSelectorMessage } from './rules.js';

const SL_SELECTOR = /(?<![\w-])\.sl-[A-Za-z][\w-]*|\[\s*class\s*[~|^$*]?=\s*["']?\s*sl-[^\]]*\]/g;

/** Заменяет комментарии пробелами, оставляя переводы строк и строки в кавычках. */
export function maskCss(source) {
  let out = '';
  let quote = null;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      out += c;
      if (c === '\\') out += source[++i] ?? '';
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'") {
      quote = c;
      out += c;
    } else if (c === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2);
      const stop = end < 0 ? source.length : end + 2;
      out += source.slice(i, stop).replace(/[^\n]/g, ' ');
      i = stop - 1;
    } else out += c;
  }
  return out;
}

/** Все попадания в `.sl-*` внутри текста селектора или строки: [{ index, token }]. */
export function selectorHits(text) {
  const hits = [];
  SL_SELECTOR.lastIndex = 0;
  for (let m; (m = SL_SELECTOR.exec(text)); ) hits.push({ index: m.index, token: m[0] });
  return hits;
}

/** Адрес из параметров @import: 'x', "x", url(x), url('x'). */
export function importSpec(params) {
  const m = /^\s*(?:url\(\s*)?(["']?)([^"')\s]+)\1/i.exec(params);
  return m ? m[2] : null;
}

export const importMessage = params => {
  const spec = importSpec(params);
  return spec ? deepImportMessage(spec) : null;
};

export function scanCss(source) {
  const text = maskCss(source);
  const out = [];
  const lineAt = index => {
    let n = 1;
    for (let i = text.indexOf('\n'); i >= 0 && i < index; i = text.indexOf('\n', i + 1)) n++;
    return n;
  };
  const handle = (stmt, start, end) => {
    if (stmt.startsWith('@')) {
      if (/^@import\b/i.test(stmt)) {
        const message = importMessage(stmt.slice(7));
        if (message) out.push({ rule: 'no-deep-imports', line: lineAt(start), message });
      }
      return;
    }
    if (end !== '{') return;
    for (const hit of selectorHits(stmt)) out.push({ rule: 'no-sl-css-overrides', line: lineAt(start + hit.index), message: slSelectorMessage(hit.token) });
  };

  let start = -1;
  let paren = 0;
  let quote = null;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (paren === 0 && (c === '{' || c === ';' || c === '}')) {
      if (start >= 0) handle(text.slice(start, i).trimEnd(), start, c);
      start = -1;
      continue;
    }
    if (start < 0 && !/\s/.test(c)) start = i;
    if (c === '"' || c === "'") quote = c;
    else if (c === '(') paren++;
    else if (c === ')') paren = Math.max(0, paren - 1);
  }
  if (start >= 0) handle(text.slice(start).trimEnd(), start, ';');
  return out;
}
