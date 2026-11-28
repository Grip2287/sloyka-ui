// Новый компонент сразу в двух вариантах: React и нативный (HTML + CSS, при надобности — скрипт поведения).
//   npm run new:component -- <Name> <NN> "<Группа по-русски>" [--script]
// Создаёт:
//   src/react/components/<slug>/<Name>.tsx        React-компонент с defineMeta
//   src/components/<slug>/<slug>.css              стили (общие для React и нативной вёрстки)
//   src/components/<slug>/<Name>.stories.tsx      примеры для Storybook (панель «Код» покажет React и HTML)
//   tests/unit/react/<slug>.test.tsx              заготовка теста
//   src/native/scripts/<slug>.js                  скрипт поведения (только с --script)
// и дописывает: экспорт в src/react/index.ts, @import в src/index.css, нативный пример в src/native/samples.tsx
// (и запись в SCRIPTS при --script). Нативная разметка получается из React при сборке (scripts/gen-native.js),
// тест tests/unit/native.test.js не даст собрать компонент без нативного варианта.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const args = process.argv.slice(2);
const withScript = args.includes('--script');
const [name, n, group] = args.filter((a) => a !== '--script');
if (!name || !/^[A-Z][A-Za-z]+$/.test(name) || !/^\d\d$/.test(n ?? '') || !group) {
  console.error('Использование: npm run new:component -- <Name> <NN> "<Группа>" [--script]\nНапример: npm run new:component -- Badge 04 "Теги и счётчики"');
  process.exit(2);
}
const slug = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const cls = `sl-${slug}`;

function create(path, text) {
  if (existsSync(path)) { console.error(`Уже есть: ${path}`); process.exit(1); }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  console.log(`создан  ${path}`);
}
function patch(path, find, insert, label, last = false) {
  const src = readFileSync(path, 'utf8');
  // файлы бывают с CRLF (Windows): ищем и вставляем в том же формате строк
  if (src.includes('\r\n')) { find = find.replace(/\n/g, '\r\n'); insert = insert.replace(/\r?\n/g, '\r\n'); }
  const at = last ? src.lastIndexOf(find) : src.indexOf(find);
  if (at < 0) { console.error(`Не нашёл место для вставки в ${path}: ${label}`); process.exit(1); }
  writeFileSync(path, src.slice(0, at) + insert + src.slice(at + find.length));
  console.log(`дописан ${path} (${label})`);
}

create(`src/react/components/${slug}/${name}.tsx`, `import type { ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, pick, cx, checkChildren } from '../../core';

const TONES = ['default', 'ok', 'warn', 'crit'] as const;

export interface ${name}Props {
  tone?: (typeof TONES)[number];
  children?: ReactNode;
}

function ${name}Impl({ tone, children }: ${name}Props) {
  checkChildren(${name}Impl as unknown as SloykaMarked, children);
  const t = pick('${name}', 'tone', tone, TONES, 'default');
  // Разметка = нативный вариант: классы ${cls}* описаны в src/components/${slug}/${slug}.css.
  return <div className={cx('${cls}', t !== 'default' && \`${cls}--\${t}\`)}>{children}</div>;
}
export const ${name} = defineMeta(${name}Impl, {
  n: '${n}', group: '${group}', name: '${name}', allowed: 'any',
  props: { tone: { type: 'enum', options: TONES, default: 'default' } },
});
`);

create(`src/components/${slug}/${slug}.css`, `/* Sloyka · ${slug} — общие стили React- и нативного варианта */
@layer sl.components {
  .${cls} { display: block; padding: var(--sl-4); border: 1px solid var(--sl-border); border-radius: var(--sl-r-md); background: var(--sl-surface); }
  .${cls}--ok { border-color: var(--sl-ok); }
  .${cls}--warn { border-color: var(--sl-warn); }
  .${cls}--crit { border-color: var(--sl-crit); }
}
`);

create(`src/components/${slug}/${name}.stories.tsx`, `import { ${name}, Text } from '../../react';

export default {
  title: 'Компоненты/${n} · ${group}',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'TODO: что это и когда использовать. Панель «Код» показывает React и HTML + CSS.' } } },
};

export const Default = {
  name: '${name}',
  render: () => <${name}><Text>Содержимое</Text></${name}>,
};

export const Tones = {
  name: 'Тона',
  render: () => <>{(['ok', 'warn', 'crit'] as const).map((t) => <${name} key={t} tone={t}><Text>{t}</Text></${name}>)}</>,
};
`);

create(`tests/unit/react/${slug}.test.tsx`, `import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { ${name}, Text } from '../../../src/react';

afterEach(cleanup);

describe('${name}', () => {
  it('разметка совпадает с нативным вариантом', () => {
    const { container } = render(<${name} tone="ok"><Text>Текст</Text></${name}>);
    expect(container.firstElementChild!.className).toBe('${cls} ${cls}--ok');
  });
});
`);

patch('src/react/index.ts', "export { ThemeScript } from './components/theme/ThemeScript';",
  `export { ThemeScript } from './components/theme/ThemeScript';\nexport { ${name} } from './components/${slug}/${name}';\nexport type { ${name}Props } from './components/${slug}/${name}';`, 'экспорт');
patch('src/index.css', '@import "./components/banner/banner.css";',
  `@import "./components/banner/banner.css";\n@import "./components/${slug}/${slug}.css";`, '@import стилей');
patch('src/native/samples.tsx', '\n};\n',
  `\n  // ${n} · ${group}\n  ${name}: [\n    { title: '${name}', node: <${name}><Text>Содержимое</Text></${name}> },\n    { title: '${name} — «норма»', node: <${name} tone="ok"><Text>Всё в порядке</Text></${name}> },\n  ],\n};\n`, 'нативный пример', true);
patch('src/native/samples.tsx', "} from '../react';", `  ${name},\n} from '../react';`, 'импорт');

if (withScript) {
  create(`src/native/scripts/${slug}.js`, `/* Sloyka · ${n} · ${name} — поведение нативного варианта (HTML + CSS).
   Повторяет поведение React-компонента. Подключается только там, где компонент есть на странице.
   Без импортов; слушатели на document (работает и для разметки, добавленной позже). */
(function () {
  if (window.__sl${name}) return;
  window.__sl${name} = true;
  document.addEventListener('click', function (e) {
    var el = e.target instanceof Element ? e.target.closest('.${cls}') : null;
    if (!el) return;
    // TODO: то же, что делает React-компонент; о результате — CustomEvent('sl-…', { bubbles: true }).
  });
})();
`);
  patch('src/native/samples.tsx', 'export const SCRIPTS: Record<string, NativeScript> = {',
    `export const SCRIPTS: Record<string, NativeScript> = {\n  ${name}: { file: '${slug}.js', about: 'TODO: что делает скрипт, его атрибуты и события.' },`, 'скрипт');
}

console.log(`
Дальше:
  1. Допишите ${name}.tsx и ${slug}.css; варианты — enum-пропсы с классами ${cls}--*.
  2. Добавьте варианты в SAMPLES (src/native/samples.tsx) — из них соберётся native/${slug}.html.${withScript ? `\n  3. Повторите поведение React в src/native/scripts/${slug}.js и добавьте сценарий в tests/unit/native.test.js.` : ''}
  ${withScript ? 4 : 3}. npm run build && npm test — проверка, что у компонента есть оба варианта.
  ${withScript ? 5 : 4}. npx changeset — minor: «Добавлен ${name} ${n}».`);
