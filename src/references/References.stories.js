// «Референсы»: добавить ссылку или файлы, посмотреть статус разбора и перейти к компонентам референса.
// Разбор делает Claude (скилл sloyka-references): «разбери референсы».
import { slHydrateIcons } from '../icons.js';
import { toast } from '../components/toast/toast.js';

const HIDE = { table: { disable: true } };
const API = '/__sloyka/references';
const STATUS = { new: ['Новый — ждёт разбора', ''], working: ['Claude разбирает', 'warn'], review: ['Ждёт вашего одобрения', 'warn'], ready: ['Готов', 'ok'] };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const toBase64 = file => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(file); });

export default {
  title: 'Референсы/Добавить референс',
  argTypes: { slScale: HIDE, slRadius: HIDE },
  parameters: { pair: false, docs: { description: { component: 'Добавьте ссылку или файлы. Затем напишите Claude «разбери референсы» — компоненты появятся в разделе «Референсы» с меткой источника.' } } },
};

function card(r) {
  const [label, kind] = STATUS[r.status] || [r.status, ''];
  const comps = (r.components || []).map(c => `<a class="sl-tag" href="/?path=/story/${esc(c.storyId)}" target="_top">${esc(c.group)}</a>`).join(' ');
  return `<article class="sl-card" data-accent="${kind || 'off'}">
    <div class="sl-card__head"><div><div class="sl-card__title">${esc(r.name)}</div><div class="sl-card__sub">Метка в фильтре: <b>ref-${esc(r.slug)}</b></div></div><span class="sl-status sl-status--plain${kind ? ' sl-status--' + kind : ''}">${label}</span></div>
    <dl class="sl-kv">${r.url ? `<dt>Ссылка</dt><dd><a class="sl-link" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.url)}</a></dd>` : ''}
      ${r.files?.length ? `<dt>Файлы</dt><dd>${r.files.map(esc).join(', ')}</dd>` : ''}
      ${r.note ? `<dt>Что нравится</dt><dd>${esc(r.note)}</dd>` : ''}
      <dt>Добавлен</dt><dd>${new Date(r.createdAt).toLocaleString('ru-RU')}</dd></dl>
    ${comps ? `<div class="sl-card__foot"><div class="row">${comps}</div></div>` : ''}</article>`;
}

function view(root, st) {
  root.innerHTML = `<div class="col" style="gap:20px">
    <div class="sl-page-head"><h1 class="sl-page-title">Референсы</h1><span class="lbl">${st.apiOk ? '' : 'Добавлять можно только в <code>npm run storybook</code>'}</span></div>
    <form class="sl-card" data-form style="max-width:720px">
      <div class="sl-card__title">Добавить референс</div>
      <label class="sl-field"><span class="sl-label">Название</span><input class="sl-input" name="name" required placeholder="Например, Тёмная CRM"></label>
      <label class="sl-field"><span class="sl-label">Ссылка</span><input class="sl-input" name="url" type="url" placeholder="https://…"></label>
      <label class="sl-field sl-dropzone" data-drop style="padding:16px;border-radius:var(--sl-r-md)"><span class="sl-label">Файлы: скриншоты, PDF, HTML, архив (до 25 МБ)</span>
        <input type="file" name="files" multiple accept=".png,.jpg,.jpeg,.webp,.gif,.svg,.pdf,.html,.htm,.zip,.fig,.txt,.md,.css">
        <span class="sl-hint" data-picked>Перетащите файлы сюда или выберите</span></label>
      <label class="sl-field"><span class="sl-label">Что взять из референса</span><textarea class="sl-textarea" name="note" placeholder="Например: карточки и таблицы, тёмная тема, скругления"></textarea></label>
      <div class="row"><button class="sl-btn sl-btn--primary" type="submit"${st.apiOk ? '' : ' disabled'}><i data-ic="plus"></i>Добавить референс</button>
        <span class="lbl">Потом напишите Claude: <b>«разбери референсы»</b></span></div>
    </form>
    <h2 class="sl-section-title">Добавленные</h2>
    ${st.list.length ? `<div class="sl-grid" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr))">${st.list.map(card).join('')}</div>`
      : `<div class="sl-empty"><i data-ic="layers"></i><div class="sl-empty__title">Пока ни одного референса</div><div>Добавьте ссылку или файл выше.</div></div>`}
    <div class="sl-banner"><div class="sl-banner__title"><i data-ic="filter"></i>Как показать компоненты одного референса</div>
      <div class="sl-banner__text">В боковом списке Storybook нажмите значок фильтра (метки) и выберите <b>ref-имя</b>. Базовые компоненты Sloyka помечены <b>ref-base</b>.</div></div>
  </div>`;
  slHydrateIcons(root);
}

export const Add = {
  name: 'Добавить референс',
  render: () => {
    const root = document.createElement('div');
    const st = { apiOk: false, list: [] };
    const load = () => fetch(API).then(r => (r.ok && (r.headers.get('content-type') || '').includes('json') ? r.json() : null))
      .then(list => { if (Array.isArray(list)) { st.apiOk = true; st.list = list; view(root, st); } }).catch(() => {});

    root.addEventListener('change', e => {
      if (e.target.name === 'files') root.querySelector('[data-picked]').textContent = [...e.target.files].map(f => f.name).join(', ') || 'Перетащите файлы сюда или выберите';
    });
    root.addEventListener('dragover', e => { if (e.target.closest('[data-drop]')) e.preventDefault(); });
    root.addEventListener('drop', e => {
      const zone = e.target.closest('[data-drop]');
      if (!zone || !e.dataTransfer?.files?.length) return;
      e.preventDefault();
      const input = zone.querySelector('input[type=file]');
      input.files = e.dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    root.addEventListener('submit', async e => {
      e.preventDefault();
      const f = e.target, btn = f.querySelector('[type=submit]');
      btn.setAttribute('aria-busy', 'true'); btn.disabled = true;
      try {
        const files = await Promise.all([...f.files.files].map(async x => ({ name: x.name, data: await toBase64(x) })));
        const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: f.name.value, url: f.url.value, note: f.note.value, files }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || 'Не удалось добавить');
        toast('Напишите Claude «разбери референсы».', { title: `«${j.name}» добавлен`, type: 'ok' });
        await load();
      } catch (err) {
        toast(err.message, { type: 'crit' });
        btn.removeAttribute('aria-busy'); btn.disabled = false;
      }
    });
    view(root, st);
    load();
    return root;
  },
};
