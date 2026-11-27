// Разбор JS/TS/JSX через @babel/parser и проход общим анализатором.
import { parse } from '@babel/parser';
import { createAnalyzer } from './analyze.js';

const SKIP_KEYS = new Set(['loc', 'range', 'start', 'end', 'tokens', 'comments', 'extra', 'leadingComments', 'trailingComments', 'innerComments']);

function walk(node, visitors) {
  if (!node || typeof node.type !== 'string') return;
  visitors[node.type]?.(node);
  for (const key of Object.keys(node)) {
    if (SKIP_KEYS.has(key)) continue;
    const child = node[key];
    if (Array.isArray(child)) for (const c of child) walk(c, visitors);
    else if (child && typeof child === 'object') walk(child, visitors);
  }
  visitors[`${node.type}:exit`]?.(node);
}

export function pluginsFor(file) {
  const ts = /\.[cm]?tsx?$/.test(file);
  const plain = /\.[cm]?ts$/.test(file); // в .ts нет JSX
  return [...(ts ? ['typescript'] : []), ...(plain ? [] : ['jsx'])];
}

/** Возвращает [{ rule, line, message }]. Бросает ошибку разбора, если файл не разобрать. */
export function scanJsx(source, file, manifest) {
  const ast = parse(source, { sourceType: 'unambiguous', plugins: pluginsFor(file), allowReturnOutsideFunction: true });
  const out = [];
  walk(ast.program, createAnalyzer({ filename: file, manifest, report: v => out.push(v) }));
  return out;
}
