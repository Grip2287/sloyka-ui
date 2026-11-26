// «Все шаблоны»: галерея сохранённых шаблонов с мини-превью в обеих темах.
import { COMPONENTS, themeCSS, componentCSS, templateCSS, saveDraft } from '../../.storybook/template-store.js';
import { slHydrateIcons } from '../icons.js';
import { toast } from '../components/toast/toast.js';

const HIDE = { table: { disable: true } };
const API = '/__sloyka/templates';
const TEMPLATE_STORY = '/?path=/story/основа-мой-шаблон--template';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export default {
  title: 'Основа/Все шаблоны',
  argTypes: { slScale: HIDE, slRadius: HIDE },
  parameters: { pair: false, docs: { description: { component: 'Все сохранённые шаблоны рядом: превью в светлой и тёмной теме, откуда шаблон взялся, кнопки «Открыть», «Скопировать CSS», «Удалить».' } } },
};

// маленький кусочек панели — хватает, чтобы сравнить шаблоны глазами
const MINI = `
  <div class="row"><button class="sl-btn sl-btn--primary sl-btn--sm" tabindex="-1">Сохранить</button><button class="sl-btn sl-btn--sm" tabindex="-1">Отмена</button><span class="sl-tag">Админ</span></div>
  <input class="sl-input" placeholder="Поиск" tabindex="-1" aria-label="Поиск">
  <article class="sl-card" data-accent="ok" style="padding:12px 14px;gap:8px"><div class="sl-card__head"><div class="sl-card__title">Камера КПП-1</div></div><span class="sl-status sl-status--ok">На связи</span></article>`;

const scopeCSS = (t, cls) => [
  t.draft?.theme ? themeCSS(t.draft.theme, { light: `.${cls}[data-theme="light"]`, dark: `.${cls}[data-theme="dark"]`, root: `.${cls}`, media: false }) : '',
  ...Object.entries(t.draft?.components || {}).map(([k, v]) => componentCSS(k, v, `.${cls} `)),
].filter(Boolean).join('\n');

function summary(d = {}) {
  const parts = [];
  if (d.theme) parts.push(`тема: скругление ${d.theme.radius}px, текст ${d.theme.fontSize}px`);
  const comps = Object.keys(d.components || {});
  if (comps.length) parts.push(`компоненты: ${comps.map(k => (COMPONENTS[k]?.label || k).replace(/^\d+ · /, '')).join(', ')}`);
  return parts.join(' · ') || 'без изменений';
}

function view(root, st) {
  const styles = st.items.map((t, i) => scopeCSS(t, `g-${i}`)).join('\n');
  root.innerHTML = `<style>${styles}</style><div class="col" style="gap:20px">
    <div class="sl-page-head"><h1 class="sl-page-title">Все шаблоны</h1><span class="lbl">${st.apiOk ? `${st.items.length} шт. · папка templates/` : 'Список доступен в <code>npm run storybook</code>'}</span></div>
    ${st.items.length ? `<div class="sl-grid" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,420px),1fr))">${st.items.map((t, i) => `
      <article class="sl-card" data-tpl="${esc(t.slug)}">
        <div class="sl-card__head"><div><div class="sl-card__title">${esc(t.name)}</div><div class="sl-card__sub">templates/${esc(t.slug)}.css</div></div>${t.ref ? `<span class="sl-tag" title="Создан из референса">из «${esc(t.ref)}»</span>` : ''}</div>
        <div class="g2">
          <div class="sl-root g-${i}" data-theme="light" style="display:grid;gap:8px;padding:12px;border-radius:var(--sl-r-md);background:var(--sl-bg);border:1px solid var(--sl-border-soft)">${MINI}</div>
          <div class="sl-root g-${i}" data-theme="dark" style="display:grid;gap:8px;padding:12px;border-radius:var(--sl-r-md);background:var(--sl-bg);border:1px solid var(--sl-border-soft)">${MINI}</div>
        </div>
        <dl class="sl-kv"><dt>Что внутри</dt><dd>${esc(summary(t.draft))}</dd><dt>Сохранён</dt><dd>${t.savedAt ? new Date(t.savedAt).toLocaleString('ru-RU') : '—'}</dd></dl>
        <div class="sl-card__foot"><div class="row">
          <button class="sl-btn sl-btn--sm sl-btn--primary" data-open="${esc(t.slug)}"><i data-ic="edit"></i>Открыть в «Мой шаблон»</button>
          <button class="sl-btn sl-btn--sm" data-copy="${esc(t.slug)}">Скопировать CSS</button>
          <button class="sl-btn sl-btn--sm sl-btn--ghost sl-btn--danger" data-del="${esc(t.slug)}" aria-label="Удалить ${esc(t.name)}"><i data-ic="x"></i>Удалить</button>
        </div></div>
      </article>`).join('')}</div>`
      : `<div class="sl-empty sl-dropzone"><i data-ic="layers"></i><div class="sl-empty__title">Шаблонов пока нет</div><div>Соберите шаблон в «Основа → Мой шаблон» и нажмите «Сохранить в библиотеку» — или добавьте референс: шаблон с его названием создастся сам.</div></div>`}
  </div>`;
  slHydrateIcons(root);
}

export const All = {
  name: 'Все шаблоны',
  render: () => {
    const root = document.createElement('div');
    const st = { apiOk: false, items: [] };
    const json = r => (r.ok && (r.headers.get('content-type') || '').includes('json') ? r.json() : null);

    const load = async () => {
      const list = await fetch(API).then(json).catch(() => null);
      if (!Array.isArray(list)) return view(root, st);
      const refs = (await fetch('/__sloyka/references').then(json).catch(() => null)) || [];
      const refOf = Object.fromEntries(refs.filter(r => r.template).map(r => [r.template.slug, r.name]));
      const full = await Promise.all(list.map(t => fetch(`${API}/${t.slug}`).then(json).catch(() => null)));
      st.apiOk = true;
      st.items = full.filter(Boolean).map(t => ({ ...t, ref: refOf[t.slug] })).sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
      view(root, st);
    };

    root.addEventListener('click', async e => {
      const b = e.target.closest('button');
      if (!b) return;
      const t = st.items.find(x => x.slug === (b.dataset.open || b.dataset.copy || b.dataset.del));
      if (!t) return;
      if (b.dataset.open) { saveDraft({ ...t.draft, name: t.name }); window.open(TEMPLATE_STORY, '_blank', 'noopener'); }
      else if (b.dataset.copy) { await navigator.clipboard?.writeText(templateCSS(t.draft, t.name)); toast('CSS скопирован', { type: 'ok', duration: 2500 }); }
      else if (b.dataset.del) {
        if (!confirm(`Удалить шаблон «${t.name}»? Файлы templates/${t.slug}.css и .json будут удалены. Отменить это нельзя.`)) return;
        const r = await fetch(`${API}/${t.slug}`, { method: 'DELETE' });
        if (r.ok) { toast(`«${t.name}» удалён`, { type: 'ok', duration: 2500 }); await load(); }
        else toast('Не удалось удалить', { type: 'crit' });
      }
    });

    view(root, st);
    load();
    return root;
  },
};
