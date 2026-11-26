// Быстрый автоматический разбор референса → черновик темы для шаблона.
// Сайт открывается в headless Chromium (Playwright), берутся реальные вычисленные стили.
import { THEME_DEFAULTS } from './template-store.js';

export function toHex(c) {
  if (!c) return null;
  const s = String(c).trim();
  const short = s.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (short) return ('#' + short.slice(1).map(x => x + x).join('')).toLowerCase();
  if (/^#[0-9a-f]{6}$/i.test(s)) return s.toLowerCase();
  const m = s.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/i);
  if (!m || (m[4] !== undefined && Number(m[4]) < 0.5)) return null;
  return '#' + m.slice(1, 4).map(v => Number(v).toString(16).padStart(2, '0')).join('');
}

const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const mix = (hex, to, k) => '#' + rgb(hex).map((v, i) => Math.round(v + (to[i] - v) * k).toString(16).padStart(2, '0')).join('');
const lum = hex => {
  const c = rgb(hex).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const clamp = (v, lo, hi, d) => (Number.isFinite(Number(v)) ? Math.min(hi, Math.max(lo, Math.round(Number(v)))) : d);

/** Факты со страницы → значения редактора темы (светлая и тёмная стороны). */
export function themeFromFacts(f = {}) {
  const t = { ...THEME_DEFAULTS };
  const bg = toHex(f.bg);
  const accent = toHex(f.accent);
  const dark = bg ? lum(bg) < 0.2 : false;
  if (bg) { if (dark) t.bgDark = bg; else t.bgLight = bg; }
  if (accent) {
    if (dark) { t.accentDark = accent; t.accentLight = lum(accent) > 0.18 ? mix(accent, [0, 0, 0], 0.35) : accent; }
    else { t.accentLight = accent; t.accentDark = lum(accent) < 0.18 ? mix(accent, [255, 255, 255], 0.45) : accent; }
  }
  t.radius = clamp(f.radius, 0, 16, t.radius);
  t.fontSize = clamp(f.fontSize, 12, 16, t.fontSize);
  t.controlHeight = clamp(Math.round((Number(f.controlHeight) || t.controlHeight) / 2) * 2, 28, 44, t.controlHeight);
  return t;
}

/** Открывает страницу и читает стили. shot — путь для скриншота (необязательно). */
export async function analyzeUrl(url, { shot } = {}) {
  const { chromium } = await import('@playwright/test');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => page.waitForLoadState('domcontentloaded'));
    if (shot) await page.screenshot({ path: shot, fullPage: false }).catch(() => {});
    return await page.evaluate(() => {
      const cs = el => getComputedStyle(el);
      const opaque = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return false; const p = m[1].split(/[,\s/]+/).filter(Boolean); return p.length < 4 || Number(p[3]) > 0.5; };
      const sat = c => { const [r, g, b] = c.match(/\d+/g).slice(0, 3).map(Number); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx ? (mx - mn) / mx : 0; };
      let bg = cs(document.body).backgroundColor;
      if (!opaque(bg)) bg = cs(document.documentElement).backgroundColor;
      if (!opaque(bg)) bg = 'rgb(255, 255, 255)';
      const visible = el => { const r = el.getBoundingClientRect(); return r.width > 20 && r.height > 16 && r.top < 3000; };
      const btns = [...document.querySelectorAll('button, a, [role=button], input[type=submit], input[type=button]')].filter(visible);
      const filled = btns.filter(b => opaque(cs(b).backgroundColor) && cs(b).backgroundColor !== bg);
      const primary = filled.find(b => /primary|accent|cta|main/i.test(b.className)) ||
        filled.sort((a, b) => sat(cs(b).backgroundColor) - sat(cs(a).backgroundColor))[0];
      const input = [...document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), select, textarea')].find(visible);
      const px = v => parseFloat(v) || 0;
      const ctl = primary || input;
      return {
        bg,
        text: cs(document.body).color,
        accent: primary ? cs(primary).backgroundColor : null,
        radius: ctl ? px(cs(ctl).borderTopLeftRadius) : null,
        fontSize: px(cs(document.body).fontSize),
        controlHeight: ctl ? Math.round(ctl.getBoundingClientRect().height) : null,
        font: cs(document.body).fontFamily,
        title: document.title,
      };
    });
  } finally {
    await browser.close();
  }
}
