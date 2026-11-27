// Единый список правил проверки проекта, сообщения и подсказки «чем заменить».
// Его используют CLI, ESLint и Stylelint: тексты везде одинаковые.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RULE_IDS = ['no-native-elements', 'no-component-classname-style', 'no-deep-imports', 'no-sl-css-overrides', 'no-invalid-prop-value'];

export const RULE_DOCS = {
  'no-native-elements': 'Нативные HTML-теги в коде сайта запрещены: страницы собираются из компонентов Sloyka.',
  'no-component-classname-style': 'Компоненты Sloyka не принимают className, style и dangerouslySetInnerHTML.',
  'no-deep-imports': 'Импортируйте только публичные входы пакета sloyka, без sloyka/dist/… и sloyka/src/….',
  'no-sl-css-overrides': 'Классы .sl-* внутренние: не переопределяйте и не используйте их в стилях и разметке сайта.',
  'no-invalid-prop-value': 'Значение пропса-перечисления должно быть из списка, который указан в components.json.',
};

export const PACKAGE_NAMES = ['sloyka', '@grip2287/sloyka'];
export const PUBLIC_ENTRIES = ['sloyka', 'sloyka/styles.css', 'sloyka/templates/*', 'sloyka/check', 'sloyka/eslint', 'sloyka/stylelint', 'sloyka/components.json'];
const PUBLIC_SUBPATHS = new Set(['styles.css', 'check', 'eslint', 'stylelint', 'components.json', 'package.json']);

let manifestCache;
/** components.json лежит на два уровня выше этого файла и в src/check, и в dist/check. */
export function loadManifest() {
  return (manifestCache ||= JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'components.json'), 'utf8')));
}

// Нативный тег -> компоненты Sloyka. Номера берутся из манифеста, имя без номера не выводится.
const TAG_HINTS = {
  button: ['Button'],
  a: ['Link', 'Button'],
  input: ['Field', 'Search', 'Checkbox', 'Radio', 'Switch'],
  textarea: ['Textarea'],
  select: ['Select'],
  option: ['Select'],
  label: ['Field'],
  table: ['Table'], thead: ['Table'], tbody: ['Table'], tr: ['Table', 'Row'], td: ['Table'], th: ['Table'],
  h1: ['Text', 'PageHeader'], h2: ['Text'], h3: ['Text'], h4: ['Text'], h5: ['Text'], h6: ['Text'],
  p: ['Text'], span: ['Text'], strong: ['Text'], em: ['Text'], small: ['Text'], b: ['Text'], i: ['Text'],
  img: ['Image'],
  svg: ['Icon'],
  form: ['Form'],
  ul: ['List'], ol: ['List'], li: ['List'],
  dialog: ['Modal'],
  details: ['Disclosure'], summary: ['Disclosure'],
  nav: ['Nav'],
  header: ['PageHeader', 'Topbar'],
  footer: ['StatusBar', 'Card.Foot'],
  main: ['Page', 'Shell'],
  aside: ['Card', 'Banner'],
  section: ['Stack', 'Card', 'Page'],
  article: ['Card', 'Stack'],
  div: ['Stack', 'Grid', 'Card', 'Page'],
};
const LAYOUT_ONLY = new Set(['html', 'head', 'body']);

const hintList = names => {
  const components = loadManifest().components;
  const parts = names.filter(n => components[n]).map(n => `${n} ${components[n].n}`);
  return parts.join(' или ');
};

export function nativeElementMessage(tag) {
  if (LAYOUT_ONLY.has(tag))
    return `<${tag}> допустим только в app/layout (Next). Страницы собирайте из компонентов Sloyka (components.json).`;
  const hint = hintList(TAG_HINTS[tag] || []);
  return `Нативный <${tag}> не допускается. ${hint ? `Используйте ${hint}.` : 'Используйте подходящий компонент Sloyka (список в sloyka/components.json).'}`;
}

const enumProps = name => {
  const c = loadManifest().components[name];
  return Object.entries(c?.props || {}).filter(([, p]) => p.type === 'enum' && Array.isArray(p.options));
};

export function classNameMessage(component, attr) {
  if (attr === 'dangerouslySetInnerHTML') return `${component} не принимает dangerouslySetInnerHTML. Передайте содержимое как children.`;
  const variants = enumProps(component).slice(0, 4).map(([k, p]) => `${k} (${p.options.join(' | ')})`);
  const how = variants.length ? `Внешний вид задаётся пропсами: ${variants.join(', ')}.` : 'Отступы и раскладку задавайте через Stack или Grid.';
  return `${component} не принимает ${attr}. ${how}`;
}

export function propValueMessage(component, prop, value, options) {
  return `${component}: ${prop}="${value}" недопустимо. Допустимо: ${options.join(' | ')}.`;
}

/** null, если спецификатор не относится к sloyka или это публичный вход. */
export function deepImportMessage(spec) {
  let s = String(spec).replace(/^~/, '');
  const nm = s.lastIndexOf('node_modules/');
  if (nm >= 0) s = s.slice(nm + 'node_modules/'.length);
  const pkg = PACKAGE_NAMES.find(p => s === p || s.startsWith(`${p}/`));
  if (!pkg) return null;
  const sub = s.slice(pkg.length + 1);
  if (s === pkg || PUBLIC_SUBPATHS.has(sub) || /^templates\/[^/]+$/.test(sub)) return null;
  return `Импорт '${spec}' закрыт. Используйте публичные входы: ${PUBLIC_ENTRIES.join(', ')}.`;
}

export function slSelectorMessage(token) {
  return `Селектор ${token} нацелен на внутренний класс Sloyka (.sl-*). Настраивайте вид пропсами компонентов или подключите шаблон sloyka/templates/*.`;
}

export function slClassMessage(token) {
  return `Класс ${token} внутренний (.sl-*) и не предназначен для сайта. Используйте компоненты Sloyka с пропсами.`;
}
