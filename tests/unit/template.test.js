import { describe, it, expect, beforeEach } from 'vitest';
import { COMPONENTS, componentFromTitle, componentCSS, templateCSS, slugify, addComponent, addTheme, loadDraft } from '../../.storybook/template-store.js';
import { readdirSync } from 'node:fs';

describe('template store', () => {
  beforeEach(() => localStorage.clear());

  it('knows every component folder that has styles', () => {
    const folders = readdirSync('src/components').filter(d => !['theme', 'segmented', 'layout'].includes(d));
    for (const f of folders) expect(COMPONENTS[f], f).toBeTruthy();
  });

  it('maps story titles to components', () => {
    expect(componentFromTitle('Компоненты/01 · Кнопки')).toBe('button');
    expect(componentFromTitle('Компоненты/24 · Боковое меню: полное и рейл')).toBe('nav');
    expect(componentFromTitle('Каркас/Админка')).toBe('shell');
    expect(componentFromTitle('Основа/Токены')).toBe(null);
    expect(componentFromTitle('Референсы/Тёмная CRM/06 · Карточка объекта')).toBe('card');
  });

  it('component CSS: scale → zoom, radius → radius tokens, defaults → nothing', () => {
    expect(componentCSS('button', { scale: 100, radius: -1 })).toBe('');
    expect(componentCSS('button', { scale: 120, radius: -1 })).toBe('.sl-btn, .sl-btn-group { zoom: 1.2; }');
    expect(componentCSS('card', { scale: 100, radius: 12 })).toContain('--sl-r-sm: 12px; --sl-r-md: 15px; --sl-r-lg: 19px;');
  });

  it('template CSS lives in its own layer after the library', () => {
    addTheme({ accentLight: '#2563eb', radius: 9 });
    addComponent('button', 110, -1);
    const css = templateCSS(loadDraft(), 'Шаблон 1');
    expect(css).toContain('@layer sl.reset, sl.tokens, sl.base, sl.components, sl.template;');
    expect(css).toContain('--sl-inverse: #2563eb; --sl-on-inverse: #ffffff;');
    expect(css).toContain('--sl-r-sm: 9px;');
    expect(css).toContain('.sl-btn, .sl-btn-group { zoom: 1.1; }');
  });

  it('re-adding a component replaces its entry', () => {
    addComponent('button', 110, -1);
    addComponent('button', 90, 4);
    expect(loadDraft().components.button).toEqual({ scale: 90, radius: 4 });
  });

  it('slugify', () => {
    expect(slugify('Шаблон 1')).toBe('template-1');
    expect(slugify('template-2')).toBe('template-2');
    expect(slugify('Тёмная панель!')).toBe('temnaya-panel');
    expect(slugify('../../etc')).toBe('etc');
  });
});
