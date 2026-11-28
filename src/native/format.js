// Оформление нативной разметки: общий код для scripts/gen-native.js и панели «Код» в Storybook.
// Чистый JS без зависимостей (работает и в Node, и в браузере).

export const slug = (name) => name.replace(/\./g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

/** id из useId (`«r0»`, `_R_…_`, `:r0:`) → читаемые `sl-id-1`, одинаковые на каждой сборке. */
export function normalizeIds(html) {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).filter((v) => /[«»:]|^_r_/i.test(v));
  let out = html;
  [...new Set(ids)].forEach((raw, i) => { out = out.split(raw).join(`sl-id-${i + 1}`); });
  return out;
}

const INLINE = new Set(['span', 'strong', 'b', 'i', 'em', 'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'code', 'small', 'input', 'img', 'br']);

const isInlineLine = (l) => { const t = l.trim().match(/^<\/?([a-zA-Z0-9-]+)/)?.[1]; return !t || INLINE.has(t.toLowerCase()); };

/** Простое оформление: блочные теги с новой строки и отступом, строчные — внутри строки. */
export function formatHtml(html) {
  const tokens = html.match(/<[^>]+>|[^<]+/g) ?? [];
  const lines = [];
  let depth = 0;
  let line = '';
  let inlineDepth = 0;
  const flush = () => { if (line.trim()) lines.push('  '.repeat(depth) + line.trim()); line = ''; };
  for (const t of tokens) {
    const m = t.match(/^<\/?([a-zA-Z0-9-]+)/);
    const tag = m?.[1].toLowerCase();
    const closing = t.startsWith('</');
    const selfClose = t.endsWith('/>') || ['input', 'img', 'br', 'hr', 'meta', 'link'].includes(tag ?? '');
    if (!tag || INLINE.has(tag) || inlineDepth > 0) {
      line += t;
      if (tag === 'svg' && !closing && !selfClose) inlineDepth++;
      if (tag === 'svg' && closing) inlineDepth--;
      continue;
    }
    if (closing) { flush(); depth = Math.max(0, depth - 1); lines.push('  '.repeat(depth) + t); continue; }
    flush();
    lines.push('  '.repeat(depth) + t);
    if (!selfClose) depth++;
  }
  flush();
  // «<tag>текст</tag>» без вложенных блоков — в одну строку
  const joined = [];
  for (let i = 0; i < lines.length; i++) {
    const a = lines[i], b = lines[i + 1], c = lines[i + 2];
    const tag = a.trim().match(/^<([a-zA-Z0-9-]+)/)?.[1];
    if (tag && c !== undefined && !a.trim().endsWith('/>') && c.trim() === `</${tag}>` && isInlineLine(b)) {
      joined.push(a + b.trim() + c.trim()); i += 2; continue;
    }
    if (tag && b !== undefined && b.trim() === `</${tag}>`) { joined.push(a + b.trim()); i += 1; continue; }
    joined.push(a);
  }
  return joined.join('\n');
}


/** Скрипт компонента по признаку в разметке: какие файлы sloyka/native/*.js нужны фрагменту. */
export const SCRIPT_MARKERS = [
  ['modal.js', /class="sl-modal[\s"]/],
  ['menu.js', /sl-menu__trigger/],
  ['theme.js', /data-sl-theme-toggle/],
  ['group.js', /class="sl-group[\s"]/],
  ['tooltip.js', /sl-tooltip-host/],
  ['segmented.js', /class="sl-segmented[\s"]/],
  ['compose.js', /class="sl-compose[\s"]/],
  ['shell.js', /class="sl-shell[\s"]/],
  ['window.js', /sl-window__head[^]*?aria-label="Закрыть"/],
];
export const scriptsFor = (html) => SCRIPT_MARKERS.filter(([, re]) => re.test(html)).map(([f]) => f);

/**
 * Разметка живого примера (DOM в Storybook) → нативный фрагмент: обёртки витрины без классов sl-*
 * снимаются, снимок модального окна (<div role="dialog" class="sl-modal">) снова становится <dialog>.
 */
export function snippetFromDom(root) {
  const copy = root.cloneNode(true);
  const isSl = (el) => [...el.classList].some((c) => c.startsWith('sl-'));
  for (const el of [...copy.querySelectorAll('*')].reverse()) {
    if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
    if (!isSl(el) && (el.hasAttribute('class') || (el.hasAttribute('style') && !/^(width:|--c:)/.test(el.getAttribute('style'))))) {
      el.replaceWith(...el.childNodes);
      continue;
    }
    if (el.matches('div.sl-modal[role="dialog"]')) {
      const d = el.ownerDocument.createElement('dialog');
      for (const a of el.attributes) if (a.name !== 'role') d.setAttribute(a.name, a.value);
      d.append(...el.childNodes);
      el.replaceWith(d);
    }
  }
  return formatHtml(normalizeIds(copy.innerHTML.replace(/<!--[^]*?-->/g, '')));
}
