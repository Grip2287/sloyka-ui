// «Все шаблоны»: галерея сохранённых шаблонов с мини-превью в обеих темах.
import { useCallback, useEffect, useState } from 'react';
import { Icon, useToast } from '../react';
import { COMPONENTS, themeCSS, componentCSS, templateCSS, saveDraft } from '../../.storybook/template-store.js';

const HIDE = { table: { disable: true } };
const API = '/__sloyka/templates';
const TEMPLATE_STORY = '/?path=/story/основа-мой-шаблон--template';

export default {
  title: 'Основа/Все шаблоны',
  argTypes: { slScale: HIDE, slRadius: HIDE },
  parameters: { pair: false, docs: { description: { component: 'Все сохранённые шаблоны рядом: превью в светлой и тёмной теме, откуда шаблон взялся, кнопки «Открыть», «Скопировать CSS», «Удалить».' } } },
};

type Draft = { theme?: Record<string, string | number>; components?: Record<string, { scale: number; radius: number }> };
type Item = { slug: string; name: string; savedAt?: string; draft?: Draft; ref?: string };

// маленький кусочек панели — хватает, чтобы сравнить шаблоны глазами
function Mini() {
  return (
    <>
      <div className="row">
        <button type="button" className="sl-btn sl-btn--primary sl-btn--sm" tabIndex={-1}>Сохранить</button>
        <button type="button" className="sl-btn sl-btn--sm" tabIndex={-1}>Отмена</button>
        <span className="sl-tag">Админ</span>
      </div>
      <input className="sl-input" placeholder="Поиск" tabIndex={-1} aria-label="Поиск" />
      <article className="sl-card" data-accent="ok" style={{ padding: '12px 14px', gap: 8 }}>
        <div className="sl-card__head"><div className="sl-card__title">Камера КПП-1</div></div>
        <span className="sl-status sl-status--ok">На связи</span>
      </article>
    </>
  );
}

const scopeCSS = (t: Item, cls: string) => [
  t.draft?.theme ? themeCSS(t.draft.theme, { light: `.${cls}[data-theme="light"]`, dark: `.${cls}[data-theme="dark"]`, root: `.${cls}`, media: false }) : '',
  ...Object.entries(t.draft?.components || {}).map(([k, v]) => componentCSS(k, v, `.${cls} `)),
].filter(Boolean).join('\n');

function summary(d: Draft = {}) {
  const parts = [];
  if (d.theme) parts.push(`тема: скругление ${d.theme.radius}px, текст ${d.theme.fontSize}px`);
  const comps = Object.keys(d.components || {});
  if (comps.length) parts.push(`компоненты: ${comps.map((k) => (COMPONENTS[k as keyof typeof COMPONENTS]?.label || k).replace(/^\d+ · /, '')).join(', ')}`);
  return parts.join(' · ') || 'без изменений';
}

const json = (r: Response) => (r.ok && (r.headers.get('content-type') || '').includes('json') ? r.json() : null);

function TemplatesPage() {
  const toast = useToast();
  const [apiOk, setApiOk] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  const load = useCallback(async () => {
    const list = await fetch(API).then(json).catch(() => null);
    if (!Array.isArray(list)) return;
    const refs: { name: string; template?: { slug: string } }[] = (await fetch('/__sloyka/references').then(json).catch(() => null)) || [];
    const refOf = Object.fromEntries(refs.filter((r) => r.template).map((r) => [r.template!.slug, r.name]));
    const full: (Item | null)[] = await Promise.all(list.map((t: Item) => fetch(`${API}/${t.slug}`).then(json).catch(() => null)));
    setApiOk(true);
    setItems(full.filter((t): t is Item => Boolean(t)).map((t) => ({ ...t, ref: refOf[t.slug] })).sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt))));
  }, []);
  useEffect(() => { load(); }, [load]);

  const open = (t: Item) => { saveDraft({ ...t.draft, name: t.name }); window.open(TEMPLATE_STORY, '_blank', 'noopener'); };
  const copy = async (t: Item) => { await navigator.clipboard?.writeText(templateCSS(t.draft, t.name)); toast.ok('CSS скопирован', { duration: 2500 }); };
  const del = async (t: Item) => {
    if (!confirm(`Удалить шаблон «${t.name}»? Файлы templates/${t.slug}.css и .json будут удалены. Отменить это нельзя.`)) return;
    const r = await fetch(`${API}/${t.slug}`, { method: 'DELETE' });
    if (r.ok) { toast.ok(`«${t.name}» удалён`, { duration: 2500 }); await load(); }
    else toast.crit('Не удалось удалить');
  };

  return (
    <div>
      <style>{items.map((t, i) => scopeCSS(t, `g-${i}`)).join('\n')}</style>
      <div className="col" style={{ gap: 20 }}>
        <div className="sl-page-head"><h1 className="sl-page-title">Все шаблоны</h1>
          <span className="lbl">{apiOk ? `${items.length} шт. · папка templates/` : <>Список доступен в <code>npm run storybook</code></>}</span></div>
        {items.length ? (
          <div className="sl-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,420px),1fr))' }}>
            {items.map((t, i) => (
              <article key={t.slug} className="sl-card" data-tpl={t.slug}>
                <div className="sl-card__head"><div><div className="sl-card__title">{t.name}</div><div className="sl-card__sub">templates/{t.slug}.css</div></div>
                  {t.ref && <span className="sl-tag" title="Создан из референса">из «{t.ref}»</span>}</div>
                <div className="g2">
                  <div className={`sl-root sb-mini g-${i}`} data-theme="light"><Mini /></div>
                  <div className={`sl-root sb-mini g-${i}`} data-theme="dark"><Mini /></div>
                </div>
                <dl className="sl-kv"><dt>Что внутри</dt><dd>{summary(t.draft)}</dd><dt>Сохранён</dt><dd>{t.savedAt ? new Date(t.savedAt).toLocaleString('ru-RU') : '—'}</dd></dl>
                <div className="sl-card__foot"><div className="row">
                  <button type="button" className="sl-btn sl-btn--sm sl-btn--primary" onClick={() => open(t)}><Icon name="edit" />Открыть в «Мой шаблон»</button>
                  <button type="button" className="sl-btn sl-btn--sm" onClick={() => copy(t)}>Скопировать CSS</button>
                  <button type="button" className="sl-btn sl-btn--sm sl-btn--ghost sl-btn--danger" aria-label={`Удалить ${t.name}`} onClick={() => del(t)}><Icon name="x" />Удалить</button>
                </div></div>
              </article>
            ))}
          </div>
        ) : (
          <div className="sl-empty sl-dropzone"><Icon name="layers" /><div className="sl-empty__title">Шаблонов пока нет</div>
            <div>Соберите шаблон в «Основа → Мой шаблон» и нажмите «Сохранить в библиотеку» — или добавьте референс: шаблон с его названием создастся сам.</div></div>
        )}
      </div>
    </div>
  );
}

export const All = {
  name: 'Все шаблоны',
  render: () => <TemplatesPage />,
};
