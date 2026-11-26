// Читает значения --sl-* из src/tokens/theme.css для светлой и тёмной темы.
import { readFileSync } from 'node:fs';
export function readTheme(theme) {
  const css = readFileSync('src/tokens/theme.css', 'utf8');
  const sel = theme === 'light' ? /:root,\s*\[data-theme="light"\]\s*\{([^}]*)\}/ : /\[data-theme="dark"\]\s*\{([^}]*)\}/;
  const body = css.match(sel)?.[1] ?? '';
  return Object.fromEntries([...body.matchAll(/--sl-([\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
}
const lin = c => (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const lum = hex => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
export function contrast(a, b) { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }
