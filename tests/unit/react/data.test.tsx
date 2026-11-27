import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Icon, Button, Tag, Status, Text, Field, Card, KeyValue, Metric, LinkCard, Steps, Banner, Stats,
  List, Group, Row, Disclosure, Table, Empty, Dropzone,
} from '../../../src/react';
import { resetWarnings } from '../../../src/react/core';
import { IconSvg } from '../../../src/react/icons';

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => { resetWarnings(); warn = vi.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => { cleanup(); warn.mockRestore(); });

/** `<i data-ic="x"></i>` из историй 0.1.x -> svg-иконка React-версии. */
const withIcons = (html: string) =>
  html.replace(/<i data-ic="([\w-]+)"( class="sl-ic--lg")?><\/i>/g, (_, n, lg) => renderToStaticMarkup(lg ? <IconSvg name={n as never} variant="lg" /> : <Icon name={n as never} />));

function norm(html: string, drop: string[] = []): string {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  const walk = (n: Node): string => {
    if (n.nodeType === 3) return (n.textContent ?? '').replace(/\s+/g, ' ');
    if (n.nodeType !== 1) return '';
    const el = n as Element;
    const attrs = [...el.attributes].filter((a) => !drop.includes(a.name))
      .map((a) => `${a.name}="${a.name === 'class' ? a.value.split(/\s+/).sort().join(' ') : a.value.replace(/\s+/g, '').replace(/;$/, '')}"`).sort().join(' ');
    const tag = el.tagName.toLowerCase();
    return `<${tag}${attrs ? ' ' + attrs : ''}>${[...el.childNodes].map(walk).join('')}</${tag}>`;
  };
  return [...t.content.childNodes].map(walk).join('').replace(/> </g, '><').trim();
}
const same = (container: HTMLElement, expected: string, drop: string[] = []) =>
  expect(norm(container.innerHTML, drop)).toBe(norm(withIcons(expected), drop));

/*
 * Принятые отклонения разметки от историй 0.1.x (решение контроллера, так задумано):
 *  - Card.Head с icon: вместо inline-стиля flex — класс .sl-card__who (layout.css).
 *  - KeyValue: приглушённое значение (class="sl-muted" на dd) делается текстом Text tone="muted" внутри dd.
 *  - Metric: полоса получает role="progressbar" и aria-valuenow/min/max/label (в 0.1.x была немая); значение форматируется
 *    по-русски («5,3%»); ширина полосы округляется до целого.
 *  - Banner: role="status" (ok, warn) и role="alert" (crit); текстовый ребёнок оборачивается в .sl-banner__text.
 *  - Group: <div class="sl-group"> вместо кастомного <sl-group> (React не регистрирует элемент); у кнопки type="button";
 *    счётчик закрашен только у раскрытой группы (как в истории).
 *  - List: без обёртки .panel — это декорация истории, не части компонента.
 *  - Row: с onClick — role="button", tabindex=0, Enter/Space; с href — ссылка с классом sl-row.
 *  - Table: у кликабельной строки tabindex=0 и класс sl-table__row--click; align/width — новые классы в layout.css.
 *  - Empty/Dropzone: Dropzone = Empty с .sl-dropzone (в 0.1.x один набор классов).
 */
const DROP = [] as string[];

describe('Card', () => {
  it('parity: head + kv + foot with accent and interactive', () => {
    const { container } = render(
      <Card accent="ok" interactive>
        <Card.Head title="Камера КПП-1" subtitle="Видео · Модель V-200" aside={<Tag>2 устройства</Tag>} />
        <KeyValue items={[['Адрес', '10.20.6.88:18080'], ['На карте', 'размещена'], ['Последний ответ', '10:33']]} />
        <Card.Foot><Status tone="ok">На связи</Status></Card.Foot>
      </Card>,
    );
    same(container, `<article class="sl-card sl-card--interactive" data-accent="ok">
      <div class="sl-card__head"><div><div class="sl-card__title">Камера КПП-1</div><div class="sl-card__sub">Видео · Модель V-200</div></div><span class="sl-tag">2 устройства</span></div>
      <dl class="sl-kv"><dt>Адрес</dt><dd>10.20.6.88:18080</dd><dt>На карте</dt><dd>размещена</dd><dt>Последний ответ</dt><dd>10:33</dd></dl>
      <div class="sl-card__foot"><span class="sl-status sl-status--ok">На связи</span></div>
    </article>`, DROP);
  });
  it('parity: without accent, foot with button', () => {
    const { container } = render(
      <Card>
        <Card.Head title="Шлюз-04" />
        <Card.Foot><Status tone="crit">Нет связи</Status><Button size="sm" variant="ghost">Подробнее</Button></Card.Foot>
      </Card>,
    );
    same(container, `<article class="sl-card">
      <div class="sl-card__head"><div><div class="sl-card__title">Шлюз-04</div></div></div>
      <div class="sl-card__foot"><span class="sl-status sl-status--crit">Нет связи</span><button class="sl-btn sl-btn--sm sl-btn--ghost">Подробнее</button></div>
    </article>`, DROP);
  });
  it('Card.Head icon renders avatar', () => {
    const { container } = render(<Card><Card.Head title="ivanov" icon="shield" /></Card>);
    expect(container.querySelector('.sl-card__who .sl-avatar svg')).not.toBeNull();
  });
  it('href renders whole card as interactive link', () => {
    const { container } = render(<Card href="/x" accent="warn"><Card.Head title="A" /></Card>);
    const a = container.querySelector('a')!;
    expect(a.getAttribute('href')).toBe('/x');
    expect(a.className).toBe('sl-card sl-card--interactive');
    expect(a.getAttribute('data-accent')).toBe('warn');
  });
  it('href uses linkAs', () => {
    const MyLink = ({ href, className, children }: { href: string; className?: string; children?: React.ReactNode }) =>
      <a data-router="1" href={href} className={className}>{children}</a>;
    const { container } = render(<Card href="/x" linkAs={MyLink}><Card.Head title="A" /></Card>);
    expect(container.querySelector('a[data-router]')).not.toBeNull();
  });
  it('unknown accent warns', () => {
    render(<Card accent={'nope' as never}><Card.Head title="A" /></Card>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Sloyka · Card'));
  });
  it('allowed: Field passes, <div> warns', () => {
    render(<Card><Field label="Имя" /></Card>);
    expect(warn).not.toHaveBeenCalled();
    render(<Card><div>x</div></Card>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Sloyka · Card: <div> недопустим'));
  });
  it('Card.Foot warns for a Card inside', () => {
    render(<Card.Foot><Card>x</Card></Card.Foot>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Card.Foot'));
  });
  it('meta names/groups', () => {
    expect(Card.__sloyka).toMatchObject({ n: '06', group: 'Карточка объекта', name: 'Card' });
    expect(Card.Head.__sloyka.name).toBe('Card.Head');
    expect(Card.Foot.__sloyka.name).toBe('Card.Foot');
    expect(KeyValue.__sloyka).toMatchObject({ n: '06', name: 'KeyValue' });
  });
  it('KeyValue accepts components as values', () => {
    const { container } = render(<KeyValue items={[['Статус', <Status tone="ok" key="s">Ок</Status>], ['Заметка', <Text inline tone="muted" key="t">нет</Text>]]} />);
    expect(container.querySelectorAll('dd')).toHaveLength(2);
    expect(container.querySelector('dd .sl-status--ok')).not.toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('Metric', () => {
  const html = (v: number) => render(<Metric label="Память" value={v} note="Доступно 3,4 из 15,7 ГБ" />).container;
  it('parity: warn level (Playground)', () => {
    same(html(78), `<div class="sl-card"><span class="sl-caps">Память</span><div class="sl-card__head"><span class="sl-metric__value">78%</span><span class="sl-status sl-status--plain sl-status--warn">Повышенная</span></div><div class="sl-progress sl-progress--warn" role="progressbar" aria-label="Память" aria-valuemin="0" aria-valuemax="100" aria-valuenow="78"><span style="width:78%"></span></div><span class="sl-hint">Доступно 3,4 из 15,7 ГБ</span></div>`);
  });
  it('levels: <70 moderate, >=70 warn, >=90 crit', () => {
    expect(html(69).textContent).toContain('Умеренная');
    expect(html(69).querySelector('.sl-progress--warn,.sl-progress--crit')).toBeNull();
    cleanup();
    expect(html(70).textContent).toContain('Повышенная');
    cleanup();
    const c = html(90);
    expect(c.textContent).toContain('Критическая');
    expect(c.querySelector('.sl-status--crit.sl-status--plain')).not.toBeNull();
    expect(c.querySelector('.sl-progress--crit')).not.toBeNull();
  });
  it('formats decimals in Russian and clamps the bar', () => {
    const c = render(<Metric label="Процессор" value={5.3} unit="%" />).container;
    expect(c.querySelector('.sl-metric__value')!.textContent).toBe('5,3%');
    cleanup();
    const d = render(<Metric label="X" value={140} />).container;
    expect((d.querySelector('.sl-progress span') as HTMLElement).style.width).toBe('100%');
  });
});

describe('LinkCard and Steps', () => {
  it('parity: link card', () => {
    const { container } = render(<LinkCard icon="bell" title="Работа с тревогой" text="Принять, выполнить план, снять, оповестить." href="#" />);
    same(container, `<a class="sl-card sl-card--interactive sl-link-card" href="#"><i data-ic="bell" class="sl-ic--lg"></i><div><div class="sl-card__title">Работа с тревогой</div><div class="sl-card__sub">Принять, выполнить план, снять, оповестить.</div></div><i data-ic="chevron-right"></i></a>`);
  });
  it('linkAs is used', () => {
    const MyLink = ({ href, className, children }: { href: string; className?: string; children?: React.ReactNode }) =>
      <a data-router="1" href={href} className={className}>{children}</a>;
    const { container } = render(<LinkCard icon="users" title="t" text="x" href="/u" linkAs={MyLink} />);
    expect(container.querySelector('a[data-router]')!.getAttribute('href')).toBe('/u');
  });
  it('parity: steps', () => {
    const { container } = render(<Steps items={[{ title: 'Пользователи', text: 'Заведите операторов' }, { title: 'Карта объекта', text: 'Загрузите карту' }]} />);
    same(container, `<div class="sl-steps">
      <div class="sl-card sl-step"><span class="sl-step__num">1</span><div class="sl-card__title">Пользователи</div><div class="sl-card__sub">Заведите операторов</div></div>
      <div class="sl-card sl-step"><span class="sl-step__num">2</span><div class="sl-card__title">Карта объекта</div><div class="sl-card__sub">Загрузите карту</div></div>
    </div>`);
  });
  it('meta', () => {
    expect(LinkCard.__sloyka).toMatchObject({ n: '08', group: 'Карточки-ссылки и шаги' });
    expect(Steps.__sloyka.name).toBe('Steps');
  });
});

describe('Banner', () => {
  it('parity: ok with text', () => {
    const { container } = render(<Banner icon="check" title="Система работает штатно">Обновлено в 11:04:59</Banner>);
    same(container, `<div class="sl-banner" role="status"><div class="sl-banner__title"><i data-ic="check"></i>Система работает штатно</div><div class="sl-banner__text">Обновлено в 11:04:59</div></div>`);
  });
  it('parity: warn with items and actions', () => {
    const { container } = render(
      <Banner tone="warn" icon="alert" title="План строится, но без части рекомендаций">
        <Banner.Item action={<Button size="sm">Подключить группу</Button>}>Группа «Дежурные силы» не подключена к оповещению</Banner.Item>
        <Banner.Item action={<Button size="sm">Открыть карту</Button>}>Периметр объекта не нанесён на карту</Banner.Item>
      </Banner>,
    );
    same(container, `<div class="sl-banner sl-banner--warn" role="status"><div class="sl-banner__title"><i data-ic="alert"></i>План строится, но без части рекомендаций</div>
    <div class="sl-banner__item"><span>Группа «Дежурные силы» не подключена к оповещению</span><button class="sl-btn sl-btn--sm">Подключить группу</button></div>
    <div class="sl-banner__item"><span>Периметр объекта не нанесён на карту</span><button class="sl-btn sl-btn--sm">Открыть карту</button></div></div>`);
    expect(warn).not.toHaveBeenCalled();
  });
  it('без icon заголовок без иконки (как в 0.1.x)', () => {
    const { container } = render(<Banner tone="warn" title="Длинный заголовок">Текст</Banner>);
    same(container, `<div class="sl-banner sl-banner--warn" role="status"><div class="sl-banner__title">Длинный заголовок</div><div class="sl-banner__text">Текст</div></div>`);
  });
  it('crit uses role alert; unknown tone warns', () => {
    const { container } = render(<Banner tone="crit" title="Сценарии недоступны" />);
    expect(container.firstElementChild!.getAttribute('role')).toBe('alert');
    render(<Banner tone={'x' as never} title="t" />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Sloyka · Banner'));
  });
  it('allowed: <p> warns; Banner.Item action must be a Button', () => {
    render(<Banner title="t"><p>x</p></Banner>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Sloyka · Banner: <p> недопустим'));
    render(<Banner.Item action={<Tag>x</Tag>}>y</Banner.Item>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Sloyka · Banner.Item: <Tag> недопустим'));
  });
});

describe('Stats', () => {
  it('parity', () => {
    const { container } = render(<Stats items={[{ label: 'Онлайн', value: 10, tone: 'ok' }, { label: 'Предупр.', value: 0, tone: 'warn' }, { label: 'Офлайн', value: 1 }, { label: 'Всего', value: 11 }]} />);
    same(container, `<div class="sl-stats">
    <div class="sl-stat"><span class="sl-stat__value" style="--c:var(--sl-ok)">10</span><span class="sl-caps">Онлайн</span></div>
    <div class="sl-stat"><span class="sl-stat__value" style="--c:var(--sl-warn)">0</span><span class="sl-caps">Предупр.</span></div>
    <div class="sl-stat"><span class="sl-stat__value">1</span><span class="sl-caps">Офлайн</span></div>
    <div class="sl-stat"><span class="sl-stat__value">11</span><span class="sl-caps">Всего</span></div></div>`);
  });
  it('unknown tone warns', () => {
    render(<Stats items={[{ label: 'a', value: 1, tone: 'bad' as never }]} />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Sloyka · Stats'));
  });
});

describe('List, Group, Row', () => {
  const sample = (props: { defaultCollapsed?: boolean } = {}) => (
    <List>
      <Group title="Комплексные средства" count={4} {...props}>
        <Row title="Камера КПП-1" status={<Status tone="ok">Онлайн</Status>} />
        <Row title="Шлюз-2" status={<Status tone="ok">Онлайн</Status>} current chevron />
        <Row title="Шлюз-04" status={<Status tone="hollow" note="Нет связи">Офлайн</Status>} />
      </Group>
    </List>
  );
  it('parity: expanded group', () => {
    const { container } = render(sample());
    same(container, `<div class="sl-list">
    <div class="sl-group">
      <button class="sl-group__head" type="button" aria-expanded="true"><i data-ic="chevron-down"></i>Комплексные средства<span class="sl-count sl-count--solid">4</span></button>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Камера КПП-1</span><span class="sl-status sl-status--ok">Онлайн</span></div></div>
      <div class="sl-row" aria-current="true"><div class="sl-row__main"><span class="sl-row__title">Шлюз-2</span><span class="sl-status sl-status--ok">Онлайн</span></div><i data-ic="chevron-right"></i></div>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Шлюз-04</span><span class="sl-status sl-status--hollow">Офлайн <span class="sl-status__note">· Нет связи</span></span></div></div>
    </div></div>`);
  });
  it('parity: collapsed group has plain count', () => {
    const { container } = render(sample({ defaultCollapsed: true }));
    same(container, `<div class="sl-list"><div class="sl-group" data-collapsed="">
      <button class="sl-group__head" type="button" aria-expanded="false"><i data-ic="chevron-down"></i>Комплексные средства<span class="sl-count">4</span></button>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Камера КПП-1</span><span class="sl-status sl-status--ok">Онлайн</span></div></div>
      <div class="sl-row" aria-current="true"><div class="sl-row__main"><span class="sl-row__title">Шлюз-2</span><span class="sl-status sl-status--ok">Онлайн</span></div><i data-ic="chevron-right"></i></div>
      <div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">Шлюз-04</span><span class="sl-status sl-status--hollow">Офлайн <span class="sl-status__note">· Нет связи</span></span></div></div>
    </div></div>`);
  });
  it('Group toggles on click with aria-expanded (uncontrolled)', () => {
    const { container } = render(sample());
    const head = container.querySelector('.sl-group__head')!;
    const group = container.querySelector('.sl-group')!;
    expect(head.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(head);
    expect(head.getAttribute('aria-expanded')).toBe('false');
    expect(group.hasAttribute('data-collapsed')).toBe(true);
    fireEvent.click(head);
    expect(head.getAttribute('aria-expanded')).toBe('true');
    expect(group.hasAttribute('data-collapsed')).toBe(false);
  });
  it('Group controlled: follows prop and calls onToggle', () => {
    const onToggle = vi.fn();
    const { container, rerender } = render(<Group title="G" collapsed={false} onToggle={onToggle}><Row title="a" /></Group>);
    const head = container.querySelector('.sl-group__head')!;
    fireEvent.click(head);
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(head.getAttribute('aria-expanded')).toBe('true'); // родитель не изменил prop
    rerender(<Group title="G" collapsed onToggle={onToggle}><Row title="a" /></Group>);
    expect(head.getAttribute('aria-expanded')).toBe('false');
  });
  it('Row onClick: role button, keyboard Enter and Space', () => {
    const onClick = vi.fn();
    const { container } = render(<Row title="Шлюз" onClick={onClick} />);
    const row = container.querySelector('.sl-row')!;
    expect(row.getAttribute('role')).toBe('button');
    expect(row.getAttribute('tabindex')).toBe('0');
    fireEvent.click(row);
    fireEvent.keyDown(row, { key: 'Enter' });
    fireEvent.keyDown(row, { key: ' ' });
    fireEvent.keyDown(row, { key: 'a' });
    expect(onClick).toHaveBeenCalledTimes(3);
  });
  it('Row href is a link and uses linkAs', () => {
    const { container } = render(<Row title="A" href="/a" current />);
    const a = container.querySelector('a.sl-row')!;
    expect(a.getAttribute('href')).toBe('/a');
    expect(a.getAttribute('aria-current')).toBe('true');
  });
  it('allowed: Group inside List, Row inside Group; <div> warns', () => {
    render(sample());
    expect(warn).not.toHaveBeenCalled();
    render(<List><div>x</div></List>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Sloyka · List: <div> недопустим'));
    render(<Group title="g"><Tag>t</Tag></Group>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Sloyka · Group: <Tag> недопустим'));
  });
  it('meta', () => {
    expect(List.__sloyka).toMatchObject({ n: '11', group: 'Список с группами', name: 'List' });
    expect(Group.__sloyka.name).toBe('Group');
    expect(Row.__sloyka.name).toBe('Row');
  });
});

describe('Disclosure', () => {
  it('parity: open with body, closed without body', () => {
    same(render(<Disclosure title="Объект" defaultOpen>Название, адрес, периметр объекта.</Disclosure>).container,
      `<details class="sl-disclosure" open><summary><i data-ic="chevron-right"></i><span class="sl-caps">Объект</span></summary><div class="sl-disclosure__body">Название, адрес, периметр объекта.</div></details>`);
    cleanup();
    same(render(<Disclosure title="Зоны охраны" />).container,
      `<details class="sl-disclosure"><summary><i data-ic="chevron-right"></i><span class="sl-caps">Зоны охраны</span></summary></details>`);
  });
  it('accepts any Sloyka component without warning', () => {
    render(<Disclosure title="t"><Field label="x" /><Card>c</Card></Disclosure>);
    expect(warn).not.toHaveBeenCalled();
  });
  it('is server-safe (renders to string)', () => {
    expect(renderToStaticMarkup(<Disclosure title="t">x</Disclosure>)).toContain('sl-disclosure');
  });
});

interface Ev { id: number; time: string; user: string; kind: string }
const EVENTS: Ev[] = [
  { id: 1, time: '26.11.2026, 11:04', user: 'ivanov', kind: 'Вход' },
  { id: 2, time: '26.11.2026, 10:40', user: 'admin', kind: 'Ошибка входа' },
];
const COLS = [
  { key: 'time', title: 'Время' },
  { key: 'user', title: 'Пользователь', render: (r: Ev) => <Text inline weight="strong">{r.user}</Text> },
  { key: 'kind', title: 'Событие', render: (r: Ev) => <Status tone={r.kind === 'Вход' ? 'ok' : 'crit'}>{r.kind}</Status> },
];

describe('Table', () => {
  it('renders data-label per cell, render() cells and plain values', () => {
    const { container } = render(<Table columns={COLS} rows={EVENTS} rowKey="id" />);
    expect(container.querySelector('table')!.className).toBe('sl-table sl-table--stack');
    expect(container.querySelector('.sl-table-wrap > table')).not.toBeNull();
    expect([...container.querySelectorAll('thead th')].map((t) => t.textContent)).toEqual(['Время', 'Пользователь', 'Событие']);
    const row = container.querySelector('tbody tr')!;
    const tds = [...row.querySelectorAll('td')];
    expect(tds.map((t) => t.getAttribute('data-label'))).toEqual(['Время', 'Пользователь', 'Событие']);
    expect(tds[0].textContent).toBe('26.11.2026, 11:04');
    expect(tds[1].querySelector('.sl-text--strong')!.textContent).toBe('ivanov');
    expect(tds[2].querySelector('.sl-status--ok')!.textContent).toBe('Вход');
  });
  it('parity: stack table markup', () => {
    const { container } = render(<Table columns={[{ key: 'time', title: 'Время' }, { key: 'kind', title: 'Событие', render: (r: Ev) => <Status tone="ok">{r.kind}</Status> }]} rows={[EVENTS[0]]} rowKey="id" />);
    same(container, `<div class="sl-table-wrap"><table class="sl-table sl-table--stack"><thead><tr><th>Время</th><th>Событие</th></tr></thead>
      <tbody><tr><td data-label="Время">26.11.2026, 11:04</td><td data-label="Событие"><span class="sl-status sl-status--ok">Вход</span></td></tr></tbody></table></div>`);
  });
  it('stack={false} drops stack class and data-label', () => {
    const { container } = render(<Table columns={COLS} rows={EVENTS} rowKey="id" stack={false} />);
    expect(container.querySelector('table')!.className).toBe('sl-table');
    expect(container.querySelector('td')!.hasAttribute('data-label')).toBe(false);
  });
  it('empty rows show empty text in a colspan row', () => {
    const { container } = render(<Table columns={COLS} rows={[]} rowKey="id" empty="Событий нет" />);
    const td = container.querySelector('tbody td')!;
    expect(td.getAttribute('colspan')).toBe('3');
    expect(td.querySelector('.sl-empty')!.textContent).toBe('Событий нет');
    expect(td.querySelector('svg')).not.toBeNull();
  });
  it('empty without text still renders default message', () => {
    const { container } = render(<Table columns={COLS} rows={[]} rowKey="id" />);
    expect(container.querySelector('.sl-empty')!.textContent).toBe('Нет данных');
  });
  it('rowKey as function; align and width classes', () => {
    const { container } = render(
      <Table columns={[{ key: 'time', title: 'Время', align: 'right', width: 'min' }, { key: 'user', title: 'Кто', align: 'center' }]}
        rows={EVENTS} rowKey={(r) => `k${r.id}`} />,
    );
    expect(warn).not.toHaveBeenCalled();
    expect(container.querySelector('th')!.className).toContain('sl-table__r');
    expect(container.querySelector('th')!.className).toContain('sl-table__min');
    expect(container.querySelectorAll('th')[1].className).toContain('sl-table__c');
    expect(container.querySelector('td')!.className).toContain('sl-table__r');
  });
  it('onRowClick: keyboard and mouse', () => {
    const onRowClick = vi.fn();
    const { container } = render(<Table columns={COLS} rows={EVENTS} rowKey="id" onRowClick={onRowClick} />);
    const tr = container.querySelector('tbody tr')!;
    expect(tr.getAttribute('tabindex')).toBe('0');
    fireEvent.click(tr);
    fireEvent.keyDown(tr, { key: 'Enter' });
    fireEvent.keyDown(tr, { key: ' ' });
    fireEvent.keyDown(tr, { key: 'x' });
    expect(onRowClick).toHaveBeenCalledTimes(3);
    expect(onRowClick).toHaveBeenCalledWith(EVENTS[0]);
  });
  it('Button inside a clickable row: Enter and click do not trigger onRowClick', () => {
    const onRowClick = vi.fn();
    const onBtn = vi.fn();
    const cols = [{ key: 'user', title: 'Кто', render: () => <Button size="sm" onClick={onBtn}>Открыть</Button> }];
    const { container } = render(<Table columns={cols} rows={EVENTS} rowKey="id" onRowClick={onRowClick} />);
    const btn = container.querySelector('tbody button')!;
    const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    btn.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
    fireEvent.click(btn);
    expect(onBtn).toHaveBeenCalledTimes(1);
    expect(onRowClick).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector('tbody td')!);
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });
  it('without onRowClick rows are not focusable', () => {
    const { container } = render(<Table columns={COLS} rows={EVENTS} rowKey="id" />);
    expect(container.querySelector('tbody tr')!.hasAttribute('tabindex')).toBe(false);
  });
  it('is server-safe and has meta 13', () => {
    expect(renderToStaticMarkup(<Table columns={COLS} rows={EVENTS} rowKey="id" />)).toContain('data-label="Время"');
    expect(Table.__sloyka).toMatchObject({ n: '13', group: 'Таблица', name: 'Table' });
  });
});

describe('Empty and Dropzone', () => {
  it('parity: dropzone with action', () => {
    const { container } = render(<Dropzone icon="upload" title="Карты не загружены" text="Загрузите файл карты — она появится без интернета." action={<Button variant="primary" icon="plus">Загрузить карту</Button>} />);
    same(container, `<div class="sl-dropzone sl-empty"><i data-ic="upload"></i><div class="sl-empty__title">Карты не загружены</div><div>Загрузите файл карты — она появится без интернета.</div><button class="sl-btn sl-btn--primary"><i data-ic="plus"></i>Загрузить карту</button></div>`);
  });
  it('parity: Empty without frame and action', () => {
    const { container } = render(<Empty icon="pulse" title="Событий нет" />);
    same(container, `<div class="sl-empty"><i data-ic="pulse"></i><div class="sl-empty__title">Событий нет</div></div>`);
  });
  it('action must be a Button', () => {
    render(<Empty icon="pulse" title="t" action={<Tag>x</Tag>} />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Sloyka · Empty: <Tag> недопустим'));
  });
  it('meta', () => {
    expect(Empty.__sloyka).toMatchObject({ n: '14', group: 'Пустое состояние и загрузка файла', name: 'Empty' });
    expect(Dropzone.__sloyka.name).toBe('Dropzone');
  });
});

describe('types', () => {
  it('rejects className/style and bad props at compile time', () => {
    // Проверка вычисляется tsc; в рантайме только убеждаемся, что элементы создаются.
    const els = [
      // @ts-expect-error className не принимается
      <Card className="x" />,
      // @ts-expect-error value обязателен
      <Metric label="x" />,
      // @ts-expect-error неизвестный tone
      <Banner tone="info" title="t" />,
      // @ts-expect-error rowKey должен быть полем строки
      <Table columns={COLS} rows={EVENTS} rowKey="nope" />,
      // @ts-expect-error style не принимается
      <Row title="a" style={{ color: 'red' }} />,
    ];
    expect(els).toHaveLength(5);
  });
});
