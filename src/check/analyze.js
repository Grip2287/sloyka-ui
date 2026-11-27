// Общая логика проверки JS/TS/JSX. Работает с узлами и Babel, и ESTree (ESLint),
// поэтому ESLint-плагин и CLI дают одинаковый результат.
import { RULE_IDS, PACKAGE_NAMES, nativeElementMessage, classNameMessage, propValueMessage, deepImportMessage, slSelectorMessage, slClassMessage } from './rules.js';
import { selectorHits } from './scan-css.js';

const FORBIDDEN_ATTRS = new Set(['className', 'style', 'dangerouslySetInnerHTML']);
const SKIP_KEYS = new Set(['parent', 'loc', 'range', 'start', 'end', 'tokens', 'comments', 'extra', 'leadingComments', 'trailingComments', 'innerComments']);
const SL_CLASS = /(?<![\w-])sl-[A-Za-z][\w-]*/;

const isLayoutFile = filename => {
  const p = filename.split('\\').join('/');
  return /(^|\/)app\/(.*\/)?layout\.[cm]?[jt]sx?$/.test(p) || /(^|\/)pages\/_document\.[cm]?[jt]sx?$/.test(p);
};

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

/**
 * visitors для обхода AST. report({ rule, message, line }).
 * enabled: подмножество RULE_IDS (по умолчанию все).
 */
export function createAnalyzer({ filename = '', manifest, report, enabled = RULE_IDS }) {
  const on = new Set(enabled);
  const layout = isLayoutFile(filename);
  const named = new Map(); // локальное имя -> имя в пакете
  const namespaces = new Set();
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

  const sloykaKey = nameNode => {
    const parts = jsxName(nameNode);
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

  const checkLiteral = (node, text) => {
    for (const hit of selectorHits(text)) flag('no-sl-css-overrides', lineAt(node, text, hit.index), slSelectorMessage(hit.token));
  };

  const visitors = {
    ImportDeclaration(node) {
      checkSource(node.source);
      if (node.importKind === 'type' || !PACKAGE_NAMES.includes(node.source.value)) return;
      for (const s of node.specifiers) {
        if (s.type === 'ImportNamespaceSpecifier') namespaces.add(s.local.name);
        else if (s.type === 'ImportSpecifier') named.set(s.local.name, s.imported.name ?? s.imported.value);
      }
    },
    ExportNamedDeclaration: node => checkSource(node.source),
    ExportAllDeclaration: node => checkSource(node.source),
    ImportExpression: node => checkSource(node.source),
    CallExpression(node) {
      const callee = node.callee;
      if ((callee.type === 'Identifier' && callee.name === 'require') || callee.type === 'Import') checkSource(node.arguments[0]);
    },
    JSXElement(node) {
      const opening = node.openingElement;
      const name = opening.name;
      const native = name.type === 'JSXIdentifier' && /^[a-z]/.test(name.name);
      const isHead = native && layout && name.name === 'head';
      headStack.push(isHead);
      if (isHead) headDepth++;
      const line = name.loc.start.line;

      if (native) {
        const tag = name.name;
        const allowed = (layout && LAYOUT_TAGS.has(tag)) || (headDepth > (isHead ? 1 : 0));
        if (!allowed) flag('no-native-elements', line, nativeElementMessage(tag));
      }

      const key = native ? null : sloykaKey(name);
      for (const attr of opening.attributes) {
        if (attr.type !== 'JSXAttribute' || attr.name.type !== 'JSXIdentifier') continue;
        const prop = attr.name.name;
        const attrLine = attr.loc.start.line;
        if (key && FORBIDDEN_ATTRS.has(prop)) flag('no-component-classname-style', attrLine, classNameMessage(key, prop));
        else if (key) {
          const spec = manifest.components[key].props[prop];
          const value = spec && spec.type === 'enum' && Array.isArray(spec.options) ? staticValue(attr.value) : undefined;
          if (value !== undefined && !spec.options.includes(value)) flag('no-invalid-prop-value', attrLine, propValueMessage(key, prop, value, spec.options));
        }
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

const LAYOUT_TAGS = new Set(['html', 'head', 'body']);
