import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ESLint } from 'eslint';
import stylelint from 'stylelint';
import babelParser from '@babel/eslint-parser';
import { checkProject } from '../../src/check/index.js';
import { main } from '../../src/check/cli.js';
import { loadManifest, RULE_IDS, nativeElementMessage, deepImportMessage, classNameMessage } from '../../src/check/rules.js';
import sloykaEslint from '../../src/check/eslint.js';
import sloykaStylelint from '../../src/check/stylelint.js';

const FIX = resolve('tests/check/fixtures');
const posix = p => p.split(sep).join('/');

const walk = dir =>
  readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter(d => d.isFile())
    .map(d => posix(relative(dir, join(d.parentPath, d.name))));

// `expect: rule@line, rule@line` в комментариях фикстуры
function expected(file) {
  const out = [];
  for (const m of readFileSync(file, 'utf8').matchAll(/expect:\s*([^\n*]+)/g))
    for (const item of m[1].split(',')) {
      const t = item.trim().match(/^([\w-]+)@(\d+)$/);
      if (t) out.push(`${t[1]}@${t[2]}`);
    }
  return out.sort();
}
const key = v => `${v.rule}@${v.line}`;
const byFile = list => {
  const map = {};
  for (const v of list) (map[v.file] ||= []).push(key(v));
  for (const k of Object.keys(map)) map[k].sort();
  return map;
};

let bad, good;
beforeAll(() => {
  bad = checkProject(join(FIX, 'bad'), { allowFile: false });
  good = checkProject(join(FIX, 'good'), { allowFile: false });
});

describe('sloyka-check: fixtures', () => {
  it('each bad file gives exactly the expected violations', () => {
    const files = walk(join(FIX, 'bad'));
    expect(files.length).toBeGreaterThanOrEqual(6);
    const got = byFile(bad.violations);
    for (const f of files) {
      expect(expected(join(FIX, 'bad', f)).length, `${f} has expect comments`).toBeGreaterThan(0);
      expect(got[f] || [], f).toEqual(expected(join(FIX, 'bad', f)));
    }
  });

  it('good project has zero violations', () => {
    expect(good.violations).toEqual([]);
    expect(good.files).toBeGreaterThanOrEqual(3);
  });

  it('rule ids', () => {
    expect(RULE_IDS).toEqual(['no-native-elements', 'no-component-classname-style', 'no-deep-imports', 'no-sl-css-overrides', 'no-invalid-prop-value']);
  });

  it('messages are in Russian and carry hints from the manifest', () => {
    const msgs = bad.violations.filter(v => v.rule === 'no-native-elements').map(v => v.message);
    expect(nativeElementMessage('button')).toMatch(/Button 01/);
    expect(nativeElementMessage('table')).toMatch(/Table 13/);
    expect(nativeElementMessage('input')).toMatch(/Field 02.*Search 02/);
    expect(msgs.some(m => /<table>/.test(m) && /Table 13/.test(m))).toBe(true);
    expect(classNameMessage('Button', 'className')).toMatch(/variant/);
    expect(deepImportMessage('sloyka/dist/index.js')).toMatch(/sloyka\/styles\.css/);
    expect(deepImportMessage('sloyka/templates/strogij.css')).toBeNull();
    expect(deepImportMessage('react')).toBeNull();
    for (const v of bad.violations) expect(v.message, key(v)).toMatch(/[а-яё]/i);
  });

  it('every hint component exists in the manifest', () => {
    const names = new Set(Object.keys(loadManifest().components));
    for (const tag of ['button', 'a', 'input', 'textarea', 'select', 'table', 'h1', 'p', 'img', 'form', 'ul', 'dialog', 'div', 'span'])
      for (const m of nativeElementMessage(tag).matchAll(/([A-Z][A-Za-z.]+) \d\d/g)) expect(names.has(m[1]), `${tag} → ${m[1]}`).toBe(true);
  });
});

describe('sloyka-check: ESLint and Stylelint match the CLI', () => {
  it('ESLint plugin gives the same violations as the CLI', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      cwd: FIX,
      overrideConfig: [
        {
          files: ['**/*.{js,jsx,ts,tsx}'],
          languageOptions: {
            parser: babelParser,
            parserOptions: { requireConfigFile: false, sourceType: 'module', babelOptions: { parserOpts: { plugins: ['jsx', 'typescript'] } } },
          },
        },
        sloykaEslint.configs.recommended,
      ],
    });
    const results = await eslint.lintFiles(['good', 'bad']);
    const got = {};
    for (const r of results) {
      const f = posix(relative(FIX, r.filePath));
      for (const m of r.messages) {
        expect(m.fatal, `${f}: ${m.message}`).toBeFalsy();
        expect(m.ruleId).toMatch(/^sloyka\//);
        (got[f] ||= []).push(`${m.ruleId.slice(7)}@${m.line}`);
      }
    }
    for (const k of Object.keys(got)) got[k].sort();
    const cli = {};
    for (const [scope, res] of [['good', good], ['bad', bad]])
      for (const v of res.violations) if (!v.file.endsWith('.css')) (cli[`${scope}/${v.file}`] ||= []).push(key(v));
    for (const k of Object.keys(cli)) cli[k].sort();
    expect(got).toEqual(cli);
    expect(Object.keys(got).length).toBeGreaterThan(3);
    const msg = results.flatMap(r => r.messages).find(m => m.ruleId === 'sloyka/no-native-elements');
    expect(bad.violations.some(v => v.message === msg.message)).toBe(true);
  });

  it('Stylelint plugin gives the same violations as the CLI', async () => {
    const out = await stylelint.lint({ files: [join(FIX, '**/*.css').replace(/\\/g, '/')], config: sloykaStylelint });
    const got = {};
    for (const r of out.results) {
      const f = posix(relative(FIX, r.source));
      expect(r.parseErrors).toEqual([]);
      for (const w of r.warnings) {
        expect(w.rule).toMatch(/^sloyka\//);
        (got[f] ||= []).push(`${w.rule.slice(7)}@${w.line}`);
      }
    }
    for (const k of Object.keys(got)) got[k].sort();
    const cli = {};
    for (const [scope, res] of [['good', good], ['bad', bad]])
      for (const v of res.violations) if (v.file.endsWith('.css')) (cli[`${scope}/${v.file}`] ||= []).push(key(v));
    for (const k of Object.keys(cli)) cli[k].sort();
    expect(got).toEqual(cli);
    expect(got['bad/deep.css'].length).toBe(7);
    const w = out.results.flatMap(r => r.warnings).find(x => x.rule === 'sloyka/no-sl-css-overrides');
    expect(bad.violations.some(v => w.text.includes(v.message))).toBe(true);
  });
});

describe('sloyka-check: CLI', () => {
  const run = (argv, cwd) => {
    const out = [], err = [];
    const code = main(argv, { cwd, out: s => out.push(s), err: s => err.push(s) });
    return { code, out: out.join('\n'), err: err.join('\n') };
  };
  const tmp = () => mkdtempSync(join(tmpdir(), 'sloyka-check-'));

  it('prints file:line rule → advice and exits 1', () => {
    const r = run(['bad'], FIX);
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/native\.tsx:11 no-native-elements → /);
    expect(r.out).toMatch(/no-deep-imports → /);
  });

  it('exits 0 on a clean project', () => {
    const r = run(['good'], FIX);
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/нарушений нет/);
  });

  it('--json is machine readable', () => {
    const r = run(['bad', '--json'], FIX);
    const data = JSON.parse(r.out);
    expect(r.code).toBe(1);
    expect(data.violations.length).toBe(bad.violations.length);
    expect(data.violations[0]).toEqual(expect.objectContaining({ file: expect.any(String), line: expect.any(Number), rule: expect.any(String), message: expect.any(String) }));
    expect(data).toEqual(expect.objectContaining({ allowed: [], warnings: expect.any(Array) }));
  });

  it('skips node_modules, dist, build, .next, storybook-static; warns on .mdx', () => {
    const d = tmp();
    for (const dir of ['node_modules/x', 'dist', 'build', '.next', 'storybook-static', 'src'])
      mkdirSync(join(d, dir), { recursive: true });
    for (const dir of ['node_modules/x', 'dist', 'build', '.next', 'storybook-static'])
      writeFileSync(join(d, dir, 'a.jsx'), 'export const A = () => <button>x</button>;\n');
    writeFileSync(join(d, 'src/ok.jsx'), 'export const A = () => null;\n');
    writeFileSync(join(d, 'src/doc.mdx'), '# <button>\n');
    writeFileSync(join(d, 'src/picture.png'), 'x');
    const r = run(['.', '--json'], d);
    const data = JSON.parse(r.out);
    expect(r.code).toBe(0);
    expect(data.violations).toEqual([]);
    expect(data.files).toBe(1);
    expect(data.warnings.length).toBe(1);
    expect(data.warnings[0]).toMatch(/doc\.mdx/);
    rmSync(d, { recursive: true, force: true });
  });

  it('warns about unparsable files without failing', () => {
    const d = tmp();
    writeFileSync(join(d, 'broken.jsx'), 'const = <<<');
    const r = run(['.', '--json'], d);
    expect(r.code).toBe(0);
    expect(JSON.parse(r.out).warnings[0]).toMatch(/broken\.jsx/);
    rmSync(d, { recursive: true, force: true });
  });

  it('sloyka.allow.json removes a violation and prints it with the reason', () => {
    const d = tmp();
    mkdirSync(join(d, 'src/legacy'), { recursive: true });
    cpSync(join(FIX, 'bad/native.tsx'), join(d, 'src/legacy/native.tsx'));
    cpSync(join(FIX, 'bad/deep.css'), join(d, 'src/deep.css'));
    const before = JSON.parse(run(['.', '--json'], d).out).violations.length;
    expect(before).toBeGreaterThan(0);

    writeFileSync(join(d, 'sloyka.allow.json'), JSON.stringify({ ignore: [
      { path: 'src/legacy/**', rules: ['no-native-elements'], reason: 'старая страница, переедет в марте' },
      { path: 'src/*.css', reason: 'вендорные стили' },
    ] }));
    const text = run(['.'], d);
    expect(text.code).toBe(0);
    expect(text.out).toMatch(/src\/legacy\/native\.tsx:11 no-native-elements/);
    expect(text.out).toMatch(/старая страница, переедет в марте/);
    expect(text.out).toMatch(/вендорные стили/);

    const json = JSON.parse(run(['.', '--json'], d).out);
    expect(json.violations).toEqual([]);
    expect(json.allowed.length).toBe(before);
    expect(json.allowed[0]).toEqual(expect.objectContaining({ reason: expect.any(String), rule: expect.any(String), file: expect.any(String), line: expect.any(Number) }));

    // правило не из списка исключения: нарушение остаётся
    writeFileSync(join(d, 'sloyka.allow.json'), JSON.stringify({ ignore: [{ path: 'src/legacy/**', rules: ['no-deep-imports'], reason: 'другое' }, { path: 'src/*.css', reason: 'ок' }] }));
    const still = run(['.', '--json'], d);
    expect(still.code).toBe(1);
    expect(JSON.parse(still.out).violations.every(v => v.rule === 'no-native-elements')).toBe(true);
    rmSync(d, { recursive: true, force: true });
  });

  it('rejects a broken allow file with exit code 2', () => {
    const d = tmp();
    writeFileSync(join(d, 'a.jsx'), 'export const A = () => null;\n');
    for (const content of ['{', JSON.stringify({ ignore: [{ path: 'a.jsx' }] }), JSON.stringify({ ignore: [{ path: 'a.jsx', rules: ['nope'], reason: 'x' }] })]) {
      writeFileSync(join(d, 'sloyka.allow.json'), content);
      const r = run(['.'], d);
      expect(r.code, content).toBe(2);
      expect(r.err).toMatch(/sloyka\.allow\.json/);
    }
    rmSync(d, { recursive: true, force: true });
  });

  it('bin/sloyka-check.js works end to end', () => {
    const exec = dir => spawnSync(process.execPath, ['bin/sloyka-check.js', dir], { encoding: 'utf8' });
    const ok = exec('tests/check/fixtures/good');
    expect(ok.status, ok.stderr).toBe(0);
    const ko = exec('tests/check/fixtures/bad');
    expect(ko.status).toBe(1);
    expect(ko.stdout).toMatch(/no-native-elements → /);
  });
});
