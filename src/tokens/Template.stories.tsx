// «Мой шаблон»: все примерки в одном месте — поправить, удалить, посмотреть вживую,
// скопировать CSS или сохранить в библиотеку как «Шаблон 1», «Шаблон 2»…
import { useEffect, useRef, useState } from 'react';
import { Icon, useToast } from '../react';
import { COMPONENTS, THEME_DEFAULTS, themeCSS, componentCSS, templateCSS, slugify, loadDraft, saveDraft } from '../../.storybook/template-store.js';
import { Sample } from '../../.storybook/sample';

const HIDE = { table: { disable: true } };
const API = '/__sloyka/templates';

export default {
  title: 'Основа/Мой шаблон',
  argTypes: { slScale: HIDE, slRadius: HIDE },
  parameters: {
    pair: false,
    docs: { description: { component: 'Сюда попадает всё, что вы добавили кнопкой «＋ В шаблон». Правьте значения, удаляйте лишнее и сохраняйте шаблон в библиотеку.' } },
  },
};

const THEME_FIELDS: [key: string, label: string, type: 'color' | 'number'][] = [
  ['accentLight', 'Главный цвет · светлая', 'color'], ['accentDark', 'Главный цвет · тёмная', 'color'],
  ['bgLight', 'Фон · светлая', 'color'], ['bgDark', 'Фон · тёмная', 'color'],
  ['radius', 'Скругление, px', 'number'], ['fontSize', 'Текст, px', 'number'], ['controlHeight', 'Высота кнопок, px', 'number'],
];

type Draft = { name?: string; theme?: Record<string, string | number>; components?: Record<string, { scale: number; radius: number }> };
type Saved = { slug: string; name: string };
const label = (k: string) => COMPONENTS[k as keyof typeof COMPONENTS]?.label || k;

function TemplatePage() {
  const toast = useToast();
  const [draft, setDraft] = useState<Draft>(() => loadDraft());
  const [name, setName] = useState<string>(() => loadDraft().name || 'Шаблон 1');
  const [apiOk, setApiOk] = useState(false);
  const [saved, setSaved] = useState<Saved[]>([]);
  // Поля таблицы неуправляемые: значение применяется при уходе с поля, как раньше по событию change.
  const [gen, setGen] = useState(0);
  const addPick = useRef<HTMLSelectElement>(null);

  const commit = (d: Draft, n = name) => { const next = { ...d, name: n }; saveDraft(next); setDraft(next); };
  const reload = (d: Draft, n: string) => { setName(n); commit(d, n); setGen((g) => g + 1); };

  useEffect(() => {
    fetch(API).then((r) => (r.ok && (r.headers.get('content-type') || '').includes('json') ? r.json() : null)).then((list) => {
      if (Array.isArray(list)) { setApiOk(true); setSaved(list); }
    }).catch(() => {});
  }, []);

  const comps = Object.entries(draft.components || {});
  const free = Object.keys(COMPONENTS).filter((k) => !(draft.components || {})[k]);
  const scopedTheme = draft.theme ? themeCSS(draft.theme, { light: '.sb-tpl-preview[data-theme="light"]', dark: '.sb-tpl-preview[data-theme="dark"]', root: '.sb-tpl-preview', media: false }) : '';
  const scopedComps = comps.map(([k, v]) => componentCSS(k, v, '.sb-tpl-preview ')).filter(Boolean).join('\n');
  const css = templateCSS(draft, name);
  const empty = !draft.theme && !comps.length;

  const setComp = (k: string, prop: 'scale' | 'radius', v: string) =>
    commit({ ...draft, components: { ...draft.components, [k]: { ...draft.components![k], [prop]: Number(v) } } });
  const setThemeField = (k: string, type: string, v: string) =>
    commit({ ...draft, theme: { ...draft.theme, [k]: type === 'number' ? Number(v) : v } });
  const without = (k: string) => { const c = { ...draft.components }; delete c[k]; return c; };

  const pick = async (slug: string) => {
    if (!slug) return;
    const j = await fetch(`${API}/${slug}`).then((r) => r.json());
    reload({ ...j.draft }, j.name);
    toast.ok(`Открыт «${j.name}»`, { duration: 2500 });
  };
  const copy = async () => { await navigator.clipboard?.writeText(css); toast.ok('CSS скопирован', { duration: 2500 }); };
  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([css], { type: 'text/css' }));
    a.download = `${slugify(name)}.css`; a.click(); URL.revokeObjectURL(a.href);
  };
  const save = async () => {
    const slug = slugify(name);
    const r = await fetch(`${API}/${slug}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, draft, css }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { toast.ok(`Сохранено: ${j.files.join(', ')}`, { title: `«${name}» в библиотеке` }); setSaved(await (await fetch(API)).json()); }
    else toast.crit(j.error || 'Не удалось сохранить');
  };
  const clear = () => { if (confirm('Очистить шаблон? Сохранённые файлы в библиотеке не пострадают.')) reload({ components: {} }, name); };

  return (
    <div>
      <style>{`${scopedTheme}\n${scopedComps}`}</style>
      <div className="col" style={{ gap: 20 }}>
        <div className="sl-page-head"><h1 className="sl-page-title">Мой шаблон</h1>
          <span className="lbl">{apiOk ? 'Сохранение в библиотеку доступно' : <>Сохранение в библиотеку работает только в <code>npm run storybook</code></>}</span></div>
        <div className="sl-toolbar">
          <label className="sl-field" style={{ minWidth: 220 }}><span className="sl-label">Название шаблона</span>
            <input key={`n${gen}`} className="sl-input" data-name defaultValue={name} onBlur={(e) => { const n = e.target.value.trim() || 'Шаблон 1'; setName(n); commit(draft, n); }} /></label>
          <span className="lbl" style={{ alignSelf: 'end', paddingBottom: 10 }}>Файл: <b>templates/{slugify(name)}.css</b></span>
          <div className="sl-toolbar__end" style={{ alignSelf: 'end' }}>
            {saved.length > 0 && (
              <select className="sl-select" aria-label="Сохранённые шаблоны" data-pick value="" onChange={(e) => pick(e.target.value)}>
                <option value="">Открыть сохранённый…</option>
                {saved.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
              </select>
            )}
            <button type="button" className="sl-btn" data-copy disabled={empty} onClick={copy}>Копировать CSS</button>
            <button type="button" className="sl-btn" data-download disabled={empty} onClick={download}>Скачать CSS</button>
            <button type="button" className="sl-btn sl-btn--primary" data-save disabled={empty || !apiOk} onClick={save}>Сохранить в библиотеку</button>
          </div>
        </div>

        {empty && (
          <div className="sl-empty sl-dropzone"><Icon name="layers" /><div className="sl-empty__title">Шаблон пока пустой</div>
            <div>Откройте песочницу любого компонента или «Редактор темы», настройте и нажмите «＋ В шаблон». Можно и сразу добавить компонент отсюда.</div></div>
        )}

        <h2 className="sl-section-title">Тема</h2>
        {draft.theme ? (
          <div className="sl-card">
            <div className="sl-card__head"><div className="sl-card__title">Цвета и размеры темы</div>
              <button type="button" className="sl-btn sl-btn--sm sl-btn--ghost sl-btn--danger" data-del-theme onClick={() => { const d = { ...draft }; delete d.theme; commit(d); }}><Icon name="x" />Убрать</button></div>
            <div className="g3">
              {THEME_FIELDS.map(([k, lbl, type]) => (
                <label key={`${k}${gen}`} className="sl-field"><span className="sl-label">{lbl}</span>
                  <input className="sl-input" type={type} data-theme-field={k} defaultValue={String(draft.theme![k])}
                    style={type === 'color' ? { padding: 2, height: 'var(--sl-h-md)' } : undefined}
                    onChange={type === 'color' ? (e) => setThemeField(k, type, e.target.value) : undefined}
                    onBlur={type === 'number' ? (e) => setThemeField(k, type, e.target.value) : undefined} /></label>
              ))}
            </div>
          </div>
        ) : (
          <div className="row"><span className="lbl">Тема из библиотеки по умолчанию.</span>
            <button type="button" className="sl-btn sl-btn--sm" data-add-theme onClick={() => commit({ ...draft, theme: { ...THEME_DEFAULTS } })}><Icon name="plus" />Настроить тему здесь</button></div>
        )}

        <h2 className="sl-section-title">Компоненты</h2>
        {comps.length ? (
          <div className="sl-table-wrap"><table className="sl-table sl-table--stack">
            <thead><tr><th>Компонент</th><th>Размер, %</th><th>Скругление, px (−1 — как в теме)</th><th></th></tr></thead>
            <tbody>
              {comps.map(([k, v]) => (
                <tr key={`${k}${gen}`}>
                  <td data-label="Компонент"><b>{label(k)}</b></td>
                  <td data-label="Размер, %"><input className="sl-input" type="number" min={60} max={160} step={5} data-comp={k} data-prop="scale" defaultValue={v.scale} aria-label="Размер, %" style={{ maxWidth: 110 }} onBlur={(e) => setComp(k, 'scale', e.target.value)} /></td>
                  <td data-label="Скругление"><input className="sl-input" type="number" min={-1} max={24} data-comp={k} data-prop="radius" defaultValue={v.radius} aria-label="Скругление" style={{ maxWidth: 110 }} onBlur={(e) => setComp(k, 'radius', e.target.value)} /></td>
                  <td className="sl-actions"><button type="button" className="sl-btn sl-btn--sm sl-btn--ghost sl-btn--danger" data-del={k} aria-label={`Убрать ${label(k)}`} onClick={() => commit({ ...draft, components: without(k) })}><Icon name="x" />Убрать</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : <span className="lbl">Пока ни одного компонента.</span>}
        {free.length > 0 && (
          <div className="row">
            <select ref={addPick} className="sl-select" aria-label="Компонент" data-add-pick style={{ maxWidth: 320 }}>
              {free.map((k) => <option key={k} value={k}>{label(k)}</option>)}
            </select>
            <button type="button" className="sl-btn" data-add-comp onClick={() => { const k = addPick.current!.value; commit({ ...draft, components: { ...draft.components, [k]: { scale: 100, radius: -1 } } }); }}><Icon name="plus" />Добавить компонент</button>
          </div>
        )}

        <h2 className="sl-section-title">Как это выглядит</h2>
        <div className="sb-pair">
          <div className="sb-stage sl-root sb-tpl-preview" data-theme="light" data-label="Светлая тема"><Sample /></div>
          <div className="sb-stage sl-root sb-tpl-preview" data-theme="dark" data-label="Тёмная тема"><Sample /></div>
        </div>

        <h2 className="sl-section-title">CSS шаблона</h2>
        <pre className="sb-code">{css}</pre>
        <div className="row"><button type="button" className="sl-btn sl-btn--ghost sl-btn--danger" data-clear disabled={empty} onClick={clear}>Очистить шаблон</button></div>
      </div>
    </div>
  );
}

export const Template = {
  name: 'Мой шаблон',
  render: () => <TemplatePage />,
};
