import { defineMeta } from '../../core';
import type { ThemeChoice } from './Theme';

export interface ThemeScriptProps {
  /** Те же значения, что у ThemeProvider. */
  defaultTheme?: ThemeChoice;
  storageKey?: string;
}

/** Строка скрипта: ставит сохранённую тему до отрисовки, без зависимостей. */
export function themeScriptSource(storageKey = 'sl-theme', defaultTheme: ThemeChoice = 'system'): string {
  const k = JSON.stringify(storageKey);
  const d = JSON.stringify(defaultTheme);
  return `(function(){try{var t=localStorage.getItem(${k});if(t!=='light'&&t!=='dark')t=${d};if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;else delete document.documentElement.dataset.theme}catch(e){}})()`;
}

/** Кладётся в <head>: тема применяется до первой отрисовки, без мигания. Без хуков, безопасен на сервере. */
function ThemeScriptImpl({ defaultTheme, storageKey }: ThemeScriptProps) {
  return <script dangerouslySetInnerHTML={{ __html: themeScriptSource(storageKey, defaultTheme) }} />;
}
export const ThemeScript = defineMeta(ThemeScriptImpl, {
  n: '00', group: 'Основа', name: 'ThemeScript', allowed: 'none',
  props: {
    defaultTheme: { type: 'enum', options: ['light', 'dark', 'system'], default: 'system' },
    storageKey: { type: 'string', default: 'sl-theme' },
  },
});
