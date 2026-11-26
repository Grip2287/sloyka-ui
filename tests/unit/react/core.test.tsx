import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { Fragment } from 'react';
import { defineMeta, pick, checkChildren, cx, resetWarnings } from '../../../src/react/core';
import { Icon } from '../../../src/react/icons';
import { SL_ICONS } from '../../../src/icons.js';

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => { resetWarnings(); warn = vi.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => warn.mockRestore());

describe('defineMeta', () => {
  it('вешает метку __sloyka и возвращает компонент', () => {
    const C = () => null;
    const meta = { n: '21', group: 'Модальное окно', name: 'Modal', allowed: 'any' as const, props: {} };
    expect(defineMeta(C, meta)).toBe(C);
    expect((C as any).__sloyka).toEqual(meta);
  });
});

describe('pick', () => {
  const opts = ['sm', 'md', 'lg'] as const;
  it('допустимое значение — как есть, без предупреждений', () => {
    expect(pick('Modal', 'size', 'lg', opts, 'md')).toBe('lg');
    expect(warn).not.toHaveBeenCalled();
  });
  it('undefined — fallback без предупреждения', () => {
    expect(pick('Modal', 'size', undefined, opts, 'md')).toBe('md');
    expect(warn).not.toHaveBeenCalled();
  });
  it('недопустимое — fallback и одно предупреждение на компонент+prop', () => {
    expect(pick('Modal', 'size', 'xl', opts, 'md')).toBe('md');
    pick('Modal', 'size', 'xl', opts, 'md');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith('Sloyka · Modal: size="xl" недопустимо, варианты: sm, md, lg');
    pick('Modal', 'tone', 'x', opts, 'md');
    pick('Card', 'size', 'xl', opts, 'md');
    expect(warn).toHaveBeenCalledTimes(3);
  });
});

describe('checkChildren', () => {
  const Ok: any = () => null; Ok.__sloyka = { name: 'Button' };
  const Bad: any = () => null; Bad.__sloyka = { name: 'Card' };
  const Plain = () => null;
  const Modal: any = () => null; Modal.__sloyka = { name: 'Modal', allowed: ['Button'] };
  const run = (children: unknown) => checkChildren(Modal, children as any);
  it('пропускает строки, числа, null, false, массивы, фрагменты, разрешённое и немеченое', () => {
    run(['a', 1, null, false, undefined]);
    run(<Fragment><Ok /><Plain /></Fragment>);
    run([<Ok key="1" />, [<Plain key="2" />]]);
    expect(warn).not.toHaveBeenCalled();
  });
  it('allowed any и none', () => {
    checkChildren({ __sloyka: { name: 'X', allowed: 'any' } } as any, <div />);
    expect(warn).not.toHaveBeenCalled();
    checkChildren({ __sloyka: { name: 'X', allowed: 'none' } } as any, <Ok />);
    expect(warn).toHaveBeenCalledTimes(1);
  });
  it('нативный тег — предупреждение со списком разрешённого', () => {
    run(<div />);
    expect(warn).toHaveBeenCalledWith('Sloyka · Modal: <div> недопустим внутри, разрешено: Button');
  });
  it('чужой компонент Sloyka — предупреждение, фрагмент проходится глубже', () => {
    run(<Fragment><Bad /></Fragment>);
    expect(warn).toHaveBeenCalledWith('Sloyka · Modal: <Card> недопустим внутри, разрешено: Button');
  });
  it('распознаёт объекты со статическими подкомпонентами', () => {
    const Obj: any = Object.assign(() => null, { Head: () => null, __sloyka: { name: 'Card' } });
    run(<Obj />);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe('cx', () => {
  it('склеивает истинные', () => expect(cx('a', false, null, undefined, 'b')).toBe('a b'));
});

describe('Icon', () => {
  it('рисует svg.sl-ic с путём и aria-hidden', () => {
    const { container } = render(<Icon name="search" />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('class')).toBe('sl-ic');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('viewBox')).toBe('0 0 16 16');
    expect(svg.querySelector('circle')).not.toBeNull();
    expect(svg.querySelector('path')!.getAttribute('d')).toBe('M10.5 10.5L14 14');
  });
  it('size 20', () => {
    const { container } = render(<Icon name="plus" size={20} />);
    expect(container.querySelector('svg')!.getAttribute('width')).toBe('20');
  });
  it('набор иконок совпадает с 0.1.x', async () => {
    const mod = await import('../../../src/react/icons');
    expect(mod.ICON_PATHS).toEqual(SL_ICONS);
  });
});
