'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { defineMeta } from '../../core';
import { Icon } from '../../icons';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeState {
  theme: ThemeChoice;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeChoice) => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

/** Хук темы: `{ theme, resolvedTheme, setTheme }`. Работает внутри <ThemeProvider>. */
export function useTheme(): ThemeState {
  const state = useContext(ThemeContext);
  if (!state) throw new Error('Sloyka · useTheme: оберните приложение в <ThemeProvider>');
  return state;
}

const isChoice = (v: unknown): v is 'light' | 'dark' => v === 'light' || v === 'dark';

export interface ThemeProviderProps {
  defaultTheme?: ThemeChoice;
  /** Ключ в localStorage. */
  storageKey?: string;
  children?: ReactNode;
}

function ThemeProviderImpl({ defaultTheme = 'system', storageKey = 'sl-theme', children }: ThemeProviderProps) {
  // На сервере и при первой отрисовке тема = defaultTheme: разметка не зависит от хранилища, гидрация не расходится.
  const [theme, setThemeState] = useState<ThemeChoice>(defaultTheme);
  const [ready, setReady] = useState(false);
  const [system, setSystem] = useState<ResolvedTheme>('light');

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(storageKey); } catch { /* хранилище закрыто */ }
    if (isChoice(saved)) setThemeState(saved);
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    const mq = globalThis.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const sync = () => setSystem(mq.matches ? 'dark' : 'light');
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    if (theme === 'system') delete root.dataset.theme; else root.dataset.theme = theme;
  }, [theme, ready]);

  const setTheme = useCallback((next: ThemeChoice) => {
    setThemeState(next);
    try {
      if (next === 'system') localStorage.removeItem(storageKey); else localStorage.setItem(storageKey, next);
    } catch { /* тема просто не запомнится */ }
  }, [storageKey]);

  const resolvedTheme: ResolvedTheme = theme === 'system' ? system : theme;
  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export const ThemeProvider = defineMeta(ThemeProviderImpl, {
  n: '00', group: 'Основа', name: 'ThemeProvider', allowed: 'any',
  props: {
    defaultTheme: { type: 'enum', options: ['light', 'dark', 'system'], default: 'system' },
    storageKey: { type: 'string', default: 'sl-theme' },
  },
});

function ThemeToggleImpl() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  return (
    <button
      type="button" className="sl-btn sl-btn--sm sl-btn--icon" aria-label="Тёмная тема" aria-pressed={dark}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  );
}
export const ThemeToggle = defineMeta(ThemeToggleImpl, {
  n: '00', group: 'Основа', name: 'ThemeToggle', allowed: 'none', props: {},
});
