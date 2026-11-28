// Единый список правил проверки проекта, сообщения и подсказки «чем заменить».
// Его используют CLI, ESLint и Stylelint: тексты везде одинаковые.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RULE_IDS = [
  'no-native-elements', 'no-component-classname-style', 'no-deep-imports', 'no-sl-css-overrides', 'no-invalid-prop-value',
  // нативная вёрстка (HTML + CSS)
  'native-unknown-class', 'native-own-class', 'native-own-tag', 'native-no-inline-style', 'native-no-style-tag', 'native-js-markup',
];

export const RULE_DOCS = {
  'no-native-elements': 'Нативные HTML-теги в коде сайта запрещены: страницы собираются из компонентов Sloyka.',
  'no-component-classname-style': 'Компоненты Sloyka не принимают className, style и dangerouslySetInnerHTML.',
  'no-deep-imports': 'Импортируйте только публичные входы пакета sloyka, без sloyka/dist/… и sloyka/src/….',
  'no-sl-css-overrides': 'Классы .sl-* внутренние: не переопределяйте и не используйте их в стилях и разметке сайта.',
  'no-invalid-prop-value': 'Значение пропса-перечисления должно быть из списка, который указан в components.json.',
  'native-unknown-class': 'Нативная вёрстка: класса sl-* нет в Sloyka. Копируйте разметку из native/*.html.',
  'native-own-class': 'Нативная вёрстка: свои классы запрещены, только классы из разметки нативных компонентов.',
  'native-own-tag': 'Нативная вёрстка: своих тегов и обёрток нет, страница собирается из фрагментов native/*.html.',
  'native-no-inline-style': 'Нативная вёрстка: атрибут style запрещён (кроме значений, которые ставит сам компонент).',
  'native-no-style-tag': 'Нативная вёрстка: свой <style> запрещён. Вид задают styles.css и шаблоны sloyka/templates/*.',
  'native-js-markup': 'Свой JS не создаёт и не меняет разметку Sloyka (классы sl-*). Он только обрабатывает события.',
};

/** style, который ставит сам компонент (данные, а не вид): шкала Metric и цвет цифры Stats. */
export const NATIVE_STYLE_ALLOWED = /^style="(width:\d+(\.\d+)?%|--c:var\(--sl-(ok|warn|crit)\))"$/;

let nativeCache;
/** Классы из dist/styles.css и теги из нативных фрагментов (native/components.json) — то, из чего можно собирать страницу. */
export function loadNativeKnown() {
  if (nativeCache) return nativeCache;
  const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  const css = readFileSync(join(root, 'dist', 'styles.css'), 'utf8');
  const classes = new Set([...css.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]));
  const native = JSON.parse(readFileSync(join(root, 'native', 'components.json'), 'utf8'));
  const tags = new Set();
  for (const c of native.components) for (const s of c.samples) for (const m of s.html.matchAll(/<([a-zA-Z][\w-]*)/g)) tags.add(m[1].toLowerCase());
  return (nativeCache = { classes, tags, components: native.components });
}

const nativeFile = (names) => {
  const list = loadNativeKnown().components.filter((c) => names.includes(c.name));
  return list.map((c) => `${c.name} ${c.n} (native/${c.file})`).join(' или ');
};

export const PACKAGE_NAMES = ['sloyka', '@grip2287/sloyka'];
export const PUBLIC_ENTRIES = ['sloyka', 'sloyka/styles.css', 'sloyka/templates/*', 'sloyka/native/*', 'sloyka/check', 'sloyka/eslint', 'sloyka/stylelint', 'sloyka/components.json'];
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
  let s = String(spec).replace(/^~/, '').replace(/[?#].*$/, '');
  const nm = s.lastIndexOf('node_modules/');
  if (nm >= 0) s = s.slice(nm + 'node_modules/'.length);
  const pkg = PACKAGE_NAMES.find(p => s === p || s.startsWith(`${p}/`));
  if (!pkg) return null;
  const sub = s.slice(pkg.length + 1);
  if (s === pkg || PUBLIC_SUBPATHS.has(sub) || /^(templates|native)\/[^/]+$/.test(sub)) return null;
  return `Импорт '${spec}' закрыт. Используйте публичные входы: ${PUBLIC_ENTRIES.join(', ')}.`;
}

export function slSelectorMessage(token) {
  return `Селектор ${token} нацелен на внутренний класс Sloyka (.sl-*). Настраивайте вид пропсами компонентов или подключите шаблон sloyka/templates/*.`;
}

export function slClassMessage(token) {
  return `Класс ${token} внутренний (.sl-*) и не предназначен для сайта. Используйте компоненты Sloyka с пропсами.`;
}

export function headRestrictedMessage(what) {
  return `В <head> нельзя ${what}. Тему подключайте через ThemeScript, стили через sloyka/styles.css и шаблоны.`;
}

export function spreadMessage(component) {
  return `${component}: spread-пропсы не проверяются. Передайте пропсы явно (например variant="primary"), без {...props}.`;
}

export function styledWrapMessage(component) {
  return `styled(${component}) подменяет стили компонента Sloyka. Задавайте вид пропсами ${component}.`;
}

// ── Нативная вёрстка (HTML + CSS) ──

export function nativeUnknownClassMessage(cls) {
  return `Класса ${cls} нет в Sloyka. Возьмите разметку компонента из native/*.html (справочник agents/native-components.md), не придумывайте классы.`;
}

export function nativeOwnClassMessage(cls) {
  return `Свой класс "${cls}" не допускается: вид задают только классы нативных компонентов Sloyka. Раскладка — Stack 00 или Grid 00 (native/stack.html, native/grid.html).`;
}

export function nativeStyleMessage() {
  return 'Атрибут style не допускается. Размер, отступы и цвет задаются вариантами компонентов (классы из native/*.html) или шаблоном sloyka/templates/*.';
}

export function nativeStyleTagMessage() {
  return 'Свой <style> не допускается. Стили — только <link rel="stylesheet" href="…/sloyka/dist/styles.css"> и шаблоны sloyka/templates/*.';
}

export function nativeOwnTagMessage(tag) {
  const hint = nativeFile(TAG_HINTS[tag] || []);
  return `<${tag}> нет в разметке компонентов Sloyka. ${hint ? `Используйте ${hint}.` : 'Возьмите подходящий компонент из native/*.html.'}`;
}

export function nativeSlotMessage(tag, slot) {
  const hint = nativeFile(TAG_HINTS[tag] || []);
  return `<${tag}> без класса Sloyka ${slot ? `внутри .${slot}` : 'на странице'} — это своя вёрстка. ${hint ? `Используйте ${hint}.` : 'Ставьте сюда компоненты из native/*.html целиком.'}`;
}

/** Путь к файлу пакета в <link href> или <script src>: null, если это не sloyka или разрешённый файл. */
export function nativeAssetMessage(path) {
  const m = /(?:^|[/@])sloyka(?:@[^/]+)?\/(.+)$/.exec(String(path).replace(/[?#].*$/, ''));
  if (!m) return null;
  const sub = m[1];
  if (/^(dist\/styles\.css|native\/[\w-]+\.js|templates\/[\w-]+\.css)$/.test(sub)) return null;
  return `Файл '${path}' закрыт. Подключайте только sloyka/dist/styles.css, sloyka/templates/*.css и скрипты компонентов sloyka/native/*.js.`;
}

export function nativeJsMarkupMessage() {
  return 'JS не создаёт и не меняет разметку Sloyka (классы sl-*): возьмите готовый фрагмент из native/*.html, а поведение — из скрипта компонента sloyka/native/*.js. Свой JS только обрабатывает события.';
}
