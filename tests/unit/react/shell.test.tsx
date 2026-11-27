import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup, act, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement, useState } from 'react';
import {
  Icon, Button, Field, Search, Select, Chip, Count, Compose, Status, Text, Switch, Card,
  PageHeader, Toolbar, Topbar, StatusBar, DockButton, Menu, Picker, Tile, Window, Modal,
  ToastProvider, useToast, Tooltip, Login, Nav, Shell, Page, ThemeProvider, ThemeToggle, ThemeScript, useTheme,
} from '../../../src/react';
import { resetWarnings } from '../../../src/react/core';

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => { resetWarnings(); warn = vi.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => { cleanup(); warn.mockRestore(); vi.useRealTimers(); });

/** `<i data-ic="x"></i>` из историй 0.1.x -> svg-иконка React-версии. */
const withIcons = (html: string) =>
  html.replace(/<i data-ic="([\w-]+)"( class="[\w -]+")?><\/i>/g, (_, n) => renderToStaticMarkup(<Icon name={n as never} />));

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
 *  - PageHeader: подпись справа в span.sl-page-head__aside (в 0.1.x — .lbl из Storybook, в пакете такого класса нет).
 *  - Topbar: между брендом и названием span.sl-topbar__sep (в 0.1.x — inline-стиль); внутри Shell кнопка меню добавляется сама.
 *  - Menu.Separator: role="separator"; Menu.Item — type="button".
 *  - Tile: aria-pressed выводится только если задан selected; у плитки-ссылки без href — inert-вариант как у Button.
 *  - Window: section получает aria-labelledby (useId); кнопка закрытия — Button, появляется только с onClose.
 *  - Modal: вместо <sl-modal><dialog> — один <dialog> с aria-labelledby; содержимое монтируется только пока окно открыто;
 *    размер md без модификатора, sm/lg — sl-modal--sm/--lg.
 *  - Toast: цвет через класс sl-toast--{kind} вместо inline --c; иконка обёрнута в span.sl-toast__icon;
 *    role="status" у ok/warn/info, role="alert" у crit (как в 0.1.x).
 *  - Tooltip: оборачивается в span.sl-tooltip-host; подсказка появляется по наведению/фокусу, role="tooltip".
 *  - Login: оболочка div.sl-login-wrap (в 0.1.x — inline-стили в истории), поля — Field (name, autocomplete, required).
 *  - Nav: nav получает aria-label «Разделы»; Nav.Section — div.sl-nav__section.sl-caps; пункт без aria-current у нетекущих.
 *  - Shell: div.sl-shell[data-nav-open] вместо кастомного <sl-shell>; кнопка меню рисуется внутри Topbar через контекст.
 *  - ThemeToggle: aria-pressed и иконка sun/moon по теме (в 0.1.x иконка всегда moon).
 */

describe('PageHeader / Toolbar', () => {
  it('parity: заголовок + панель фильтров', () => {
    const { container } = render(
      <>
        <PageHeader title="Устройства" aside="Сервер работает 31 мин" />
        <Toolbar>
          <Search placeholder="Поиск по названию и адресу" />
          <Select aria-label="Все классы" options={[{ value: 'all', label: 'Все классы' }]} />
          <Toolbar.End><Button variant="primary" icon="plus">Добавить устройство</Button></Toolbar.End>
        </Toolbar>
      </>,
    );
    const h = container.querySelector('.sl-page-head')!;
    expect(norm(h.outerHTML)).toBe(norm('<div class="sl-page-head"><h1 class="sl-page-title">Устройства</h1><span class="sl-page-head__aside">Сервер работает 31 мин</span></div>'));
    const bar = container.querySelector('.sl-toolbar')!;
    expect(bar.children).toHaveLength(3);
    expect(bar.querySelector('.sl-toolbar__end > .sl-btn--primary')!.textContent).toBe('Добавить устройство');
  });
  it('без aside нет подписи', () => {
    const { container } = render(<PageHeader title="Раздел" />);
    same(container, '<div class="sl-page-head"><h1 class="sl-page-title">Раздел</h1></div>');
  });
  it('Toolbar: недопустимый ребёнок — предупреждение', () => {
    render(<Toolbar><Card>x</Card></Toolbar>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Toolbar'));
  });
});

describe('Topbar', () => {
  it('parity: бренд, название, действия', () => {
    const { container } = render(
      <Topbar brand={{ mark: 'S', name: 'SLOYKA' }} title="Панель администрирования">
        <Button size="sm" icon="arrow-left">Мониторинг</Button>
      </Topbar>,
    );
    same(container, `<header class="sl-topbar">
      <span class="sl-brand"><span class="sl-brand__mark">S</span><span class="sl-brand__text">SLOYKA</span></span>
      <span class="sl-topbar__sep" aria-hidden="true"></span>
      <span class="sl-topbar__title">Панель администрирования</span>
      <div class="sl-topbar__end"><button class="sl-btn sl-btn--sm"><i data-ic="arrow-left"></i>Мониторинг</button></div>
    </header>`);
  });
  it('без Shell нет кнопки меню', () => {
    const { container } = render(<Topbar brand={{ mark: 'S', name: 'S' }} />);
    expect(container.querySelector('.sl-shell__toggle')).toBeNull();
  });
});

describe('StatusBar / DockButton', () => {
  it('parity: статус-бар', () => {
    const { container } = render(
      <StatusBar items={[{ label: 'Астрономическое', value: '11:04:18' }, { label: 'Оперативное', value: '11:04:18 · 26 ноя 2026' }]} system={{ tone: 'ok', text: 'В норме' }} />,
    );
    same(container, `<div class="sl-statusbar"><div><span class="sl-caps">Астрономическое</span><strong>11:04:18</strong></div><div><span class="sl-caps">Оперативное</span><strong>11:04:18 · 26 ноя 2026</strong></div><div><span class="sl-caps">Система</span><span class="sl-status sl-status--ok">В норме</span></div></div>`);
  });
  it('parity: DockButton', () => {
    const { container } = render(<><DockButton icon="grid" chevron="down">Центр</DockButton><DockButton chevron="up">Силы и средства</DockButton></>);
    same(container, `<button class="sl-dock-btn" type="button"><i data-ic="grid"></i>Центр<i data-ic="chevron-down"></i></button><button class="sl-dock-btn" type="button">Силы и средства<i data-ic="chevron-up"></i></button>`);
  });
  it('DockButton вызывает onClick', () => {
    const fn = vi.fn();
    render(<DockButton onClick={fn}>Центр</DockButton>);
    fireEvent.click(screen.getByText('Центр'));
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('Menu', () => {
  it('parity: меню аккаунта', () => {
    const { container } = render(
      <Menu header={{ name: 'ОД', role: 'Администратор' }}>
        <Menu.Item icon="user">Профиль</Menu.Item>
        <Menu.Separator />
        <Menu.Item icon="power" danger>Выйти</Menu.Item>
      </Menu>,
    );
    same(container, `<div class="sl-menu">
      <div class="sl-menu__head"><div class="sl-card__title">ОД</div><div class="sl-card__sub">Администратор</div></div>
      <button class="sl-menu__item" type="button"><i data-ic="user"></i>Профиль</button>
      <div class="sl-menu__sep" role="separator"></div>
      <button class="sl-menu__item sl-menu__item--danger" type="button"><i data-ic="power"></i>Выйти</button>
    </div>`);
  });
  it('Item: onClick и href/linkAs', () => {
    const fn = vi.fn();
    const Custom = ({ href, className, children }: any) => <a data-custom href={href} className={className}>{children}</a>;
    const { container } = render(<Menu><Menu.Item onClick={fn}>A</Menu.Item><Menu.Item href="/p" linkAs={Custom}>B</Menu.Item></Menu>);
    fireEvent.click(screen.getByText('A'));
    expect(fn).toHaveBeenCalledTimes(1);
    const a = container.querySelector('a[data-custom]')!;
    expect(a.getAttribute('href')).toBe('/p');
    expect(a.className).toBe('sl-menu__item');
  });
});

describe('Picker / Tile', () => {
  it('parity: плитки', () => {
    const { container } = render(
      <Picker title="Подсистема">
        <Tile>Центр</Tile>
        <Tile selected>Видеонаблюдение</Tile>
        <Tile disabled note="В разработке">Связь</Tile>
      </Picker>,
    );
    same(container, `<div class="sl-picker"><span class="sl-caps">Подсистема</span><div class="sl-picker__grid">
      <button class="sl-tile" type="button">Центр</button>
      <button class="sl-tile" type="button" aria-pressed="true">Видеонаблюдение</button>
      <button class="sl-tile" type="button" disabled>Связь<small>В разработке</small></button>
    </div></div>`);
  });
  it('selected=false даёт aria-pressed=false; onClick; недоступная ссылка инертна', () => {
    const fn = vi.fn();
    const { container } = render(<Picker title="П"><Tile selected={false} onClick={fn}>A</Tile><Tile href="/x" disabled>B</Tile><Tile href="/y">C</Tile></Picker>);
    const [a, b, c] = [...container.querySelectorAll('.sl-tile')];
    expect(a!.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(a!);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(b!.getAttribute('href')).toBeNull();
    expect(b!.getAttribute('aria-disabled')).toBe('true');
    expect(c!.getAttribute('href')).toBe('/y');
  });
});

describe('Window', () => {
  it('parity: окно с шапкой, полосой, телом и низом', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Window title="Чат смены" icon="chat" onClose={onClose}
        bar={<><Chip count={1}>На линии</Chip><Button size="sm">Голосовое оповещение</Button></>}
        footer={<Compose placeholder="Сообщение…" />}>
        Сообщений пока нет
      </Window>,
    );
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('SECTION');
    expect(root.className).toBe('sl-window');
    expect(root.querySelector('.sl-window__head > .sl-ic')).not.toBeNull();
    expect(root.querySelector('.sl-window__title')!.textContent).toBe('Чат смены');
    expect(root.getAttribute('aria-labelledby')).toBe(root.querySelector('.sl-window__title')!.id);
    expect(root.querySelector('.sl-window__bar .sl-chip')).not.toBeNull();
    expect(root.querySelector('.sl-window__body')!.textContent).toBe('Сообщений пока нет');
    expect(root.querySelector('.sl-window__foot .sl-compose')).not.toBeNull();
    fireEvent.click(screen.getByLabelText('Закрыть'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  it('без onClose, bar и footer — только голова и тело', () => {
    const { container } = render(<Window title="T">x</Window>);
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('.sl-window__bar, .sl-window__foot')).toBeNull();
  });
});

describe('Modal', () => {
  const Harness = ({ onChange }: { onChange?: (o: boolean) => void }) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Открыть</button>
        <Modal title="Новое устройство" open={open} onOpenChange={(o) => { onChange?.(o); setOpen(o); }}
          footer={<><Button variant="ghost">Отмена</Button><Button variant="primary">Добавить</Button></>}>
          <Field label="Название" />
        </Modal>
      </>
    );
  };
  const dlg = () => document.querySelector('dialog')!;

  it('parity: открытое окно', () => {
    const { container } = render(<Modal title="Новое устройство" defaultOpen footer={<Button variant="primary">Добавить</Button>}><Field label="Название" /></Modal>);
    const d = dlg();
    expect(d.open).toBe(true);
    expect(d.className).toBe('sl-modal');
    expect(d.getAttribute('aria-labelledby')).toBe(d.querySelector('.sl-modal__title')!.id);
    expect(norm(d.querySelector('.sl-modal__foot')!.outerHTML)).toBe(norm('<div class="sl-modal__foot"><button class="sl-btn sl-btn--primary">Добавить</button></div>'));
    expect(container.querySelector('.sl-modal__head .sl-btn--ghost')!.getAttribute('aria-label')).toBe('Закрыть');
  });
  it('закрыто: диалог есть, содержимого нет', () => {
    render(<Modal title="T">тело</Modal>);
    expect(dlg().open).toBe(false);
    expect(dlg().textContent).toBe('');
  });
  it('size даёт модификатор; плохой size — предупреждение и md', () => {
    render(<><Modal title="a" size="sm" /><Modal title="b" size="lg" /><Modal title="c" size={'xl' as any} /></>);
    const [a, b, c] = [...document.querySelectorAll('dialog')];
    expect(a!.className).toBe('sl-modal sl-modal--sm');
    expect(b!.className).toBe('sl-modal sl-modal--lg');
    expect(c!.className).toBe('sl-modal');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Modal'));
  });
  it('Tab с последнего элемента — на первый, Shift+Tab с первого — на последний (и у нативного диалога)', () => {
    render(<Harness />);
    fireEvent.click(screen.getByText('Открыть'));
    const items = [...dlg().querySelectorAll<HTMLElement>('input, button')];
    const first = items[0]!; // крестик в шапке
    const last = items[items.length - 1]!; // «Добавить»
    last.focus();
    const forward = fireEvent.keyDown(last, { key: 'Tab' });
    expect(forward).toBe(false); // default prevented
    expect(document.activeElement).toBe(first);
    const back = fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
    expect(back).toBe(false);
    expect(document.activeElement).toBe(last);
  });
  it('открытие переносит фокус внутрь, закрытие возвращает его на кнопку', () => {
    render(<Harness />);
    const opener = screen.getByText('Открыть');
    opener.focus();
    fireEvent.click(opener);
    expect(dlg().open).toBe(true);
    expect(dlg().contains(document.activeElement)).toBe(true);
    fireEvent.click(screen.getByLabelText('Закрыть'));
    expect(dlg().open).toBe(false);
    expect(document.activeElement).toBe(opener);
  });
  it('Esc (событие cancel) просит закрыть; в управляемом режиме без согласия владельца окно остаётся', () => {
    const onOpenChange = vi.fn();
    render(<Modal title="T" open onOpenChange={onOpenChange}>x</Modal>);
    const ev = new Event('cancel', { cancelable: true });
    act(() => { dlg().dispatchEvent(ev); });
    expect(ev.defaultPrevented).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(dlg().open).toBe(true);
  });
  it('Esc в неуправляемом режиме закрывает окно', () => {
    render(<Modal title="T" defaultOpen>x</Modal>);
    act(() => { dlg().dispatchEvent(new Event('cancel', { cancelable: true })); });
    expect(dlg().open).toBe(false);
  });
  it('фон: нажали и отпустили на фоне — закрывает', () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByText('Открыть'));
    fireEvent.pointerDown(dlg());
    fireEvent.click(dlg());
    expect(onChange).toHaveBeenCalledWith(false);
    expect(dlg().open).toBe(false);
  });
  it('фон: нажали внутри, отпустили на фоне — не закрывает', () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByText('Открыть'));
    fireEvent.pointerDown(dlg().querySelector('input')!);
    fireEvent.click(dlg());
    expect(onChange).not.toHaveBeenCalled();
    expect(dlg().open).toBe(true);
  });
  it('клик внутри окна не закрывает', () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByText('Открыть'));
    fireEvent.pointerDown(dlg().querySelector('.sl-modal__body')!);
    fireEvent.click(dlg().querySelector('.sl-modal__body')!);
    expect(onChange).not.toHaveBeenCalled();
  });
  it('управляемый режим: open меняется снаружи', () => {
    const { rerender } = render(<Modal title="T" open={false}>x</Modal>);
    expect(dlg().open).toBe(false);
    rerender(<Modal title="T" open>x</Modal>);
    expect(dlg().open).toBe(true);
    rerender(<Modal title="T" open={false}>x</Modal>);
    expect(dlg().open).toBe(false);
  });
  it('закрытие «снаружи» (событие close) синхронизирует состояние', () => {
    const onOpenChange = vi.fn();
    render(<Modal title="T" defaultOpen onOpenChange={onOpenChange}>x</Modal>);
    act(() => { dlg().removeAttribute('open'); dlg().dispatchEvent(new Event('close')); });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  it('кнопка закрытия внутри <form> не отправляет форму', () => {
    const submit = vi.fn((e: any) => e.preventDefault());
    render(<form onSubmit={submit}><Modal title="T" defaultOpen>x</Modal></form>);
    fireEvent.click(screen.getByLabelText('Закрыть'));
    expect(submit).not.toHaveBeenCalled();
    expect(document.querySelector('.sl-modal__head button')).toBeNull();
  });
  it('управляемый режим: если владелец оставил open=true, а диалог закрылся сам, он показывается снова', () => {
    const onOpenChange = vi.fn();
    render(<Modal title="T" open onOpenChange={onOpenChange}>x</Modal>);
    act(() => { dlg().removeAttribute('open'); dlg().dispatchEvent(new Event('close')); });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(dlg().open).toBe(true);
  });
  it('в footer допустимы только кнопки', () => {
    render(<Modal title="T" defaultOpen footer={<Text>не кнопка</Text>}>x</Modal>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('<Text> недопустим'));
  });
});

describe('Toast', () => {
  const Fire = ({ kind, text, opts }: { kind: 'ok' | 'warn' | 'crit' | 'info'; text: string; opts?: { title?: string; duration?: number } }) => {
    const toast = useToast();
    return <button onClick={() => toast[kind](text, opts)}>go</button>;
  };
  const fire = () => fireEvent.click(screen.getByText('go'));

  it('регион создаётся провайдером заранее', () => {
    const { container } = render(<ToastProvider>x</ToastProvider>);
    const r = container.querySelector('.sl-toast-region')!;
    expect(r.getAttribute('aria-live')).toBe('polite');
    expect(r.children).toHaveLength(0);
  });
  it('parity: ok с заголовком', () => {
    const { container } = render(<ToastProvider><Fire kind="ok" text="Камера КПП-2 появится на карте." opts={{ title: 'Устройство добавлено' }} /></ToastProvider>);
    fire();
    const t = container.querySelector('.sl-toast')!;
    expect(norm(t.outerHTML)).toBe(norm(withIcons(`<div class="sl-toast sl-toast--ok" role="status"><span class="sl-toast__icon"><i data-ic="check"></i></span><div class="sl-toast__body"><span class="sl-toast__title">Устройство добавлено</span><span class="sl-toast__text">Камера КПП-2 появится на карте.</span></div><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" type="button" aria-label="Закрыть"><i data-ic="x"></i></button></div>`)));
  });
  it('без заголовка текст идёт в title-span', () => {
    const { container } = render(<ToastProvider><Fire kind="info" text="Готово" /></ToastProvider>);
    fire();
    expect(container.querySelector('.sl-toast__title')!.textContent).toBe('Готово');
    expect(container.querySelector('.sl-toast__text')).toBeNull();
    expect(container.querySelector('.sl-toast--info')!.getAttribute('role')).toBe('status');
  });
  it('info исчезает через 5000 мс', () => {
    vi.useFakeTimers();
    const { container } = render(<ToastProvider><Fire kind="info" text="Инфо" /></ToastProvider>);
    fire();
    act(() => { vi.advanceTimersByTime(4999); });
    expect(container.querySelector('.sl-toast')).not.toBeNull();
    act(() => { vi.advanceTimersByTime(1); });
    expect(container.querySelector('.sl-toast')).toBeNull();
  });
  it('crit: role=alert и не исчезает сам', () => {
    vi.useFakeTimers();
    const { container } = render(<ToastProvider><Fire kind="crit" text="Ошибка" /></ToastProvider>);
    fire();
    expect(container.querySelector('.sl-toast')!.getAttribute('role')).toBe('alert');
    act(() => { vi.advanceTimersByTime(600000); });
    expect(container.querySelector('.sl-toast')).not.toBeNull();
  });
  it('duration задаётся явно; кнопка «Закрыть» убирает', () => {
    vi.useFakeTimers();
    const { container } = render(<ToastProvider><Fire kind="warn" text="Предупреждение" opts={{ duration: 1000 }} /></ToastProvider>);
    fire();
    act(() => { vi.advanceTimersByTime(1000); });
    expect(container.querySelector('.sl-toast')).toBeNull();
    fire();
    fireEvent.click(screen.getByLabelText('Закрыть'));
    expect(container.querySelector('.sl-toast')).toBeNull();
  });
  it('кнопка закрытия тоста и окна имеет type=button', () => {
    const { container } = render(<ToastProvider><Fire kind="ok" text="x" /><Window title="W" onClose={() => {}}>b</Window></ToastProvider>);
    fire();
    expect(container.querySelector('.sl-toast button')!.getAttribute('type')).toBe('button');
    expect(container.querySelector('.sl-window__head button')!.getAttribute('type')).toBe('button');
  });
  it('текст экранируется, не HTML', () => {
    const { container } = render(<ToastProvider><Fire kind="ok" text="<img src=x onerror=alert(1)>" /></ToastProvider>);
    fire();
    expect(container.querySelector('.sl-toast img')).toBeNull();
    expect(container.querySelector('.sl-toast__title')!.textContent).toBe('<img src=x onerror=alert(1)>');
  });
  it('useToast вне провайдера — ошибка с текстом', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Fire kind="ok" text="x" />)).toThrow('Sloyka · useToast: оберните приложение в <ToastProvider>');
    err.mockRestore();
  });
  it('вложенные провайдеры: побеждает внутренний, без ошибок', () => {
    const { container } = render(<ToastProvider><ToastProvider><Fire kind="ok" text="Внутри" /></ToastProvider></ToastProvider>);
    fire();
    const regions = container.querySelectorAll('.sl-toast-region');
    expect(regions).toHaveLength(2);
    // внутренний регион вложен в children внешнего, поэтому идёт первым; внешний пуст
    expect(regions[0]!.querySelectorAll('.sl-toast')).toHaveLength(1);
    expect(regions[1]!.querySelector('.sl-toast')).toBeNull();
    expect(container.querySelectorAll('.sl-toast')).toHaveLength(1);
  });
});

describe('Tooltip', () => {
  it('parity: показанная подсказка', () => {
    const { container } = render(<Tooltip text="Переключить тему" defaultOpen><Button>Тема</Button></Tooltip>);
    const tip = container.querySelector('.sl-tooltip')!;
    expect(norm(tip.outerHTML, ['id'])).toBe(norm('<span class="sl-tooltip" role="tooltip">Переключить тему</span>'));
    expect(container.firstElementChild!.getAttribute('aria-describedby')).toBe(tip.id);
  });
  it('наведение и фокус показывают, уход и Esc скрывают', () => {
    const { container } = render(<Tooltip text="Подсказка"><Button>Кнопка</Button></Tooltip>);
    const host = container.firstElementChild!;
    expect(container.querySelector('.sl-tooltip')).toBeNull();
    fireEvent.mouseEnter(host);
    expect(container.querySelector('.sl-tooltip')).not.toBeNull();
    fireEvent.mouseLeave(host);
    expect(container.querySelector('.sl-tooltip')).toBeNull();
    fireEvent.focus(screen.getByText('Кнопка'));
    expect(container.querySelector('.sl-tooltip')).not.toBeNull();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(container.querySelector('.sl-tooltip')).toBeNull();
  });
  it('одиночный элемент получает aria-describedby сам (с учётом уже заданного), обёртка — нет', () => {
    const { container } = render(<Tooltip text="Подсказка" defaultOpen><input aria-label="поле" aria-describedby="hint" /></Tooltip>);
    const tip = container.querySelector('.sl-tooltip')!;
    expect(container.querySelector('input')!.getAttribute('aria-describedby')).toBe(`hint ${tip.id}`);
    expect(container.firstElementChild!.hasAttribute('aria-describedby')).toBe(false);
  });
  it('Esc скрывает подсказку и отменяет событие, чтобы не закрыть меню Shell', () => {
    render(<Tooltip text="Т" defaultOpen>x</Tooltip>);
    const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    act(() => { document.dispatchEvent(ev); });
    expect(ev.defaultPrevented).toBe(true);
    expect(document.querySelector('.sl-tooltip')).toBeNull();
  });
  it('управляемый open', () => {
    const { container, rerender } = render(<Tooltip text="Т" open={false}>x</Tooltip>);
    expect(container.querySelector('.sl-tooltip')).toBeNull();
    rerender(<Tooltip text="Т" open>x</Tooltip>);
    expect(container.querySelector('.sl-tooltip')).not.toBeNull();
  });
});

describe('Login', () => {
  it('parity: карточка входа', () => {
    const { container } = render(<Login brand={{ mark: 'S', name: 'SLOYKA' }} onSubmit={() => {}} footer="Название организации" />);
    expect(container.querySelector('.sl-login-wrap > .sl-brand .sl-brand__mark')!.textContent).toBe('S');
    const form = container.querySelector('form.sl-login')!;
    expect([...form.querySelectorAll('.sl-label')].map((l) => l.textContent)).toEqual(['Имя пользователя', 'Пароль']);
    expect(form.querySelector('input[type=password]')!.getAttribute('placeholder')).toBe('Введите пароль');
    const btn = form.querySelector('button')!;
    expect(btn.className).toBe('sl-btn sl-btn--primary sl-btn--lg sl-btn--caps sl-btn--block');
    expect(btn.getAttribute('type')).toBe('submit');
    expect(form.querySelector('.sl-login__foot')!.textContent).toBe('Название организации');
  });
  it('submit отдаёт значения полей и отменяет нативную отправку', () => {
    const onSubmit = vi.fn();
    const { container } = render(<Login brand={{ mark: 'S', name: 'S' }} onSubmit={onSubmit} />);
    const [u, p] = [...container.querySelectorAll('input')];
    fireEvent.change(u!, { target: { value: 'ivanov' } });
    fireEvent.change(p!, { target: { value: 'секрет' } });
    const ev = new Event('submit', { bubbles: true, cancelable: true });
    act(() => { container.querySelector('form')!.dispatchEvent(ev); });
    expect(ev.defaultPrevented).toBe(true);
    expect(onSubmit.mock.calls[0]![0]).toEqual({ username: 'ivanov', password: 'секрет' });
  });
  it('error показывается с role=alert', () => {
    const { container } = render(<Login brand={{ mark: 'S', name: 'S' }} onSubmit={() => {}} error="Неверный пароль" />);
    const e = container.querySelector('[role=alert]')!;
    expect(e.textContent).toBe('Неверный пароль');
  });
});

describe('Nav', () => {
  it('parity: полное меню, current по href', () => {
    const { container } = render(
      <Nav current="/devices">
        <Nav.Section title="Управление" />
        <Nav.Item icon="users" href="/users">Пользователи</Nav.Item>
        <Nav.Item icon="plug" href="/devices" count={3}>Устройства</Nav.Item>
      </Nav>,
    );
    same(container, `<nav class="sl-nav" aria-label="Разделы">
      <div class="sl-nav__section sl-caps">Управление</div>
      <a class="sl-nav__item" href="/users"><i data-ic="users"></i><span class="sl-nav__label">Пользователи</span></a>
      <a class="sl-nav__item" href="/devices" aria-current="page"><i data-ic="plug"></i><span class="sl-nav__label">Устройства</span><span class="sl-count sl-count--solid">3</span></a>
    </nav>`);
  });
  it('current совпадает и с id пункта; без совпадения aria-current нет', () => {
    const { container } = render(<Nav current="logs"><Nav.Item icon="pulse" href="/l" id="logs">Логи</Nav.Item><Nav.Item icon="map" href="/m">Карты</Nav.Item></Nav>);
    const items = container.querySelectorAll('.sl-nav__item');
    expect(items[0]!.getAttribute('aria-current')).toBe('page');
    expect(items[1]!.hasAttribute('aria-current')).toBe(false);
    expect(items[0]!.hasAttribute('id')).toBe(false);
  });
  it('rail и linkAs', () => {
    const Custom = ({ href, className, children, ...a }: any) => <a data-custom href={href} className={className} {...a}>{children}</a>;
    const { container } = render(<Nav rail current="/a"><Nav.Item icon="map" href="/a" linkAs={Custom}>A</Nav.Item></Nav>);
    expect(container.querySelector('nav')!.className).toBe('sl-nav sl-nav--rail');
    const a = container.querySelector('a[data-custom]')!;
    expect(a.getAttribute('aria-current')).toBe('page');
  });
});

describe('Shell', () => {
  const App = ({ onChange }: { onChange?: (o: boolean) => void }) => (
    <Shell
      onNavOpenChange={onChange}
      topbar={<Topbar brand={{ mark: 'S', name: 'SLOYKA' }} title="Панель" />}
      nav={<Nav current="/devices"><Nav.Item icon="plug" href="/devices">Устройства</Nav.Item><Nav.Item icon="map" href="/maps">Карты</Nav.Item></Nav>}>
      <Page>Содержимое</Page>
    </Shell>
  );
  const root = (c: HTMLElement) => c.querySelector('.sl-shell')!;
  const toggle = () => screen.getByLabelText('Меню');

  it('каркас: topbar, nav, backdrop, main; кнопка меню связана с nav', () => {
    const { container } = render(<App />);
    expect(root(container).hasAttribute('data-nav-open')).toBe(false);
    const nav = container.querySelector('nav.sl-nav.sl-shell__nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Разделы');
    expect(toggle().getAttribute('aria-controls')).toBe(nav.id);
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('main.sl-shell__main')!.textContent).toBe('Содержимое');
    expect(container.querySelectorAll('main')).toHaveLength(1);
    expect(container.querySelector('.sl-shell__backdrop')).not.toBeNull();
  });
  it('кнопка открывает меню, фокус уходит в первый пункт', () => {
    const onChange = vi.fn();
    const { container } = render(<App onChange={onChange} />);
    fireEvent.click(toggle());
    expect(root(container).hasAttribute('data-nav-open')).toBe(true);
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(container.querySelector('.sl-nav__item'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
  it('Esc закрывает и возвращает фокус на кнопку', () => {
    const { container } = render(<App />);
    fireEvent.click(toggle());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(root(container).hasAttribute('data-nav-open')).toBe(false);
    expect(document.activeElement).toBe(toggle());
  });
  it('фон закрывает меню', () => {
    const { container } = render(<App />);
    fireEvent.click(toggle());
    fireEvent.click(container.querySelector('.sl-shell__backdrop')!);
    expect(root(container).hasAttribute('data-nav-open')).toBe(false);
    expect(document.activeElement).toBe(toggle());
  });
  it('выбор пункта закрывает меню, фокус на кнопке', () => {
    const { container } = render(<App />);
    fireEvent.click(toggle());
    fireEvent.click(container.querySelectorAll('.sl-nav__item')[1]!);
    expect(root(container).hasAttribute('data-nav-open')).toBe(false);
    expect(document.activeElement).toBe(toggle());
  });
  it('повторный клик по кнопке закрывает', () => {
    const { container } = render(<App />);
    fireEvent.click(toggle());
    fireEvent.click(toggle());
    expect(root(container).hasAttribute('data-nav-open')).toBe(false);
  });
  it('Esc не трогает меню, если открыто модальное окно или событие уже обработано', () => {
    const { container } = render(<App />);
    fireEvent.click(toggle());
    const d = document.createElement('dialog');
    d.setAttribute('open', '');
    document.body.append(d);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(root(container).hasAttribute('data-nav-open')).toBe(true);
    d.remove();
    const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    ev.preventDefault();
    document.dispatchEvent(ev);
    expect(root(container).hasAttribute('data-nav-open')).toBe(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(root(container).hasAttribute('data-nav-open')).toBe(false);
  });
  it('Esc при закрытом меню ничего не делает (слушатель не висит)', () => {
    const { container } = render(<App />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(root(container).hasAttribute('data-nav-open')).toBe(false);
  });
  it('управляемый режим: navOpen следует владельцу', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<Shell navOpen={false} onNavOpenChange={onChange} topbar={<Topbar brand={{ mark: 'S', name: 'S' }} />} nav={<Nav />}>x</Shell>);
    fireEvent.click(toggle());
    expect(onChange).toHaveBeenCalledWith(true);
    expect(root(container).hasAttribute('data-nav-open')).toBe(false);
    rerender(<Shell navOpen onNavOpenChange={onChange} topbar={<Topbar brand={{ mark: 'S', name: 'S' }} />} nav={<Nav />}>x</Shell>);
    expect(root(container).hasAttribute('data-nav-open')).toBe(true);
  });
  it('в topbar и nav допустимы только Topbar и Nav', () => {
    render(<Shell topbar={<Card>x</Card>} nav={<Card>y</Card>}>z</Shell>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('<Card> недопустим'));
  });
});

describe('Theme', () => {
  beforeEach(() => { localStorage.clear(); delete document.documentElement.dataset.theme; });
  const Probe = () => { const t = useTheme(); return <span data-testid="p">{t.theme}/{t.resolvedTheme}</span>; };

  it('defaultTheme dark ставит data-theme на html, ThemeToggle переключает и сохраняет в sl-theme', () => {
    render(<ThemeProvider defaultTheme="dark"><ThemeToggle /><Probe /></ThemeProvider>);
    expect(document.documentElement.dataset.theme).toBe('dark');
    const btn = screen.getByLabelText('Тёмная тема');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(btn);
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('sl-theme')).toBe('light');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(btn);
    expect(localStorage.getItem('sl-theme')).toBe('dark');
  });
  it('сохранённая тема сильнее defaultTheme', () => {
    localStorage.setItem('sl-theme', 'dark');
    render(<ThemeProvider defaultTheme="light"><Probe /></ThemeProvider>);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByTestId('p').textContent).toBe('dark/dark');
  });
  it('system: атрибут не ставится, resolvedTheme берётся из системы', () => {
    const mm = vi.spyOn(globalThis, 'matchMedia').mockImplementation(((q: string) => ({ matches: true, media: q, addEventListener() {}, removeEventListener() {} })) as any);
    render(<ThemeProvider defaultTheme="system"><Probe /></ThemeProvider>);
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(screen.getByTestId('p').textContent).toBe('system/dark');
    mm.mockRestore();
  });
  it('setTheme("system") снимает атрибут и очищает сохранённое', () => {
    let api!: ReturnType<typeof useTheme>;
    const Grab = () => { api = useTheme(); return null; };
    render(<ThemeProvider defaultTheme="dark"><Grab /></ThemeProvider>);
    act(() => api.setTheme('system'));
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(localStorage.getItem('sl-theme')).toBeNull();
  });
  it('свой storageKey', () => {
    render(<ThemeProvider defaultTheme="dark" storageKey="my"><ThemeToggle /></ThemeProvider>);
    fireEvent.click(screen.getByLabelText('Тёмная тема'));
    expect(localStorage.getItem('my')).toBe('light');
    expect(localStorage.getItem('sl-theme')).toBeNull();
  });
  it('закрытое хранилище не ломает провайдер', () => {
    const g = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    const s = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    render(<ThemeProvider defaultTheme="light"><ThemeToggle /></ThemeProvider>);
    expect(() => fireEvent.click(screen.getByLabelText('Тёмная тема'))).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe('dark');
    g.mockRestore(); s.mockRestore();
  });
  it('серверная разметка зависит только от defaultTheme, а не от хранилища', () => {
    const html = renderToStaticMarkup(<ThemeProvider defaultTheme="dark"><ThemeToggle /></ThemeProvider>);
    expect(html).toContain('aria-pressed="true"'); // defaultTheme dark известен и на сервере; хранилище не читается
    localStorage.setItem('sl-theme', 'light');
    expect(renderToStaticMarkup(<ThemeProvider defaultTheme="dark"><ThemeToggle /></ThemeProvider>)).toBe(html);
  });
  it('useTheme вне провайдера — ошибка', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('Sloyka · useTheme');
    err.mockRestore();
  });
  it('ThemeScript: inline-скрипт без зависимостей, исполняется и ставит тему', () => {
    const html = renderToStaticMarkup(<ThemeScript />);
    expect(html.startsWith('<script>')).toBe(true);
    const code = html.replace(/^<script>/, '').replace(/<\/script>$/, '');
    expect(code).toContain('localStorage.getItem("sl-theme")');
    expect(code).not.toMatch(/\b(import|require|export)\b/);
    localStorage.setItem('sl-theme', 'dark');
    new Function(code)();
    expect(document.documentElement.dataset.theme).toBe('dark');
    localStorage.clear();
    new Function(renderToStaticMarkup(createElement(ThemeScript, { defaultTheme: 'dark', storageKey: 'k' })).replace(/^<script>|<\/script>$/g, ''))();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
  it('ThemeScript: storageKey не может закрыть тег script', () => {
    const html = renderToStaticMarkup(<ThemeScript storageKey={'</script><b>'} />);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });
  it('ThemeScript переживает закрытое хранилище', () => {
    const g = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    const code = renderToStaticMarkup(<ThemeScript />).replace(/^<script>|<\/script>$/g, '');
    expect(() => new Function(code)()).not.toThrow();
    g.mockRestore();
  });
});

describe('метки и ограничения', () => {
  it('каждый компонент 15–24 помечен __sloyka с номером и группой', () => {
    const expected: Array<[any, string, string]> = [
      [PageHeader, '15', 'PageHeader'], [Toolbar, '15', 'Toolbar'], [Toolbar.End, '15', 'Toolbar.End'], [Topbar, '16', 'Topbar'],
      [StatusBar, '17', 'StatusBar'], [DockButton, '17', 'DockButton'], [Menu, '18', 'Menu'], [Menu.Item, '18', 'Menu.Item'],
      [Menu.Separator, '18', 'Menu.Separator'], [Picker, '19', 'Picker'], [Tile, '19', 'Tile'], [Window, '20', 'Window'],
      [Modal, '21', 'Modal'], [ToastProvider, '22', 'ToastProvider'], [Tooltip, '22', 'Tooltip'], [Login, '23', 'Login'],
      [Nav, '24', 'Nav'], [Nav.Section, '24', 'Nav.Section'], [Nav.Item, '24', 'Nav.Item'], [Shell, '24', 'Shell'],
      [ThemeProvider, '00', 'ThemeProvider'], [ThemeToggle, '00', 'ThemeToggle'], [ThemeScript, '00', 'ThemeScript'],
    ];
    for (const [C, n, name] of expected) {
      expect(C.__sloyka.n).toBe(n);
      expect(C.__sloyka.name).toBe(name);
    }
    expect(Modal.__sloyka.group).toBe('Модальное окно');
    expect(Shell.__sloyka.group).toBe('Боковое меню: полное и рейл');
    expect(ThemeProvider.__sloyka.group).toBe('Основа');
  });
  it('className, style и rest не попадают в разметку', () => {
    const { container } = render(<Menu {...({ className: 'evil', style: { color: 'red' }, id: 'x' } as any)}><Menu.Item>a</Menu.Item></Menu>);
    expect(container.innerHTML).not.toContain('evil');
    expect(container.innerHTML).not.toContain('style=');
    expect(container.querySelector('#x')).toBeNull();
  });
  it('готовая серверная разметка sl-* внутри контейнера не вызывает предупреждений', () => {
    render(<Menu><div className="sl-menu__item">готовый пункт</div></Menu>);
    expect(warn).not.toHaveBeenCalled();
  });
  it('Page рядом с Shell: нет вложенных main', () => {
    const { container } = render(<Shell topbar={<Topbar brand={{ mark: 'S', name: 'S' }} />} nav={<Nav />}><Page>x</Page></Shell>);
    expect(container.querySelectorAll('main')).toHaveLength(1);
  });
  it('Switch и Count допустимы в Toolbar без предупреждений', () => {
    render(<Toolbar><Switch>Вкл</Switch></Toolbar>);
    expect(warn).not.toHaveBeenCalled();
    void Count; void Status;
  });
});
