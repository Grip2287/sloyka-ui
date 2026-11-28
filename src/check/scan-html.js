// Проверка нативной вёрстки (.html): страница собирается из разметки нативных компонентов Sloyka
// (native/*.html) и стилей sloyka/dist/styles.css. Без внешних зависимостей: простой разбор тегов.
import { scanCss } from './scan-css.js';
import {
  nativeUnknownClassMessage, nativeOwnClassMessage, nativeStyleMessage, nativeOwnTagMessage, nativeSlotMessage,
  nativeStyleTagMessage, nativeAssetMessage, NATIVE_STYLE_ALLOWED,
} from './rules.js';

/** Теги уровня документа: без классов и вне компонентов. */
const DOCUMENT_TAGS = new Set(['html', 'head', 'body', 'title', 'meta', 'link', 'script', 'style', 'noscript', 'template', 'base']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
/**
 * Классы-«слоты»: внутрь кладутся компоненты Sloyka целиком. Элемент без класса прямо в слоте —
 * это своя вёрстка (например, <p> или <div> вместо Text и Stack). «тег.класс» — слот только у этого тега
 * (sl-card у <article> — карточка Card; у LinkCard тот же класс, но внутри своя разметка).
 */
export const SLOT_CLASSES = new Set([
  'sl-stack', 'sl-grid', 'sl-rpage', 'sl-form', 'sl-shell__main', 'sl-modal__body', 'sl-modal__foot', 'article.sl-card', 'sl-card__foot',
  'sl-window__body', 'sl-window__foot', 'sl-window__bar', 'sl-disclosure__body', 'sl-toolbar', 'sl-toolbar__end', 'sl-topbar__end',
  'sl-btn-group', 'sl-page-head__aside', 'sl-banner', 'sl-list', 'sl-picker__grid', 'sl-nav',
]);
const ATTR = /([^\s=/"'>]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g;
const TOKEN = /<!--[\s\S]*?-->|<(script|style)\b([^>]*)>([\s\S]*?)<\/\1\s*>|<\/?([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;

const slotOf = (tag, classes) => classes.find((c) => SLOT_CLASSES.has(c) || SLOT_CLASSES.has(`${tag}.${c}`));
const unquote = (v) => (v && /^["']/.test(v) ? v.slice(1, -1) : v ?? '');
function attrsOf(text) {
  const out = new Map();
  ATTR.lastIndex = 0;
  for (let m; (m = ATTR.exec(text)); ) out.set(m[1].toLowerCase(), unquote(m[2]));
  return out;
}

/**
 * known: { classes: Set (все классы из styles.css), tags: Set (теги из нативных фрагментов) }.
 * scanJs(source, line) — проверка встроенного <script> (правила JS), возвращает hits со строками от 1.
 * Возвращает [{ rule, line, message }].
 */
export function scanHtml(source, known, scanJs) {
  const hits = [];
  const lineAt = (i) => (source.slice(0, i).match(/\n/g) || []).length + 1;
  const stack = []; // { tag, sl: boolean, slot: boolean, classes: string[] }
  const add = (rule, line, message) => hits.push({ rule, line, message });
  TOKEN.lastIndex = 0;
  for (let m; (m = TOKEN.exec(source)); ) {
    if (m[0].startsWith('<!--')) continue;
    const line = lineAt(m.index);
    if (m[1]) {
      const kind = m[1].toLowerCase();
      const attrs = attrsOf(m[2]);
      const body = m[3];
      const bodyLine = lineAt(m.index + m[0].indexOf('>') + 1);
      if (kind === 'style') {
        for (const h of scanCss(body)) add(h.rule, bodyLine + h.line - 1, h.message);
        add('native-no-style-tag', line, nativeStyleTagMessage());
      } else {
        const src = attrs.get('src');
        if (src) { const msg = nativeAssetMessage(src); if (msg) add('no-deep-imports', line, msg); }
        const type = (attrs.get('type') || '').toLowerCase();
        if (!src && body.trim() && scanJs && (!type || type === 'module' || type === 'text/javascript'))
          for (const h of scanJs(body)) add(h.rule, bodyLine + h.line - 1, h.message);
      }
      continue;
    }
    const tag = m[4].toLowerCase();
    if (m[0].startsWith('</')) {
      const at = stack.map((e) => e.tag).lastIndexOf(tag);
      if (at >= 0) stack.length = at;
      continue;
    }
    const attrs = attrsOf(m[5]);
    const classes = (attrs.get('class') || '').split(/\s+/).filter(Boolean);
    const insideSvg = stack.some((e) => e.tag === 'svg');
    if (tag === 'link') {
      const href = attrs.get('href');
      const msg = href && nativeAssetMessage(href);
      if (msg) add('no-deep-imports', line, msg);
    }
    if (!DOCUMENT_TAGS.has(tag) && !insideSvg) {
      for (const c of classes) {
        if (known.classes.has(c)) continue;
        if (c.startsWith('sl-')) add('native-unknown-class', line, nativeUnknownClassMessage(c));
        else add('native-own-class', line, nativeOwnClassMessage(c));
      }
      const style = attrs.get('style');
      if (attrs.has('style') && !NATIVE_STYLE_ALLOWED.test(`style="${style}"`)) add('native-no-inline-style', line, nativeStyleMessage());
      if (!known.tags.has(tag)) add('native-own-tag', line, nativeOwnTagMessage(tag));
      else if (!classes.some((c) => c.startsWith('sl-'))) {
        const parent = [...stack].reverse().find((e) => !DOCUMENT_TAGS.has(e.tag) || e.tag === 'body');
        if (!parent || parent.tag === 'body' || parent.slot) add('native-own-tag', line, nativeSlotMessage(tag, parent?.slot ?? null));
      }
    }
    const selfClose = VOID.has(tag) || /\/\s*$/.test(m[5]);
    if (!selfClose) stack.push({ tag, classes, slot: slotOf(tag, classes) });
  }
  return hits;
}
