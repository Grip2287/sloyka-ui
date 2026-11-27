// Статичные снимки в Storybook (.storybook/static.tsx) должны совпадать по разметке с живыми компонентами.
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { useEffect } from 'react';
import { Modal, ToastProvider, useToast, Button, Field } from '../../../src/react';
import { StaticModal, StaticToast } from '../../../.storybook/static';

afterEach(cleanup);

/** Разметка без id-связок (у каждого экземпляра свой useId) и без признаков верхнего слоя. */
function norm(el: Element): string {
  const c = el.cloneNode(true) as Element;
  const walk = (e: Element): string => {
    const tag = e.tagName.toLowerCase() === 'dialog' ? 'div' : e.tagName.toLowerCase();
    const attrs = [...e.attributes]
      .filter((a) => !['id', 'aria-labelledby', 'open', 'role'].includes(a.name))
      .map((a) => `${a.name}="${a.value}"`).sort().join(' ');
    const kids = [...e.childNodes].map((n) => (n.nodeType === 1 ? walk(n as Element) : n.textContent)).join('');
    return `<${tag}${attrs ? ' ' + attrs : ''}>${kids}</${tag}>`;
  };
  return walk(c);
}

describe('StaticModal повторяет открытый Modal', () => {
  it('голова, тело, низ, кнопка «Закрыть»', () => {
    const footer = <><Button variant="ghost">Отмена</Button><Button variant="primary">Добавить</Button></>;
    render(<Modal title="Новое устройство" defaultOpen footer={footer}><Field label="Название" /></Modal>);
    const live = document.querySelector('dialog.sl-modal')!;
    const { container } = render(<StaticModal title="Новое устройство" footer={footer}><Field label="Название" /></StaticModal>);
    const still = container.querySelector('.sl-modal')!;
    expect(still.getAttribute('role')).toBe('dialog');
    expect(still.getAttribute('aria-labelledby')).toBe(still.querySelector('.sl-modal__title')!.id);
    // id поля внутри Field тоже из useId: сравниваем без них
    expect(norm(still).replace(/(aria-describedby|for)="[^"]*"/g, '')).toBe(norm(live).replace(/(aria-describedby|for)="[^"]*"/g, ''));
  });
});

describe('StaticToast повторяет уведомление из useToast', () => {
  for (const kind of ['ok', 'warn', 'crit', 'info'] as const) {
    it(kind, () => {
      const Show = () => {
        const toast = useToast();
        useEffect(() => { toast[kind]('Камера КПП-2 появится на карте.', { title: 'Устройство добавлено', duration: 0 }); }, [toast]);
        return null;
      };
      act(() => { render(<ToastProvider><Show /></ToastProvider>); });
      const live = document.querySelector('.sl-toast-region .sl-toast')!;
      const { container } = render(<StaticToast kind={kind} title="Устройство добавлено" text="Камера КПП-2 появится на карте." />);
      const still = container.querySelector('.sl-toast')!;
      expect(still.outerHTML).toBe(live.outerHTML);
    });
  }
  it('без текста заголовок один', () => {
    const Show = () => {
      const toast = useToast();
      useEffect(() => { toast.ok('Сохранено'); }, [toast]);
      return null;
    };
    act(() => { render(<ToastProvider><Show /></ToastProvider>); });
    const live = document.querySelector('.sl-toast-region .sl-toast')!;
    const { container } = render(<StaticToast kind="ok" title="Сохранено" />);
    expect(container.querySelector('.sl-toast')!.outerHTML).toBe(live.outerHTML);
  });
});
