'use client';
import { createContext, type MouseEventHandler, type RefObject } from 'react';

/** Внутренняя связь Shell, Topbar и Nav: кнопка меню, состояние и закрытие по пункту. */
export interface ShellState {
  open: boolean;
  navId: string;
  toggleRef: RefObject<HTMLButtonElement | null>;
  toggle: MouseEventHandler<HTMLButtonElement>;
  close: () => void;
}

export const ShellContext = createContext<ShellState | null>(null);
