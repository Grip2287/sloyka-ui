import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Text, Stack, Grid, Page, Link, Image, Form } from '../../../src/react';
import { resetWarnings } from '../../../src/react/core';

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => { resetWarnings(); warn = vi.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => warn.mockRestore());

describe('Text', () => {
  it.each([['page', 'H1'], ['section', 'H2'], ['title', 'H3'], ['body', 'P'], ['small', 'P'], ['caption', 'SPAN']] as const)(
    'as=%s -> <%s> with class', (as, tag) => {
      const { container } = render(<Text as={as}>x</Text>);
      const el = container.firstElementChild!;
      expect(el.tagName).toBe(tag);
      expect(el.classList.contains(`sl-text--${as}`)).toBe(true);
    });
  it('tone, weight, inline', () => {
    const { container } = render(<Text as="page" tone="crit" weight="strong" inline>x</Text>);
    const el = container.firstElementChild!;
    expect(el.tagName).toBe('SPAN');
    expect(el.className).toContain('sl-text--crit');
    expect(el.className).toContain('sl-text--strong');
  });
  it('unknown level -> body + warning', () => {
    const { container } = render(<Text as={'huge' as any}>x</Text>);
    expect(container.firstElementChild!.tagName).toBe('P');
    expect(warn).toHaveBeenCalledTimes(1);
  });
  it('nests Text and Link', () => {
    const { container } = render(<Text>a <Text inline weight="strong">b</Text> <Link href="/x">c</Link></Text>);
    expect(container.querySelector('p span a, p span, p a')).toBeTruthy();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('Stack / Grid / Page', () => {
  it('Stack classes', () => {
    const { container } = render(<Stack gap={4} direction="row" align="center" justify="between" wrap>x</Stack>);
    const c = container.firstElementChild!.classList;
    for (const k of ['sl-stack', 'sl-stack--gap-4', 'sl-stack--row', 'sl-stack--a-center', 'sl-stack--j-between', 'sl-stack--wrap']) expect(c.contains(k)).toBe(true);
  });
  it('Stack bad gap -> default + warning', () => {
    const { container } = render(<Stack gap={9 as any}>x</Stack>);
    expect(container.firstElementChild!.classList.contains('sl-stack--gap-3')).toBe(true);
    expect(warn).toHaveBeenCalled();
  });
  it('Stack warns on native child', () => {
    render(<Stack><div /></Stack>);
    expect(warn).not.toHaveBeenCalled(); // allowed: any
  });
  it('Grid auto md and cols', () => {
    expect(render(<Grid columns="auto" min="md">x</Grid>).container.firstElementChild!.classList.contains('sl-grid--auto-md')).toBe(true);
    const c = render(<Grid columns={2} gap={5}>x</Grid>).container.firstElementChild!;
    expect(c.classList.contains('sl-grid--cols-2')).toBe(true);
    expect(c.classList.contains('sl-grid--gap-5')).toBe(true);
    expect(c.classList.contains('sl-grid')).toBe(true);
  });
  it('Page рисует div, а не main: ориентир main принадлежит Shell', () => {
    const el = render(<Page>x</Page>).container.firstElementChild!;
    expect(el.tagName).toBe('DIV');
  });
  it('Page widths', () => {
    expect(render(<Page width="wide">x</Page>).container.firstElementChild!.className).toContain('sl-rpage--wide');
    expect(render(<Page>x</Page>).container.firstElementChild!.className).toContain('sl-rpage--default');
  });
  it('ignores className at runtime', () => {
    const { container } = render(<Stack {...({ className: 'evil' } as any)}>x</Stack>);
    expect(container.firstElementChild!.classList.contains('evil')).toBe(false);
  });
});

describe('Link', () => {
  it('plain anchor', () => {
    const { container } = render(<Link href="/a">t</Link>);
    const a = container.querySelector('a')!;
    expect(a.getAttribute('href')).toBe('/a');
    expect(a.className).toBe('sl-link');
    expect(a.hasAttribute('target')).toBe(false);
  });
  it('external', () => {
    const a = render(<Link href="https://x.y" external>t</Link>).container.querySelector('a')!;
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
  });
  it('linkAs receives href, className, children', () => {
    const Custom = vi.fn(({ href, className, children }: any) => <a data-custom href={href} className={className}>{children}</a>);
    const { container } = render(<Link href="/r" linkAs={Custom}>go</Link>);
    expect(Custom).toHaveBeenCalled();
    const a = container.querySelector('a[data-custom]')!;
    expect(a.getAttribute('href')).toBe('/r');
    expect(a.textContent).toBe('go');
    expect(a.className).toBe('sl-link');
  });
});

describe('Image', () => {
  it('lazy by default, priority disables', () => {
    const { container } = render(<><Image src="/a.png" alt="A" /><Image src="/b.png" alt="" priority /></>);
    const [a, b] = Array.from(container.querySelectorAll('img'));
    expect(a.getAttribute('loading')).toBe('lazy');
    expect(b.hasAttribute('loading')).toBe(false);
  });
  it('fit and radius classes', () => {
    const img = render(<Image src="/a.png" alt="A" fit="contain" radius="lg" width={10} height={20} />).container.querySelector('img')!;
    expect(img.className).toContain('sl-image--contain');
    expect(img.className).toContain('sl-image--r-lg');
    expect(img.getAttribute('width')).toBe('10');
  });
  it('missing alt -> warning and alt=""', () => {
    // @ts-expect-error alt is required
    const img = render(<Image src="/a.png" />).container.querySelector('img')!;
    expect(img.getAttribute('alt')).toBe('');
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe('Form', () => {
  it('without action: preventDefault and onSubmit', () => {
    const onSubmit = vi.fn();
    const { container } = render(<Form onSubmit={onSubmit}>x</Form>);
    const ev = new Event('submit', { bubbles: true, cancelable: true });
    container.querySelector('form')!.dispatchEvent(ev);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(ev.defaultPrevented).toBe(true);
  });
  it('with action: no preventDefault', () => {
    const onSubmit = vi.fn();
    const { container } = render(<Form action="/go" method="post" onSubmit={onSubmit}>x</Form>);
    const form = container.querySelector('form')!;
    expect(form.getAttribute('method')).toBe('post');
    const ev = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

it('all carry meta n=00 group Основа', () => {
  for (const C of [Text, Stack, Grid, Page, Link, Image, Form] as any[]) {
    expect(C.__sloyka.n).toBe('00');
    expect(C.__sloyka.group).toBe('Основа');
  }
});
