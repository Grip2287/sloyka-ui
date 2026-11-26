// «Мой шаблон»: все примерки в одном месте — поправить, удалить, посмотреть вживую,
// скопировать CSS или сохранить в библиотеку как «Шаблон 1», «Шаблон 2»…
import { COMPONENTS, THEME_DEFAULTS, themeCSS, componentCSS, templateCSS, slugify, loadDraft, saveDraft } from '../../.storybook/template-store.js';
import { SAMPLE } from '../../.storybook/sample.js';
import { slHydrateIcons } from '../icons.js';
import { toast } from '../components/toast/toast.js';

const HIDE = { table: { disable: true } };
const API = '/__sloyka/templates';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export default {
  title: 'Основа/Мой шаблон',
  argTypes: { slScale: HIDE, slRadius: HIDE },
  parameters: {
    pair: false,
    docs: { description: { component: 'Сюда попадает всё, что вы добавили кнопкой «＋ В шаблон». Правьте значения, удаляйте лишнее и сохраняйте шаблон в библиотеку.' } },
  },
};

const THEME_FIELDS = [
  ['accentLight', 'Главный цвет · светлая', 'color'], ['accentDark', 'Главный цвет · тёмная', 'color'],
  ['bgLight', 'Фон · светлая', 'color'], ['bgDark', 'Фон · тёмная', 'color'],
  ['radius', 'Скругление, px', 'number'], ['fontSize', 'Текст, px', 'number'], ['controlHeight', 'Высота кнопок, px', 'number'],
];

function view(root, state) {
  const d = state.draft;
  const comps = Object.entries(d.components || {});
  const free = Object.keys(COMPONENTS).filter(k => !(d.components || {})[k]);
  const scopedTheme = d.theme ? themeCSS(d.theme, { light: '.sb-tpl-preview[data-theme="light"]', dark: '.sb-tpl-preview[data-theme="dark"]', root: '.sb-tpl-preview', media: false }) : '';
  const scopedComps = comps.map(([k, v]) => componentCSS(k, v, '.sb-tpl-preview ')).filter(Boolean).join('\n');
  const css = templateCSS(d, state.name);
  const empty = !d.theme && !comps.length;

  root.innerHTML = `
  <style>${scopedTheme}\n${scopedComps}</style>
  <div class="col" style="gap:20px">
    <div class="sl-page-head"><h1 class="sl-page-title">Мой шаблон</h1><span class="lbl">${state.apiOk ? 'Сохранение в библиотеку доступно' : 'Сохранение в библиотеку работает только в <code>npm run storybook</code>'}</span></div>
    <div class="sl-toolbar">
      <label class="sl-field" style="min-width:220px"><span class="sl-label">Название шаблона</span><input class="sl-input" data-name value="${esc(state.name)}"></label>
      <span class="lbl" style="align-self:end;padding-bottom:10px">Файл: <b>templates/${slugify(state.name)}.css</b></span>
      <div class="sl-toolbar__end" style="align-self:end">
        ${state.saved.length ? `<select class="sl-select" aria-label="Сохранённые шаблоны" data-pick><option value="">Открыть сохранённый…</option>${state.saved.map(t => `<option value="${esc(t.slug)}">${esc(t.name)}</option>`).join('')}</select>` : ''}
        <button class="sl-btn" data-copy${empty ? ' disabled' : ''}>Копировать CSS</button>
        <button class="sl-btn" data-download${empty ? ' disabled' : ''}>Скачать CSS</button>
        <button class="sl-btn sl-btn--primary" data-save${empty || !state.apiOk ? ' disabled' : ''}>Сохранить в библиотеку</button>
      </div>
    </div>

    ${empty ? `<div class="sl-empty sl-dropzone"><i data-ic="layers"></i><div class="sl-empty__title">Шаблон пока пустой</div><div>Откройте песочницу любого компонента или «Редактор темы», настройте и нажмите «＋ В шаблон». Можно и сразу добавить компонент отсюда.</div></div>` : ''}

    <h2 class="sl-section-title">Тема</h2>
    ${d.theme ? `<div class="sl-card"><div class="sl-card__head"><div class="sl-card__title">Цвета и размеры темы</div><button class="sl-btn sl-btn--sm sl-btn--ghost sl-btn--danger" data-del-theme><i data-ic="x"></i>Убрать</button></div>
      <div class="g3">${THEME_FIELDS.map(([k, label, type]) => `<label class="sl-field"><span class="sl-label">${label}</span><input class="sl-input" type="${type}" data-theme-field="${k}" value="${esc(d.theme[k])}"${type === 'color' ? ' style="padding:2px;height:var(--sl-h-md)"' : ''}></label>`).join('')}</div></div>`
      : `<div class="row"><span class="lbl">Тема из библиотеки по умолчанию.</span><button class="sl-btn sl-btn--sm" data-add-theme><i data-ic="plus"></i>Настроить тему здесь</button></div>`}

    <h2 class="sl-section-title">Компоненты</h2>
    ${comps.length ? `<div class="sl-table-wrap"><table class="sl-table sl-table--stack"><thead><tr><th>Компонент</th><th>Размер, %</th><th>Скругление, px (−1 — как в теме)</th><th></th></tr></thead><tbody>
      ${comps.map(([k, v]) => `<tr><td data-label="Компонент"><b>${esc(COMPONENTS[k]?.label || k)}</b></td>
        <td data-label="Размер, %"><input class="sl-input" type="number" min="60" max="160" step="5" data-comp="${k}" data-prop="scale" value="${v.scale}" aria-label="Размер, %" style="max-width:110px"></td>
        <td data-label="Скругление"><input class="sl-input" type="number" min="-1" max="24" data-comp="${k}" data-prop="radius" value="${v.radius}" aria-label="Скругление" style="max-width:110px"></td>
        <td class="sl-actions"><button class="sl-btn sl-btn--sm sl-btn--ghost sl-btn--danger" data-del="${k}" aria-label="Убрать ${esc(COMPONENTS[k]?.label || k)}"><i data-ic="x"></i>Убрать</button></td></tr>`).join('')}
      </tbody></table></div>` : '<span class="lbl">Пока ни одного компонента.</span>'}
    ${free.length ? `<div class="row"><select class="sl-select" aria-label="Компонент" data-add-pick style="max-width:320px">${free.map(k => `<option value="${k}">${COMPONENTS[k].label}</option>`).join('')}</select><button class="sl-btn" data-add-comp><i data-ic="plus"></i>Добавить компонент</button></div>` : ''}

    <h2 class="sl-section-title">Как это выглядит</h2>
    <div class="sb-pair">
      <div class="sb-stage sl-root sb-tpl-preview" data-theme="light" data-label="Светлая тема">${SAMPLE}</div>
      <div class="sb-stage sl-root sb-tpl-preview" data-theme="dark" data-label="Тёмная тема">${SAMPLE}</div>
    </div>

    <h2 class="sl-section-title">CSS шаблона</h2>
    <pre style="margin:0;padding:12px;border-radius:var(--sl-r-md);background:var(--sl-surface);border:1px solid var(--sl-border-soft);font:12px/1.5 ui-monospace,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere;user-select:all">${esc(css)}</pre>
    <div class="row"><button class="sl-btn sl-btn--ghost sl-btn--danger" data-clear${empty ? ' disabled' : ''}>Очистить шаблон</button></div>
  </div>`;
  slHydrateIcons(root);
}

export const Template = {
  name: 'Мой шаблон',
  render: () => {
    const root = document.createElement('div');
    const state = { draft: loadDraft(), name: loadDraft().name || 'Шаблон 1', apiOk: false, saved: [] };
    const commit = () => { state.draft.name = state.name; saveDraft(state.draft); view(root, state); };
    const css = () => templateCSS(state.draft, state.name);

    root.addEventListener('change', e => {
      const t = e.target;
      if (t.matches('[data-theme-field]')) { state.draft.theme[t.dataset.themeField] = t.type === 'number' ? Number(t.value) : t.value; commit(); }
      else if (t.matches('[data-comp]')) { state.draft.components[t.dataset.comp][t.dataset.prop] = Number(t.value); commit(); }
      else if (t.matches('[data-name]')) { state.name = t.value.trim() || 'Шаблон 1'; commit(); }
      else if (t.matches('[data-pick]') && t.value) {
        fetch(`${API}/${t.value}`).then(r => r.json()).then(j => { state.draft = { ...j.draft }; state.name = j.name; commit(); toast(`Открыт «${j.name}»`, { type: 'ok', duration: 2500 }); });
      }
    });
    root.addEventListener('click', async e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.matches('[data-del]')) { delete state.draft.components[b.dataset.del]; commit(); }
      else if (b.matches('[data-del-theme]')) { delete state.draft.theme; commit(); }
      else if (b.matches('[data-add-theme]')) { state.draft.theme = { ...THEME_DEFAULTS }; commit(); }
      else if (b.matches('[data-add-comp]')) { const k = root.querySelector('[data-add-pick]').value; state.draft.components = state.draft.components || {}; state.draft.components[k] = { scale: 100, radius: -1 }; commit(); }
      else if (b.matches('[data-clear]')) { if (confirm('Очистить шаблон? Сохранённые файлы в библиотеке не пострадают.')) { state.draft = { components: {} }; commit(); } }
      else if (b.matches('[data-copy]')) { await navigator.clipboard?.writeText(css()); toast('CSS скопирован', { type: 'ok', duration: 2500 }); }
      else if (b.matches('[data-download]')) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([css()], { type: 'text/css' }));
        a.download = `${slugify(state.name)}.css`; a.click(); URL.revokeObjectURL(a.href);
      } else if (b.matches('[data-save]')) {
        const slug = slugify(state.name);
        const r = await fetch(`${API}/${slug}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: state.name, draft: state.draft, css: css() }) });
        const j = await r.json().catch(() => ({}));
        if (r.ok) { toast(`Сохранено: ${j.files.join(', ')}`, { title: `«${state.name}» в библиотеке`, type: 'ok' }); state.saved = await (await fetch(API)).json(); view(root, state); }
        else toast(j.error || 'Не удалось сохранить', { type: 'crit' });
      }
    });

    view(root, state);
    fetch(API).then(r => (r.ok && (r.headers.get('content-type') || '').includes('json') ? r.json() : null)).then(list => {
      if (Array.isArray(list)) { state.apiOk = true; state.saved = list; view(root, state); }
    }).catch(() => {});
    return root;
  },
};
