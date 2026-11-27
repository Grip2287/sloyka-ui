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
  return [...(ts ? ['typescript'] : []), ...(plain ? [] : ['jsx']), 'decorators-legacy'];
}

/**
 * Возвращает { hits: [{ rule, line, message }], errors: [string] }.
 * Ошибки разбора (в том числе исправленные парсером) не скрываются: проверка по ним считается проваленной.
 * absPath нужен для определения layout-файлов (Next app/layout и т.п.).
 */
export function scanJsx(source, file, manifest, absPath = file) {
  const hits = [];
  let ast;
  try {
    ast = parse(source, { sourceType: 'unambiguous', plugins: pluginsFor(file), allowReturnOutsideFunction: true, errorRecovery: true });
  } catch (e) {
    return { hits, errors: [`${file}: ${e.message}`] };
  }
  walk(ast.program, createAnalyzer({ filename: absPath, manifest, report: v => hits.push(v) }));
  return { hits, errors: (ast.errors || []).map(e => `${file}: ${e.message}`) };
}
