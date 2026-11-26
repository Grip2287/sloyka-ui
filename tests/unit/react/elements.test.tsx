import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useState } from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Icon, Button, ButtonGroup, Field, Search, Select, Textarea, Compose,
  Segmented, Switch, Checkbox, Radio, RadioGroup, Tag, Count, Chip, Status, StatusPill,
} from '../../../src/react';
import { resetWarnings } from '../../../src/react/core';

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => { resetWarnings(); warn = vi.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => { cleanup(); warn.mockRestore(); });

/** `<i data-ic="x"></i>` из историй 0.1.x -> svg-иконка React-версии. */
const withIcons = (html: string) =>
  html.replace(/<i data-ic="([\w-]+)"><\/i>/g, (_, n) => renderToStaticMarkup(<Icon name={n as never} />));

/** Нормализация: пробелы, порядок атрибутов, пустые булевы атрибуты; необязательно — убрать атрибуты. */
function norm(html: string, drop: string[] = []): string {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  const walk = (n: Node): string => {
    if (n.nodeType === 3) return (n.textContent ?? '').replace(/\s+/g, ' ');
    if (n.nodeType !== 1) return '';
    const el = n as Element;
    const attrs = [...el.attributes].filter((a) => !drop.includes(a.name))
      .map((a) => `${a.name}="${a.name === 'class' ? a.value.split(/\s+/).sort().join(' ') : a.value}"`).sort().join(' ');
    const tag = el.tagName.toLowerCase();
    return `<${tag}${attrs ? ' ' + attrs : ''}>${[...el.childNodes].map(walk).join('')}</${tag}>`;
  };
  return [...t.content.childNodes].map(walk).join('').replace(/> </g, '><').trim();
}
const DROP = ['id', 'aria-describedby', 'aria-labelledby'];
const same = (container: HTMLElement, expected: string, drop: string[] = DROP) =>
  expect(norm(container.innerHTML, drop)).toBe(norm(withIcons(expected), drop));

/*
 * Принятые отклонения разметки от историй 0.1.x (решение контроллера, так задумано):
 *  - Switch: у input добавлен role="switch" (скринридер объявляет тумблер, а не флажок).
 *  - Search и Compose: у input есть aria-label по умолчанию ("Поиск" / "Сообщение"): в 0.1.x имя было только у placeholder.
 *  - Compose: у кнопки отправки type="button", чтобы не отправлять внешнюю форму; отправку делает onSend.
 *  - Segmented: хост div[role="group"] вместо кастомного <sl-segmented> (React не регистрирует элемент); кнопки с type="button",
 *    aria-pressed всегда true/false и roving tabindex (0 у выбранной, -1 у остальных); CSS работает по классам и не меняется.
 *  - Field: aria-labelledby/aria-describedby и id связывают подпись, пояснение и ошибку; в сравнении они отбрасываются (DROP).
 */
describe('Button', () => {
  it('parity: primary + icon', () => {
    same(render(<Button variant="primary" icon="plus">Добавить устройство</Button>).container,
      '<button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>Добавить устройство</button>');
  });
  it('parity: caps lg; sm; disabled; default', () => {
    same(render(<Button variant="primary" caps size="lg">Войти</Button>).container,
      '<button class="sl-btn sl-btn--primary sl-btn--caps sl-btn--lg">Войти</button>');
    same(render(<Button size="sm">Скачать архив</Button>).container, '<button class="sl-btn sl-btn--sm">Скачать архив</button>');
    same(render(<Button disabled>Обновить</Button>).container, '<button class="sl-btn" disabled>Обновить</button>');
  });
  it('parity: iconOnly danger', () => {
    same(render(<Button iconOnly variant="danger" icon="power" aria-label="Выйти" />).container,
      '<button class="sl-btn sl-btn--icon sl-btn--danger" aria-label="Выйти"><i data-ic="power"></i></button>');
  });
  it('block and onClick', () => {
    const on = vi.fn();
    const { container } = render(<Button block onClick={on}>Ok</Button>);
    expect(container.firstElementChild!.classList.contains('sl-btn--block')).toBe(true);
    fireEvent.click(screen.getByText('Ok'));
    expect(on).toHaveBeenCalledTimes(1);
  });
  it('busy -> aria-busy + disabled, no click', () => {
    const on = vi.fn();
    render(<Button busy onClick={on}>Ok</Button>);
    const b = screen.getByRole('button') as HTMLButtonElement;
    expect(b.getAttribute('aria-busy')).toBe('true');
    expect(b.disabled).toBe(true);
    fireEvent.click(b);
    expect(on).not.toHaveBeenCalled();
  });
  it('iconOnly without aria-label warns', () => {
    // @ts-expect-error iconOnly требует aria-label
    render(<Button iconOnly icon="x" />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain('Sloyka · Button');
  });
  it('iconOnly with children is a type error and children are not rendered', () => {
    // @ts-expect-error у iconOnly нет children
    const { container } = render(<Button iconOnly icon="x" aria-label="Закрыть">Текст</Button>);
    expect(container.textContent).toBe('');
  });
  it.each([['disabled', { disabled: true }], ['busy', { busy: true }]] as const)('%s link is inert: no href, not focusable', (_n, p) => {
    const { container } = render(<Button href="/x" variant="primary" {...p}>Go</Button>);
    const a = container.querySelector('a')!;
    expect(a.hasAttribute('href')).toBe(false);
    expect(a.getAttribute('tabindex')).toBe('-1');
    expect(a.getAttribute('role')).toBe('link');
    expect(a.getAttribute('aria-disabled')).toBe('true');
    expect(a.className).toBe('sl-btn sl-btn--primary');
  });
  it('href renders a link without <button>, keeps classes', () => {
    const { container } = render(<Button href="/x" variant="primary" icon="plus">Go</Button>);
    expect(container.querySelector('button')).toBeNull();
    const a = container.querySelector('a')!;
    expect(a.getAttribute('href')).toBe('/x');
    expect(a.className).toBe('sl-btn sl-btn--primary');
  });
  it('href + linkAs + external', () => {
    const L = ({ href, className, children, ...r }: any) => <a data-router href={href} className={className} {...r}>{children}</a>;
    const { container } = render(<Button href="/x" linkAs={L} external>Go</Button>);
    const a = container.querySelector('a')!;
    expect(a.hasAttribute('data-router')).toBe(true);
    expect(a.getAttribute('target')).toBe('_blank');
  });
  it('bad variant -> default + warning', () => {
    const { container } = render(<Button variant={'neon' as any}>x</Button>);
    expect(container.firstElementChild!.className).toBe('sl-btn');
    expect(warn).toHaveBeenCalled();
  });
  it('className is not accepted', () => {
    // @ts-expect-error className не входит в props
    const { container } = render(<Button className="evil" style={{ color: 'red' }}>x</Button>);
    const el = container.firstElementChild!;
    expect(el.className).toBe('sl-btn');
    expect(el.hasAttribute('style')).toBe(false);
  });
  it('ButtonGroup parity and direction', () => {
    same(render(<ButtonGroup><Button iconOnly icon="plus" aria-label="Приблизить" /><Button iconOnly icon="minus" aria-label="Отдалить" /></ButtonGroup>).container,
      '<div class="sl-btn-group"><button class="sl-btn sl-btn--icon" aria-label="Приблизить"><i data-ic="plus"></i></button><button class="sl-btn sl-btn--icon" aria-label="Отдалить"><i data-ic="minus"></i></button></div>');
    const { container } = render(<ButtonGroup direction="row"><Button>a</Button></ButtonGroup>);
    expect(container.firstElementChild!.className).toBe('sl-btn-group sl-btn-group--row');
  });
  it('ButtonGroup rejects native children', () => {
    render(<ButtonGroup><div /></ButtonGroup>);
    expect(warn).toHaveBeenCalled();
  });
});

describe('Field family', () => {
  it('parity: Field with placeholder', () => {
    same(render(<Field label="Имя пользователя" placeholder="Введите логин" />).container,
      '<label class="sl-field"><span class="sl-label">Имя пользователя</span><input class="sl-input" placeholder="Введите логин"></label>');
  });
  it('parity: Field with error + password', () => {
    same(render(<Field label="Пароль" type="password" defaultValue="12345" error="Неверный пароль" />).container,
      '<label class="sl-field"><span class="sl-label">Пароль</span><input class="sl-input" type="password" value="12345" aria-invalid="true"><span class="sl-error">Неверный пароль</span></label>');
  });
  it('error sets aria-invalid and aria-describedby pointing at hint and error', () => {
    const { container } = render(<Field label="Пароль" hint="Подсказка" error="Неверный пароль" />);
    const input = container.querySelector('input')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const ids = input.getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(2);
    const texts = ids.map((i) => container.ownerDocument.getElementById(i)!.textContent);
    expect(texts).toEqual(['Подсказка', 'Неверный пароль']);
  });
  it('no error -> no aria-invalid', () => {
    const { container } = render(<Field label="x" hint="h" />);
    expect(container.querySelector('input')!.hasAttribute('aria-invalid')).toBe(false);
    expect(container.querySelector('input')!.getAttribute('aria-describedby')).toBeTruthy();
  });
  it('label is associated with the input', () => {
    render(<Field label="Имя" />);
    expect(screen.getByLabelText('Имя').tagName).toBe('INPUT');
  });
  it('whitelisted attributes reach the input', () => {
    const { container } = render(<Field label="x" name="n" type="email" required disabled autoComplete="email" inputMode="email" />);
    const i = container.querySelector('input')!;
    expect(i.name).toBe('n'); expect(i.type).toBe('email'); expect(i.required).toBe(true);
    expect(i.disabled).toBe(true); expect(i.getAttribute('autocomplete')).toBe('email'); expect(i.getAttribute('inputmode')).toBe('email');
  });
  it('onChange gets the string value and the event (uncontrolled)', () => {
    const on = vi.fn();
    const { container } = render(<Field label="x" defaultValue="a" onChange={on} />);
    const i = container.querySelector('input')!;
    fireEvent.change(i, { target: { value: 'abc' } });
    expect(on).toHaveBeenCalledTimes(1);
    expect(on.mock.calls[0][0]).toBe('abc');
    expect(on.mock.calls[0][1].target).toBe(i);
  });
  it('controlled follows value', () => {
    function C() { const [v, setV] = useState('a'); return <><Field label="x" value={v} onChange={setV} /><output>{v}</output></>; }
    const { container } = render(<C />);
    fireEvent.change(container.querySelector('input')!, { target: { value: 'zz' } });
    expect(container.querySelector('output')!.textContent).toBe('zz');
    expect(container.querySelector('input')!.value).toBe('zz');
  });
  it('bad type -> text + warning', () => {
    const { container } = render(<Field label="x" type={'date' as any} />);
    expect(container.querySelector('input')!.hasAttribute('type')).toBe(false);
    expect(warn).toHaveBeenCalled();
  });
  it('className rejected', () => {
    // @ts-expect-error className не входит в props
    const { container } = render(<Field label="x" className="evil" />);
    expect(container.innerHTML).not.toContain('evil');
  });
  it('parity: Search', () => {
    same(render(<Search placeholder="Поиск устройства…" />).container,
      '<label class="sl-search"><i data-ic="search"></i><input class="sl-input" placeholder="Поиск устройства…" aria-label="Поиск"></label>');
  });
  it('Search onChange gets string', () => {
    const on = vi.fn();
    render(<Search onChange={on} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'q' } });
    expect(on.mock.calls[0][0]).toBe('q');
  });
  it('parity: Select with aria-label', () => {
    same(render(<Select aria-label="Все статусы" options={[{ value: 'all', label: 'Все статусы' }, { value: 'on', label: 'На связи' }]} />).container,
      '<select class="sl-select" aria-label="Все статусы"><option value="all">Все статусы</option><option value="on">На связи</option></select>');
  });
  it('Select with label, onChange gets value, error flags', () => {
    const on = vi.fn();
    const { container } = render(<Select label="Статус" error="Нужно" onChange={on} options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />);
    expect(container.querySelector('label.sl-field span.sl-label')!.textContent).toBe('Статус');
    const s = container.querySelector('select')!;
    expect(s.getAttribute('aria-invalid')).toBe('true');
    fireEvent.change(s, { target: { value: 'b' } });
    expect(on.mock.calls[0][0]).toBe('b');
  });
  it('parity: Textarea with hint', () => {
    same(render(<Textarea label="Текст оповещения" defaultValue="Внимание." hint="До 500 символов" />).container,
      '<label class="sl-field"><span class="sl-label">Текст оповещения</span><textarea class="sl-textarea">Внимание.</textarea><span class="sl-hint">До 500 символов</span></label>');
  });
  it('Textarea onChange gets string and invalid on error', () => {
    const on = vi.fn();
    const { container } = render(<Textarea label="t" error="e" onChange={on} />);
    const t = container.querySelector('textarea')!;
    expect(t.getAttribute('aria-invalid')).toBe('true');
    fireEvent.change(t, { target: { value: 'hi' } });
    expect(on.mock.calls[0][0]).toBe('hi');
  });
  it('parity: Compose', () => {
    same(render(<Compose placeholder="Сообщение…" onSend={() => {}} />).container,
      '<div class="sl-compose"><input class="sl-input" placeholder="Сообщение…" aria-label="Сообщение"><button class="sl-btn sl-btn--icon sl-btn--primary" type="button" aria-label="Отправить"><i data-ic="arrow-right"></i></button></div>', [...DROP, 'value']);
  });
  it('Compose sends on click and Enter, clears when uncontrolled', () => {
    const on = vi.fn();
    const { container } = render(<Compose onSend={on} />);
    const i = container.querySelector('input')!;
    fireEvent.change(i, { target: { value: 'привет' } });
    fireEvent.click(screen.getByLabelText('Отправить'));
    expect(on).toHaveBeenLastCalledWith('привет');
    expect(i.value).toBe('');
    fireEvent.change(i, { target: { value: 'два' } });
    fireEvent.keyDown(i, { key: 'Enter' });
    expect(on).toHaveBeenLastCalledWith('два');
    fireEvent.keyDown(i, { key: 'Enter' }); // пусто — не шлём
    expect(on).toHaveBeenCalledTimes(2);
  });
  it('Compose controlled does not clear itself', () => {
    const on = vi.fn();
    const { container } = render(<Compose value="abc" onChange={() => {}} onSend={on} />);
    fireEvent.click(screen.getByLabelText('Отправить'));
    expect(on).toHaveBeenCalledWith('abc');
    expect(container.querySelector('input')!.value).toBe('abc');
  });
});

describe('Segmented', () => {
  const opts = [{ value: 'a', label: 'Без зон' }, { value: 'b', label: 'Рабочий' }, { value: 'c', label: 'Всё' }];
  it('parity: block, third pressed', () => {
    same(render(<Segmented block options={opts} defaultValue="c" />).container,
      '<div class="sl-segmented sl-segmented--block" role="group"><button type="button" aria-pressed="false" tabindex="-1">Без зон</button><button type="button" aria-pressed="false" tabindex="-1">Рабочий</button><button type="button" aria-pressed="true" tabindex="0">Всё</button></div>');
  });
  it('first option is selected by default', () => {
    render(<Segmented options={opts} />);
    expect(screen.getByText('Без зон').getAttribute('aria-pressed')).toBe('true');
  });
  it('click selects and calls onChange with the value', () => {
    const on = vi.fn();
    render(<Segmented options={opts} onChange={on} />);
    fireEvent.click(screen.getByText('Рабочий'));
    expect(on).toHaveBeenCalledWith('b');
    expect(screen.getByText('Рабочий').getAttribute('aria-pressed')).toBe('true');
  });
  it('arrows move focus + selection, wrap around', () => {
    const on = vi.fn();
    render(<Segmented options={opts} defaultValue="a" onChange={on} />);
    fireEvent.keyDown(screen.getByText('Без зон'), { key: 'ArrowRight' });
    expect(on).toHaveBeenLastCalledWith('b');
    expect(document.activeElement).toBe(screen.getByText('Рабочий'));
    fireEvent.keyDown(screen.getByText('Рабочий'), { key: 'ArrowLeft' });
    fireEvent.keyDown(screen.getByText('Без зон'), { key: 'ArrowLeft' });
    expect(on).toHaveBeenLastCalledWith('c');
    expect(screen.getByText('Всё').getAttribute('aria-pressed')).toBe('true');
  });
  it('controlled: value rules, no internal change', () => {
    const on = vi.fn();
    render(<Segmented options={opts} value="a" onChange={on} />);
    fireEvent.click(screen.getByText('Всё'));
    expect(on).toHaveBeenCalledWith('c');
    expect(screen.getByText('Без зон').getAttribute('aria-pressed')).toBe('true');
  });
});

describe('Switch / Checkbox / Radio', () => {
  it('parity: Switch checked', () => {
    same(render(<Switch defaultChecked>Зоны охраны</Switch>).container,
      '<label class="sl-switch"><input type="checkbox" role="switch" checked>Зоны охраны</label>');
  });
  it('parity: Checkbox', () => {
    same(render(<Checkbox defaultChecked>Запомнить</Checkbox>).container,
      '<label class="sl-check"><input type="checkbox" checked>Запомнить</label>');
  });
  it('parity: Radio', () => {
    same(render(<Radio name="r" value="x" defaultChecked>По приборам</Radio>).container,
      '<label class="sl-check"><input type="radio" name="r" value="x" checked>По приборам</label>');
  });
  it.each([['Switch', Switch], ['Checkbox', Checkbox]] as const)('%s uncontrolled toggles and reports boolean', (_n, C) => {
    const on = vi.fn();
    render(<C onChange={on}>x</C>);
    const i = screen.getByLabelText('x') as HTMLInputElement;
    fireEvent.click(i);
    expect(on).toHaveBeenLastCalledWith(true);
    expect(i.checked).toBe(true);
    fireEvent.click(i);
    expect(on).toHaveBeenLastCalledWith(false);
  });
  it('Switch controlled', () => {
    const on = vi.fn();
    render(<Switch checked={false} onChange={on}>x</Switch>);
    const i = screen.getByLabelText('x') as HTMLInputElement;
    fireEvent.click(i);
    expect(on).toHaveBeenCalledWith(true);
    expect(i.checked).toBe(false);
  });
  it('Radio standalone reports boolean', () => {
    const on = vi.fn();
    render(<Radio name="q" value="1" onChange={on}>a</Radio>);
    fireEvent.click(screen.getByLabelText('a'));
    expect(on).toHaveBeenCalledWith(true);
  });
  it('RadioGroup: one selected, onChange gets value', () => {
    const on = vi.fn();
    const { container } = render(
      <RadioGroup aria-label="Режим" defaultValue="a" onChange={on}>
        <Radio value="a">A</Radio><Radio value="b">B</Radio>
      </RadioGroup>);
    expect(container.firstElementChild!.getAttribute('role')).toBe('radiogroup');
    expect((screen.getByLabelText('A') as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByLabelText('B'));
    expect(on).toHaveBeenCalledWith('b');
    expect((screen.getByLabelText('B') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('A') as HTMLInputElement).checked).toBe(false);
    const names = [...container.querySelectorAll('input')].map((i) => i.name);
    expect(new Set(names).size).toBe(1);
    expect(names[0]).not.toBe('');
  });
  it('RadioGroup controlled', () => {
    render(<RadioGroup value="a" onChange={() => {}}><Radio value="a">A</Radio><Radio value="b">B</Radio></RadioGroup>);
    fireEvent.click(screen.getByLabelText('B'));
    expect((screen.getByLabelText('A') as HTMLInputElement).checked).toBe(true);
  });
  it('className rejected', () => {
    // @ts-expect-error className не входит в props
    const { container } = render(<Switch className="evil">x</Switch>);
    expect(container.innerHTML).not.toContain('evil');
  });
});

describe('Tag / Count / Chip', () => {
  it('parity: tags', () => {
    same(render(<Tag>Администратор</Tag>).container, '<span class="sl-tag">Администратор</span>');
    same(render(<Tag tone="solid">Центр</Tag>).container, '<span class="sl-tag sl-tag--solid">Центр</span>');
    same(render(<Tag tone="crit">Удаление</Tag>).container, '<span class="sl-tag sl-tag--crit">Удаление</span>');
  });
  it('bad tone -> default + warning', () => {
    same(render(<Tag tone={'pink' as any}>x</Tag>).container, '<span class="sl-tag">x</span>');
    expect(warn).toHaveBeenCalled();
  });
  it('parity: Count', () => {
    same(render(<Count>6</Count>).container, '<span class="sl-count">6</span>');
    same(render(<Count solid>{4}</Count>).container, '<span class="sl-count sl-count--solid">4</span>');
  });
  it('parity: Chip with count and with icon', () => {
    same(render(<Chip count={1}>На линии</Chip>).container, '<span class="sl-chip">На линии <span class="sl-count">1</span></span>');
    same(render(<Chip icon="bell">Голосовое оповещение</Chip>).container, '<span class="sl-chip"><i data-ic="bell"></i>Голосовое оповещение</span>');
  });
});

describe('Status / StatusPill', () => {
  it.each([
    ['ok', 'sl-status sl-status--ok'], ['warn', 'sl-status sl-status--warn'], ['crit', 'sl-status sl-status--crit'],
    ['off', 'sl-status'], ['hollow', 'sl-status sl-status--hollow'],
  ] as const)('parity tone %s', (tone, cls) => {
    same(render(<Status tone={tone}>Текст</Status>).container, `<span class="${cls}">Текст</span>`);
  });
  it('parity: note and plain', () => {
    same(render(<Status tone="hollow" note="Нет связи">Офлайн</Status>).container,
      '<span class="sl-status sl-status--hollow">Офлайн <span class="sl-status__note">· Нет связи</span></span>');
    same(render(<Status tone="ok" plain>Работает</Status>).container, '<span class="sl-status sl-status--ok sl-status--plain">Работает</span>');
  });
  it('default tone is off', () => {
    same(render(<Status>Отключён</Status>).container, '<span class="sl-status">Отключён</span>');
  });
  it('parity: StatusPill', () => {
    same(render(<StatusPill tone="ok">В норме</StatusPill>).container,
      '<span class="sl-pill"><span class="sl-status sl-status--ok">В норме</span></span>');
  });
});

describe('meta', () => {
  it('numbers and groups', () => {
    const m = (c: unknown) => (c as { __sloyka: { n: string; group: string; name: string } }).__sloyka;
    const table: Array<[unknown, string, string, string]> = [
      [Button, '01', 'Кнопки', 'Button'], [ButtonGroup, '01', 'Кнопки', 'ButtonGroup'],
      [Field, '02', 'Поля ввода', 'Field'], [Search, '02', 'Поля ввода', 'Search'], [Select, '02', 'Поля ввода', 'Select'],
      [Textarea, '02', 'Поля ввода', 'Textarea'], [Compose, '02', 'Поля ввода', 'Compose'],
      [Segmented, '03', 'Переключатели', 'Segmented'], [Switch, '03', 'Переключатели', 'Switch'], [Checkbox, '03', 'Переключатели', 'Checkbox'],
      [Radio, '03', 'Переключатели', 'Radio'], [RadioGroup, '03', 'Переключатели', 'RadioGroup'],
      [Tag, '04', 'Теги и счётчики', 'Tag'], [Count, '04', 'Теги и счётчики', 'Count'], [Chip, '04', 'Теги и счётчики', 'Chip'],
      [Status, '05', 'Статусы', 'Status'], [StatusPill, '05', 'Статусы', 'StatusPill'],
    ];
    for (const [c, n, group, name] of table) expect(m(c)).toMatchObject({ n, group, name });
  });
});
