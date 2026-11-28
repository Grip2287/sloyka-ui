// Общая логика проверки JS/TS/JSX. Работает с узлами и Babel, и ESTree (ESLint),
// поэтому ESLint-плагин и CLI дают одинаковый результат.
import {
  RULE_IDS, PACKAGE_NAMES, nativeElementMessage, classNameMessage, propValueMessage, deepImportMessage,
  slSelectorMessage, slClassMessage, headRestrictedMessage, spreadMessage, styledWrapMessage, nativeJsMarkupMessage,
} from './rules.js';
import { selectorHits } from './scan-css.js';

const FORBIDDEN_ATTRS = new Set(['className', 'style', 'dangerouslySetInnerHTML']);
const SKIP_KEYS = new Set(['parent', 'loc', 'range', 'start', 'end', 'tokens', 'comments', 'extra', 'leadingComments', 'trailingComments', 'innerComments']);
const SL_CLASS = /(?<![\w-])sl-[A-Za-z][\w-]*/;
const LAYOUT_TAGS = new Set(['html', 'head', 'body']);
const CREATE_ELEMENT_NAMES = new Set(['createElement', 'jsx', 'jsxs', '_jsx', '_jsxs', 'jsxDEV', '_jsxDEV']);
const STYLED_SOURCES = new Set(['styled-components', '@emotion/styled', 'goober']);
const LOWER_TAG = /^[a-z]/;
const MARKUP_SL = /class\s*=\s*\\?["'][^"'<>]*(?<![\w-])sl-[A-Za-z]/;
const CLASS_LIST_WRITES = new Set(['add', 'toggle', 'replace']);
/** Поиск элементов по селектору — чтение, а не переопределение: '.sl-*' в аргументе допустим. */
const QUERY_METHODS = new Set(['querySelector', 'querySelectorAll', 'closest', 'matches']);

/**
 * Файлы, где допустимы html/head/body: Next app/**\/layout и global-error, Remix app/root, pages/_document.
 * Определяется по абсолютному пути (ближайшая папка app), а не по корню проверки.
 */
export function isLayoutFile(filename) {
  const parts = filename.split('\\').join('/').split('/').map(p => p.toLowerCase());
  const base = parts.pop() || '';
  const parent = parts[parts.length - 1];
  if (parent === 'pages' && /^_document\.[cm]?[jt]sx?$/.test(base)) return true;
  if (!parts.includes('app')) return false;
  if (/^(layout|global-error)\.[cm]?[jt]sx?$/.test(base)) return true;
  return parent === 'app' && /^root\.[cm]?[jt]sx?$/.test(base);
}

/** Строковое значение узла-литерала (Babel или ESTree), иначе undefined. Числа превращаются в строку. */
function staticValue(node) {
  if (!node) return undefined;
  switch (node.type) {
    case 'StringLiteral': return node.value;
    case 'NumericLiteral': return String(node.value);
    case 'Literal': return typeof node.value === 'string' || typeof node.value === 'number' ? String(node.value) : undefined;
    case 'TemplateLiteral': return node.expressions.length === 0 && node.quasis.length === 1 ? node.quasis[0].value.cooked : undefined;
    case 'JSXExpressionContainer': return staticValue(node.expression);
    default: return undefined;
  }
}

function eachString(node, fn) {
  if (!node || typeof node.type !== 'string') return;
  if (node.type === 'StringLiteral' || (node.type === 'Literal' && typeof node.value === 'string')) fn(node, node.value, 0);
  else if (node.type === 'TemplateElement') fn(node, node.value.raw, 0);
  for (const key of Object.keys(node)) {
    if (SKIP_KEYS.has(key)) continue;
    const c = node[key];
    if (Array.isArray(c)) c.forEach(x => eachString(x, fn));
    else if (c && typeof c === 'object') eachString(c, fn);
  }
}

const lineAt = (node, text, index) => node.loc.start.line + (text.slice(0, index).match(/\n/g) || []).length;

function jsxName(name) {
  if (name.type === 'JSXIdentifier') return [name.name];
  if (name.type === 'JSXMemberExpression') {
    const head = jsxName(name.object);
    return head && [...head, name.property.name];
  }
  return null;
}

/** a.b.c -> ['a', 'b', 'c'] для идентификаторов и обычных member-выражений, иначе null. */
function exprParts(node) {
  if (!node) return null;
  if (node.type === 'Identifier') return [node.name];
  if (node.type === 'MemberExpression' && !node.computed && node.property.type === 'Identifier') {
    const head = exprParts(node.object);
    return head && [...head, node.property.name];
  }
  return null;
}

/**
 * visitors для обхода AST. report({ rule, line, message }).
 * enabled: подмножество RULE_IDS (по умолчанию все). filename: абсолютный путь файла.
 */
export function createAnalyzer({ filename = '', manifest, report, enabled = RULE_IDS }) {
  const on = new Set(enabled);
  const layout = isLayoutFile(filename);
  const named = new Map(); // локальное имя -> ключ в манифесте (Button, Card.Head)
  const namespaces = new Set();
  const stringVars = new Map(); // const T = 'div'
  const styledNames = new Set();
  const seen = new Set();
  const flag = (rule, line, message) => {
    if (!on.has(rule)) return;
    const id = `${rule}@${line}@${message}`;
    if (seen.has(id)) return;
    seen.add(id);
    report({ rule, line, message });
  };

  const checkSource = source => {
    if (!source) return;
    const spec = staticValue(source);
    const message = spec && deepImportMessage(spec);
    if (message) flag('no-deep-imports', source.loc.start.line, message);
  };

  const keyFromParts = parts => {
    if (!parts) return null;
    const [root, ...rest] = parts;
    let key;
    if (namespaces.has(root)) key = rest.join('.');
    else if (named.has(root)) key = [named.get(root), ...rest].join('.');
    else return null;
    return manifest.components[key] ? key : null;
  };

  let headDepth = 0;
  const headStack = [];

  const checkClassTokens = attr => {
    eachString(attr.value, (n, text) => {
      const m = SL_CLASS.exec(text);
      if (m) flag('no-sl-css-overrides', lineAt(n, text, m.index), slClassMessage(m[0]));
    });
  };

  // Селектор в querySelector/closest/matches — чтение. В нативной вёрстке (свой JS без React) это можно;
  // в React-коде (JSX или импорт из sloyka) обращение к .sl-* по-прежнему нарушение — решаем в Program:exit.
  const readOnly = new WeakSet();
  const deferred = [];
  let reactFile = false;
  const checkLiteral = (node, text) => {
    const hits = selectorHits(text);
    if (readOnly.has(node)) { if (hits.length) deferred.push({ node, text, hits }); return; }
    for (const hit of hits) flag('no-sl-css-overrides', lineAt(node, text, hit.index), slSelectorMessage(hit.token));
    // Разметка Sloyka строкой (innerHTML, insertAdjacentHTML, шаблоны): class="sl-…"
    const m = MARKUP_SL.exec(text);
    if (m) flag('native-js-markup', lineAt(node, text, m.index), nativeJsMarkupMessage());
  };
  /** el.className = 'sl-…', el.classList.add('sl-…'), el.setAttribute('class', 'sl-…') */
  const checkClassWrite = (valueNodes, line) => {
    for (const v of valueNodes) eachString(v, (n, text) => { if (SL_CLASS.test(text)) flag('native-js-markup', line, nativeJsMarkupMessage()); });
  };

  const checkProp = (key, prop, valueNode, line) => {
    if (FORBIDDEN_ATTRS.has(prop)) return flag('no-component-classname-style', line, classNameMessage(key, prop));
    const spec = manifest.components[key].props[prop];
    const value = spec && spec.type === 'enum' && Array.isArray(spec.options) ? staticValue(valueNode) : undefined;
    if (value !== undefined && !spec.options.includes(value)) flag('no-invalid-prop-value', line, propValueMessage(key, prop, value, spec.options));
  };

  const checkSpread = (key, attr) => {
    const arg = attr.argument;
    const line = attr.loc.start.line;
    if (!arg || arg.type !== 'ObjectExpression') return flag('no-component-classname-style', line, spreadMessage(key));
    for (const p of arg.properties) {
      const isProp = (p.type === 'ObjectProperty' || p.type === 'Property') && !p.computed && !p.method;
      const name = isProp && (p.key.type === 'Identifier' ? p.key.name : staticValue(p.key));
      if (!isProp || typeof name !== 'string') flag('no-component-classname-style', p.loc.start.line, spreadMessage(key));
      else checkProp(key, name, p.value, p.loc.start.line);
    }
  };

  const checkStyledArg = (arg, line) => {
    const tag = staticValue(arg);
    if (typeof tag === 'string' && LOWER_TAG.test(tag)) return flag('no-native-elements', line, nativeElementMessage(tag));
    const key = keyFromParts(exprParts(arg));
    if (key) flag('no-component-classname-style', line, styledWrapMessage(key));
  };

  const visitors = {
    ImportDeclaration(node) {
      checkSource(node.source);
      if (node.importKind === 'type') return;
      const from = node.source.value;
      const isStyled = STYLED_SOURCES.has(from);
      const isSloyka = PACKAGE_NAMES.includes(from);
      for (const s of node.specifiers) {
        if (isSloyka) {
          if (s.type === 'ImportNamespaceSpecifier') namespaces.add(s.local.name);
          else if (s.type === 'ImportSpecifier') named.set(s.local.name, s.imported.name ?? s.imported.value);
        } else if (isStyled && (s.type === 'ImportDefaultSpecifier' || (s.type === 'ImportSpecifier' && (s.imported.name ?? s.imported.value) === 'styled'))) {
          styledNames.add(s.local.name);
        }
      }
    },
    TSImportEqualsDeclaration(node) {
      const ref = node.moduleReference;
      if (ref && ref.type === 'TSExternalModuleReference') checkSource(ref.expression);
    },
    ExportNamedDeclaration: node => checkSource(node.source),
    ExportAllDeclaration: node => checkSource(node.source),
    ImportExpression: node => checkSource(node.source),
    VariableDeclarator(node) {
      if (node.id.type !== 'Identifier' || !node.init) return;
      const str = staticValue(node.init);
      if (typeof str === 'string' && LOWER_TAG.test(str)) stringVars.set(node.id.name, str);
      else {
        const key = keyFromParts(exprParts(node.init)); // const X = Button; const H = Card.Head
        if (key) named.set(node.id.name, key);
      }
    },
    MemberExpression(node) {
      if (node.computed || node.object.type !== 'Identifier' || node.property.type !== 'Identifier') return;
      if (styledNames.has(node.object.name) && LOWER_TAG.test(node.property.name))
        flag('no-native-elements', node.loc.start.line, nativeElementMessage(node.property.name));
    },
    AssignmentExpression(node) {
      const left = node.left;
      if (left.type === 'MemberExpression' && !left.computed && left.property.type === 'Identifier' && left.property.name === 'className')
        checkClassWrite([node.right], node.loc.start.line);
    },
    CallExpression(node) {
      const callee = node.callee;
      if (callee.type === 'MemberExpression' && !callee.computed && callee.property.type === 'Identifier') {
        const method = callee.property.name;
        const obj = callee.object;
        const onClassList = obj.type === 'MemberExpression' && !obj.computed && obj.property.type === 'Identifier' && obj.property.name === 'classList';
        if (onClassList && CLASS_LIST_WRITES.has(method)) checkClassWrite(node.arguments, node.loc.start.line);
        if (method === 'setAttribute' && staticValue(node.arguments[0]) === 'class') checkClassWrite(node.arguments.slice(1), node.loc.start.line);
        if (QUERY_METHODS.has(method) && node.arguments[0]) {
          const arg = node.arguments[0];
          readOnly.add(arg);
          if (arg.type === 'TemplateLiteral') arg.quasis.forEach((q) => readOnly.add(q));
        }
      }
      if ((callee.type === 'Identifier' && callee.name === 'require') || callee.type === 'Import') checkSource(node.arguments[0]);
      else if (callee.type === 'MemberExpression' && callee.object.type === 'Identifier' && callee.object.name === 'require' && callee.property.name === 'resolve') checkSource(node.arguments[0]);
      const fn = callee.type === 'Identifier' ? callee.name : callee.type === 'MemberExpression' && !callee.computed && callee.property.type === 'Identifier' ? callee.property.name : null;
      if (fn && CREATE_ELEMENT_NAMES.has(fn)) {
        const tag = staticValue(node.arguments[0]);
        if (typeof tag === 'string' && LOWER_TAG.test(tag)) flag('no-native-elements', node.loc.start.line, nativeElementMessage(tag));
      }
      if (callee.type === 'Identifier' && styledNames.has(callee.name)) checkStyledArg(node.arguments[0], node.loc.start.line);
    },
    'Program:exit'() {
      if (!reactFile && named.size === 0 && namespaces.size === 0) return;
      for (const { node, text, hits } of deferred) for (const hit of hits) flag('no-sl-css-overrides', lineAt(node, text, hit.index), slSelectorMessage(hit.token));
    },
    JSXElement(node) {
      reactFile = true;
      const opening = node.openingElement;
      const name = opening.name;
      let tag = null;
      if (name.type === 'JSXNamespacedName') tag = `${name.namespace.name}:${name.name.name}`;
      else if (name.type === 'JSXIdentifier') tag = LOWER_TAG.test(name.name) ? name.name : stringVars.get(name.name) ?? null;
      const native = tag !== null;
      const isHead = native && layout && tag === 'head';
      headStack.push(isHead);
      if (isHead) headDepth++;
      const inHead = headDepth > (isHead ? 1 : 0);
      const line = name.loc.start.line;

      if (native) {
        if (inHead && tag === 'style') flag('no-native-elements', line, headRestrictedMessage('<style>'));
        else if (!((layout && LAYOUT_TAGS.has(tag)) || inHead)) flag('no-native-elements', line, nativeElementMessage(tag));
      }

      const key = native ? null : keyFromParts(jsxName(name));
      for (const attr of opening.attributes) {
        if (attr.type === 'JSXSpreadAttribute') {
          if (key) checkSpread(key, attr);
          continue;
        }
        if (attr.type !== 'JSXAttribute' || attr.name.type !== 'JSXIdentifier') continue;
        const prop = attr.name.name;
        if (key) checkProp(key, prop, attr.value, attr.loc.start.line);
        else if (native && inHead && prop === 'dangerouslySetInnerHTML') flag('no-native-elements', attr.loc.start.line, headRestrictedMessage('dangerouslySetInnerHTML'));
        if (prop === 'className' || prop === 'class') checkClassTokens(attr);
      }
    },
    'JSXElement:exit'() {
      if (headStack.pop()) headDepth--;
    },
    StringLiteral: node => checkLiteral(node, node.value),
    Literal: node => typeof node.value === 'string' && checkLiteral(node, node.value),
    TemplateElement: node => checkLiteral(node, node.value.raw),
  };
  return visitors;
}
