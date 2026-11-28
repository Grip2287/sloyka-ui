// sloyka-check для нативной вёрстки (.html): разметка только из native/*.html и styles.css.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { checkProject } from '../../src/check/index.js';

const native = JSON.parse(readFileSync('native/components.json', 'utf8'));
const pick = (name, i = 0) => native.components.find((c) => c.name === name).samples[i].html;

let dir;
beforeAll(() => { dir = mkdtempSync(join(tmpdir(), 'sloyka-native-check-')); });
afterAll(() => rmSync(dir, { recursive: true, force: true }));

const page = (body, head = '') => `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>Пульт</title>
  <link rel="stylesheet" href="node_modules/sloyka/dist/styles.css">
  <script src="node_modules/sloyka/native/theme-head.js"></script>
  ${head}
</head>
<body>
${body}
  <script src="node_modules/sloyka/native/modal.js"></script>
</body>
</html>
`;

function check(html) {
  writeFileSync(join(dir, 'index.html'), html);
  const r = checkProject(dir, { allowFile: false });
  expect(r.errors).toEqual([]);
  return r.violations.map((v) => `${v.line} ${v.rule}`);
}

describe('sloyka-check: нативная вёрстка', () => {
  it('страница из нативных фрагментов проходит без нарушений', () => {
    const body = [pick('Shell'), pick('Modal'), pick('Metric'), pick('Stats'), pick('Table'), pick('Menu'), pick('Tooltip')].join('\n');
    const js = `<script>
  document.getElementById('user-modal').addEventListener('sl-close', () => slToast.ok('Сохранено'));
  document.querySelector('#save').addEventListener('click', (e) => fetch('/api/users', { method: 'POST' }));
</script>`;
    expect(check(page(body + js))).toEqual([]);
  });

  it('все фрагменты всех компонентов проходят проверку', () => {
    const body = native.components.flatMap((c) => c.samples.map((s) => s.html)).join('\n');
    expect(check(page(body))).toEqual([]);
  });

  it('свои классы, теги, style и <style> — нарушения', () => {
    const v = check(page([
      '<div class="my-box">своя обёртка</div>',
      '<p>текст без компонента</p>',
      '<div class="sl-stack sl-stack--gap-2"><p>текст в стопке</p></div>',
      '<button class="sl-btn sl-btn--fancy">Нет такого</button>',
      '<button class="sl-btn" style="color:red">Красная</button>',
      '<marquee class="sl-text">бегущая строка</marquee>',
    ].join('\n'), '<style>.sl-btn { border-radius: 0 }</style>'));
    expect(v).toEqual(expect.arrayContaining([
      '8 no-sl-css-overrides', '8 native-no-style-tag',
      '11 native-own-class', '12 native-own-tag', '13 native-own-tag',
      '14 native-unknown-class', '15 native-no-inline-style', '16 native-own-tag',
    ]));
  });

  it('JS не создаёт разметку Sloyka и не меняет классы sl-*', () => {
    const v = check(page(`<script>
  const box = document.getElementById('box');
  box.innerHTML = '<div class="sl-card">Карточка</div>';
  box.className = 'sl-card';
  box.classList.add('sl-btn--primary');
</script>`));
    expect(v).toEqual(['13 native-js-markup', '14 native-js-markup', '15 native-js-markup']);
  });

  it('из пакета подключаются только styles.css, шаблоны и скрипты компонентов', () => {
    const v = check(page('', '<script src="node_modules/sloyka/dist/index.js"></script>\n  <link rel="stylesheet" href="https://unpkg.com/sloyka@2.0.0/templates/template-1.css">'));
    expect(v).toEqual(['8 no-deep-imports']);
  });
});
