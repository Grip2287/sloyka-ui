import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { diffManifests, renderNotes, storyId, writeToChangesets } from '../../scripts/release-notes.js';

const btn = (props, allowed = 'none') => ({ name: 'Button', n: '01', group: 'Кнопки', import: 'sloyka', allowed, props });
const manifest = (components, templates = []) => ({ name: 'sloyka', version: 'x', groups: [], components, templates });

const OLD = manifest({
  Button: btn({ variant: { type: 'enum', options: ['primary', 'default', 'huge'], default: 'default' }, size: { type: 'enum', options: ['sm', 'md'] } }),
  Chip: { name: 'Chip', n: '04', group: 'Теги и счётчики', allowed: 'none', props: {} },
}, ['old.css']);
const NEW = manifest({
  Button: btn({ variant: { type: 'enum', options: ['primary', 'default', 'ghost'], default: 'default' }, block: { type: 'boolean' } }),
  Metric: { name: 'Metric', n: '07', group: 'Карточка показателя', allowed: 'none', props: {} },
}, ['template-1.css']);
const SOURCES = { Button: 'src/react/components/button/Button.tsx', Metric: 'src/react/components/metric/Metric.tsx' };

describe('release notes', () => {
  const d = diffManifests(OLD, NEW, SOURCES);

  it('story id matches Storybook', () => {
    expect(storyId({ n: '22', group: 'Уведомления и подсказка' })).toBe('компоненты-22-·-уведомления-и-подсказка--default');
    expect(storyId({ n: '24', group: 'Боковое меню: полное и рейл' })).toBe('компоненты-24-·-боковое-меню-полное-и-рейл--default');
    expect(storyId({ n: '00', group: 'Основа' })).toBe(null);
  });

  it('added component → Добавлено with path, story and import', () => {
    const line = d.added.find(l => l.includes('Metric'));
    expect(line).toContain("import { Metric } from 'sloyka'");
    expect(line).toContain('src/react/components/metric/Metric.tsx');
    expect(line).toContain('компоненты-07-·-карточка-показателя--default');
    expect(d.added.some(l => l.includes('template-1.css'))).toBe(true);
  });

  it('added prop and value → Изменено', () => {
    expect(d.changed.some(l => l.includes('новый проп `block`'))).toBe(true);
    expect(d.changed.some(l => l.includes('новые значения `ghost`'))).toBe(true);
  });

  it('removed prop, value, component, template → Удалено and Нужно поправить', () => {
    expect(d.removed.some(l => l.includes('проп `size`'))).toBe(true);
    expect(d.fix.some(l => l.includes('уберите проп `size`') && l.includes('button/Button.tsx'))).toBe(true);
    expect(d.fix.some(l => l.includes('"huge"'))).toBe(true);
    expect(d.removed.some(l => l.includes('**Chip**'))).toBe(true);
    expect(d.fix.some(l => l.includes('**Chip** удалён'))).toBe(true);
    expect(d.fix.some(l => l.includes("templates/old.css"))).toBe(true);
  });

  it('renders all four sections; first release lists groups', () => {
    const md = renderNotes(OLD, NEW, SOURCES);
    for (const s of ['Добавлено', 'Изменено', 'Удалено', 'Нужно поправить в сайтах']) expect(md).toContain(`#### ${s}`);
    const first = renderNotes(null, { ...NEW, groups: [{ n: '01', title: 'Кнопки', components: ['Button'] }] });
    expect(first).toContain('Первый выпуск');
    expect(first).toContain('**01 · Кнопки:** Button');
  });

  it('writes into changesets idempotently', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cs-'));
    writeFileSync(join(dir, 'a.md'), "---\n'sloyka': major\n---\n\nReact 1.0\n");
    writeFileSync(join(dir, 'README.md'), 'readme');
    expect(writeToChangesets('<!-- release-notes:start -->\nA\n<!-- release-notes:end -->', dir)).toBe(1);
    writeToChangesets('<!-- release-notes:start -->\nB\n<!-- release-notes:end -->', dir);
    const text = readFileSync(join(dir, 'a.md'), 'utf8');
    expect(text).toContain('React 1.0');
    expect(text).toContain('\nB\n');
    expect(text).not.toContain('\nA\n');
    expect(readFileSync(join(dir, 'README.md'), 'utf8')).toBe('readme');
  });
});
