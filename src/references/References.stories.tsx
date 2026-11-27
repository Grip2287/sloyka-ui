// «Референсы»: добавить ссылку или файлы, посмотреть статус разбора и перейти к компонентам референса.
// Разбор делает Claude (скилл sloyka-references): «разбери референсы».
import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react';
import { Icon, useToast } from '../react';
import { saveDraft } from '../../.storybook/template-store.js';

const TEMPLATE_STORY = '/?path=/story/основа-мой-шаблон--template';
const PICK_HINT = 'Перетащите файлы сюда или выберите';

/** Палитра картинки: самый частый цвет → фон, самый заметный насыщенный → главный цвет. */
async function paletteFromImage(file: File) {
  const bmp = await createImageBitmap(file);
  const c = document.createElement('canvas');
  c.width = 80; c.height = Math.max(1, Math.round(80 * bmp.height / bmp.width));
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  const px = ctx.getImageData(0, 0, c.width, c.height).data;
  const buckets = new Map<string, { n: number; r: number; g: number; bl: number }>();
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] < 200) continue;
    const key = [px[i] >> 4, px[i + 1] >> 4, px[i + 2] >> 4].join(',');
    const b = buckets.get(key) || { n: 0, r: 0, g: 0, bl: 0 };
    b.n++; b.r += px[i]; b.g += px[i + 1]; b.bl += px[i + 2];
    buckets.set(key, b);
  }
  const total = [...buckets.values()].reduce((s, b) => s + b.n, 0) || 1;
  const cols = [...buckets.values()].map((b) => {
    const r = b.r / b.n, g = b.g / b.n, bl = b.bl / b.n, mx = Math.max(r, g, bl), mn = Math.min(r, g, bl);
    return { n: b.n, sat: mx ? (mx - mn) / mx : 0, css: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(bl)})` };
  });
  const bg = cols.sort((a, b) => b.n - a.n)[0];
  const accent = cols.filter((x) => x.sat > 0.35 && x.n / total > 0.005).sort((a, b) => b.n * b.sat - a.n * a.sat)[0];
  return { bg: bg?.css, accent: accent?.css };
}

const HIDE = { table: { disable: true } };
const API = '/__sloyka/references';
const STATUS: Record<string, [string, '' | 'ok' | 'warn']> = { new: ['Новый — ждёт разбора', ''], working: ['Claude разбирает', 'warn'], review: ['Ждёт вашего одобрения', 'warn'], ready: ['Готов', 'ok'] };
const toBase64 = (file: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(file); });

export default {
  title: 'Референсы/Добавить референс',
  argTypes: { slScale: HIDE, slRadius: HIDE },
  parameters: { pair: false, docs: { description: { component: 'Добавьте ссылку или файлы. Затем напишите Claude «разбери референсы» — компоненты появятся в разделе «Референсы» с меткой источника.' } } },
};

interface Ref {
  slug: string; name: string; status: string; url?: string; files?: string[]; note?: string; createdAt: string;
  template?: { slug: string; name: string }; autoError?: string; components?: { group: string; storyId: string }[];
}

function RefCard({ r }: { r: Ref }) {
  const [label, kind] = STATUS[r.status] || [r.status, ''];
  const openTemplate = async (slug: string) => {
    const j = await fetch(`/__sloyka/templates/${slug}`).then((x) => x.json());
    saveDraft({ ...j.draft, name: j.name });
    window.open(TEMPLATE_STORY, '_blank', 'noopener');
  };
  return (
    <article className="sl-card" data-accent={kind || 'off'}>
      <div className="sl-card__head"><div><div className="sl-card__title">{r.name}</div><div className="sl-card__sub">Метка в фильтре: <b>ref-{r.slug}</b></div></div>
        <span className={`sl-status sl-status--plain${kind ? ' sl-status--' + kind : ''}`}>{label}</span></div>
      <dl className="sl-kv">
        {r.url && <><dt>Ссылка</dt><dd><a className="sl-link" href={r.url} target="_blank" rel="noopener noreferrer">{r.url}</a></dd></>}
        {r.files?.length ? <><dt>Файлы</dt><dd>{r.files.join(', ')}</dd></> : null}
        {r.note && <><dt>Что нравится</dt><dd>{r.note}</dd></>}
        <dt>Добавлен</dt><dd>{new Date(r.createdAt).toLocaleString('ru-RU')}</dd>
        <dt>Шаблон</dt><dd>{r.template ? <><b>{r.template.name}</b> · templates/{r.template.slug}.css</> : <span className="sl-muted">{r.autoError || 'не создан'}</span>}</dd>
      </dl>
      {r.template && <div className="row"><button type="button" className="sl-btn sl-btn--sm" onClick={() => openTemplate(r.template!.slug)}><Icon name="layers" />Открыть в «Мой шаблон»</button></div>}
      {r.components?.length ? (
        <div className="sl-card__foot"><div className="row">
          {r.components.map((c) => <a key={c.storyId} className="sl-tag" href={`/?path=/story/${c.storyId}`} target="_top">{c.group}</a>)}
        </div></div>
      ) : null}
    </article>
  );
}

function ReferencesPage() {
  const toast = useToast();
  const [apiOk, setApiOk] = useState(false);
  const [list, setList] = useState<Ref[]>([]);
  const [picked, setPicked] = useState(PICK_HINT);
  const [busy, setBusy] = useState<string | null>(null);
  const filesRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => fetch(API).then((r) => (r.ok && (r.headers.get('content-type') || '').includes('json') ? r.json() : null))
    .then((l) => { if (Array.isArray(l)) { setApiOk(true); setList(l); } }).catch(() => {}), []);
  useEffect(() => { load(); }, [load]);

  const showPicked = (files: FileList | null) => setPicked([...(files || [])].map((f) => f.name).join(', ') || PICK_HINT);
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    if (!e.dataTransfer?.files?.length || !filesRef.current) return;
    e.preventDefault();
    filesRef.current.files = e.dataTransfer.files;
    showPicked(e.dataTransfer.files);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const field = (n: string) => (f.elements.namedItem(n) as HTMLInputElement).value;
    setBusy('Сохраняю…');
    try {
      const chosen = [...(filesRef.current?.files || [])];
      const files = await Promise.all(chosen.map(async (x) => ({ name: x.name, data: await toBase64(x) })));
      // без ссылки шаблон строится по палитре первой картинки
      const img = chosen.find((x) => /^image\/(png|jpe?g|webp|gif)$/.test(x.type));
      const palette = !field('url') && img ? await paletteFromImage(img).catch(() => null) : null;
      setBusy(field('url') ? 'Снимаю стиль с сайта…' : 'Сохраняю…');
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: field('name'), url: field('url'), note: field('note'), files, palette }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Не удалось добавить');
      if (j.template) toast.ok(`Шаблон «${j.template.name}» уже готов: templates/${j.template.slug}.css. Для разбора по компонентам напишите Claude «разбери референсы».`, { title: `«${j.name}» добавлен`, duration: 9000 });
      else toast.warn(`${j.autoError || 'Шаблон не создан: добавьте ссылку или картинку.'} Напишите Claude «разбери референсы».`, { title: `«${j.name}» добавлен`, duration: 9000 });
      await load();
    } catch (err) {
      toast.crit((err as Error).message);
    }
    setBusy(null);
  };

  return (
    <div>
      <div className="col" style={{ gap: 20 }}>
        <div className="sl-page-head"><h1 className="sl-page-title">Референсы</h1>
          <span className="lbl">{apiOk ? '' : <>Добавлять можно только в <code>npm run storybook</code></>}</span></div>
        <form className="sl-card" style={{ maxWidth: 720 }} onSubmit={submit}>
          <div className="sl-card__title">Добавить референс</div>
          <label className="sl-field"><span className="sl-label">Название</span><input className="sl-input" name="name" required placeholder="Например, Тёмная CRM" /></label>
          <label className="sl-field"><span className="sl-label">Ссылка</span><input className="sl-input" name="url" type="url" placeholder="https://…" /></label>
          <label className="sl-field sl-dropzone" style={{ padding: 16, borderRadius: 'var(--sl-r-md)' }} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
            <span className="sl-label">Файлы: скриншоты, PDF, HTML, архив (до 25 МБ)</span>
            <input ref={filesRef} type="file" name="files" multiple accept=".png,.jpg,.jpeg,.webp,.gif,.svg,.pdf,.html,.htm,.zip,.fig,.txt,.md,.css" onChange={(e) => showPicked(e.target.files)} />
            <span className="sl-hint">{picked}</span></label>
          <label className="sl-field"><span className="sl-label">Что взять из референса</span><textarea className="sl-textarea" name="note" placeholder="Например: карточки и таблицы, тёмная тема, скругления" /></label>
          <div className="row">
            <button className="sl-btn sl-btn--primary" type="submit" disabled={!apiOk || busy !== null} aria-busy={busy ? 'true' : undefined}><Icon name="plus" />{busy ?? 'Добавить референс'}</button>
            <span className="lbl">Потом напишите Claude: <b>«разбери референсы»</b></span>
          </div>
        </form>
        <h2 className="sl-section-title">Добавленные</h2>
        {list.length ? (
          <div className="sl-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))' }}>{list.map((r) => <RefCard key={r.slug} r={r} />)}</div>
        ) : (
          <div className="sl-empty"><Icon name="layers" /><div className="sl-empty__title">Пока ни одного референса</div><div>Добавьте ссылку или файл выше.</div></div>
        )}
        <div className="sl-banner"><div className="sl-banner__title"><Icon name="filter" />Как показать компоненты одного референса</div>
          <div className="sl-banner__text">В боковом списке Storybook нажмите значок фильтра (метки) и выберите <b>ref-имя</b>. Базовые компоненты Sloyka помечены <b>ref-base</b>.</div></div>
      </div>
    </div>
  );
}

export const Add = {
  name: 'Добавить референс',
  render: () => <ReferencesPage />,
};
