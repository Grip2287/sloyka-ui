import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Menu } from '../../../src/react';

afterEach(cleanup);

const account = (props: Record<string, unknown> = {}, onExit = vi.fn()) => (
  <Menu header={{ name: 'Оператор', role: 'Смена 2' }} trigger={{ label: 'Меню аккаунта', initials: 'ОП' }} {...props}>
    <Menu.Item icon="user">Профиль</Menu.Item>
    <Menu.Separator />
    <Menu.Item icon="power" danger onClick={onExit}>Выйти</Menu.Item>
  </Menu>
);

describe('Menu with trigger', () => {
  it('without trigger stays a static panel (0.1 behaviour)', () => {
    const html = renderToStaticMarkup(<Menu><Menu.Item>Профиль</Menu.Item></Menu>);
    expect(html.startsWith('<div class="sl-menu">')).toBe(true);
    expect(html).not.toContain('aria-haspopup');
  });

  it('renders a closed trigger with initials and ARIA', () => {
    render(account());
    const btn = screen.getByRole('button', { name: /^Меню аккаунта/ });
    expect(btn.getAttribute('aria-haspopup')).toBe('menu');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.textContent).toContain('ОП');
    expect(screen.queryByText('Профиль')).toBeNull();
  });

  it('opens on click, panel is linked to the trigger', () => {
    render(account());
    const btn = screen.getByRole('button', { name: /^Меню аккаунта/ });
    fireEvent.click(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    const panel = document.getElementById(btn.getAttribute('aria-controls')!);
    expect(panel?.className).toContain('sl-menu--popover');
    expect(screen.getByText('Профиль')).toBeTruthy();
  });

  it('Esc closes and returns focus to the trigger', () => {
    render(account());
    const btn = screen.getByRole('button', { name: /^Меню аккаунта/ });
    fireEvent.click(btn);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(btn);
  });

  it('pointerdown outside closes, inside does not', () => {
    render(<div><span data-testid="out">вне</span>{account()}</div>);
    const btn = screen.getByRole('button', { name: /^Меню аккаунта/ });
    fireEvent.click(btn);
    fireEvent.pointerDown(screen.getByText('Профиль'));
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    fireEvent.pointerDown(screen.getByTestId('out'));
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('item click runs its handler and closes the menu', () => {
    const onExit = vi.fn();
    render(account({}, onExit));
    const btn = screen.getByRole('button', { name: /^Меню аккаунта/ });
    fireEvent.click(btn);
    fireEvent.click(screen.getByText('Выйти'));
    expect(onExit).toHaveBeenCalledOnce();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('controlled: follows open and asks via onOpenChange', () => {
    const onOpenChange = vi.fn();
    render(account({ open: true, onOpenChange }));
    const btn = screen.getByRole('button', { name: /^Меню аккаунта/ });
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(btn);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('without initials shows the user icon', () => {
    render(<Menu trigger={{ label: 'Аккаунт' }}><Menu.Item>Профиль</Menu.Item></Menu>);
    expect(screen.getByRole('button', { name: 'Аккаунт' }).querySelector('svg')).toBeTruthy();
  });
  it('видимые инициалы входят в имя кнопки (WCAG 2.5.3)', () => {
    render(<Menu trigger={{ label: 'Меню аккаунта', initials: 'ОП' }}><Menu.Item>Выйти</Menu.Item></Menu>);
    expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Меню аккаунта, ОП');
    cleanup();
    render(<Menu trigger={{ label: 'Меню аккаунта' }}><Menu.Item>Выйти</Menu.Item></Menu>);
    expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Меню аккаунта');
  });
});
