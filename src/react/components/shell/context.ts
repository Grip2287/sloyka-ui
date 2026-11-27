'use client';
import { createContext, type RefObject } from 'react';

/** Внутренняя связь Shell, Topbar и Nav: кнопка меню, состояние и закрытие по пункту. */
export interface ShellState {
  open: boolean;
  navId: string;
  toggleRef: RefObject<HTMLAnchorElement | null>;
  toggle: () => void;
  close: () => void;
}

export const ShellContext = createContext<ShellState | null>(null);
