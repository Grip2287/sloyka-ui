import '../src/index.css';
import './preview.css';
import { useEffect, useRef, createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { addons } from 'storybook/preview-api';
import { snippetFromDom, scriptsFor } from '../src/native/format.js';
import type { Decorator, Preview } from '@storybook/react-vite';
import { ToastProvider, useToast, Icon, type IconName } from '../src/react';
import { COMPONENTS as COMPONENT_MAP, componentFromTitle, componentCSS, addComponent, addTheme } from './template-store.js';

// Стили референсов: src/references/<slug>/ref.css, всё внутри [data-ref="<slug>"]
import.meta.glob('../src/references/*/ref.css', { eager: true });

const COMPONENTS: Record<string, { label: string }> = COMPONENT_MAP;

export const TEMPLATE_STORY = '/?path=/story/основа-мой-шаблон--template';

type Args = Record<string, unknown> & { slScale?: number; slRadius?: number };

/** Панель над примером: отправить примерку размера/скругления (или тему) в «Мой шаблон». */
function TemplateBar({ title, args }: { title: string; args: Args }) {
  const toast = useToast();
  const key = componentFromTitle(title);
  const isTheme = title === 'Основа/Редактор темы';
  if (!key && !isTheme) return null;
  const what = isTheme ? 'тему' : `«${COMPONENTS[key!].label.replace(/^\d+ · /, '')}»`;
  const radius = Number(args.slRadius ?? -1);
  const detail = isTheme ? '' : ` — размер ${args.slScale ?? 100}%, скругление ${radius < 0 ? 'как в теме' : radius + 'px'}`;
  const add = () => {
    if (isTheme) addTheme(Object.fromEntries(Object.entries(args).filter(([k]) => !k.startsWith('sl'))));
    else addComponent(key!, args.slScale ?? 100, args.slRadius ?? -1);
    toast.ok(isTheme ? 'Тема добавлена в шаблон' : `${COMPONENTS[key!].label} добавлен в шаблон`, { title: 'Готово', duration: 2500 });
  };
  return (
    <div className="sb-tpl-bar">
      <button type="button" className="sl-btn sl-btn--sm sl-btn--primary" data-tpl-add onClick={add}>＋ В шаблон</button>
      <span>Добавить {what}{detail}</span>
      <a className="sl-link" href={TEMPLATE_STORY} target="_blank" rel="noopener">Открыть «Мой шаблон» в новой вкладке ↗</a>
    </div>
  );
}

// Панель «Код» (manager.tsx): разметка примера как нативный фрагмент и скрипты компонентов.
const SCRIPT_SOURCES = import.meta.glob('../src/native/scripts/*.js', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const scriptSource = (file: string) => (SCRIPT_SOURCES[`../src/native/scripts/${file}`] ?? '')
  .replace(/__SL_ICON_([a-z-]+)__/g, (_, n: string) => renderToStaticMarkup(createElement(Icon, { name: n as IconName })));

const STORY_SOURCES = import.meta.glob('../src/**/*.stories.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

/** React-код примера: импорты файла, сам пример и функции файла, на которые он ссылается. */
function storySource(fileName: string | undefined, storyName: string): string {
  const key = Object.keys(STORY_SOURCES).find((k) => fileName && fileName.replace(/^\.\//, '').endsWith(k.replace(/^\.\.\//, '')));
  const src = key ? STORY_SOURCES[key] : '';
  if (!src) return '';
  const blocks = [...src.matchAll(/^export const (\w+)[^=]*= \{[\s\S]*?^\};/gm)];
  const label = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1 $2');
  const found = blocks.find((b) => b[0].includes(`name: '${storyName}'`) || b[0].includes(`name: "${storyName}"`) || label(b[1]) === storyName);
  if (!found) return '';
  const imports = (src.match(/^import [^;]+;$/gm) ?? []).filter((l) => !l.includes('.storybook/')).map((l) => l.replace(/from '(\.\.\/)+react'/, "from 'sloyka'"));
  const helpers = [...src.matchAll(/^(?:export )?function (\w+)[\s\S]*?^\}/gm)].filter((f) => found[0].includes(`<${f[1]}`) || found[0].includes(`${f[1]}(`)).map((f) => f[0]);
  return [...imports, '', ...helpers, ...(helpers.length ? [''] : []), found[0]].join('\n');
}

function CodeSource({ storyId, react, children }: { storyId: string; react: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    let timer = 0;
    const send = () => {
      const root = box.querySelector('.sb-stage') ?? box.querySelector('.sl-root') ?? box;
      const html = snippetFromDom(root);
      const scripts = scriptsFor(html);
      addons.getChannel().emit('sloyka/code', { storyId, react, html, scripts, scriptSources: Object.fromEntries(scripts.map((f) => [f, scriptSource(f)])) });
    };
    const later = () => { clearTimeout(timer); timer = window.setTimeout(send, 150); };
    later();
    const mo = new MutationObserver(later);
    mo.observe(box, { subtree: true, childList: true, attributes: true, characterData: true });
    return () => { clearTimeout(timer); mo.disconnect(); };
  }, [storyId, react]);
  return <div ref={ref} style={{ display: 'contents' }}>{children}</div>;
}

function Stage({ theme, label, refSlug, children }: { theme: 'light' | 'dark'; label?: string; refSlug?: string; children: ReactNode }) {
  return <div className="sb-stage sl-root" data-theme={theme} data-label={label} data-ref={refSlug}>{children}</div>;
}

const withStage: Decorator = (Story, ctx) => {
  const theme = (ctx.globals.theme as string) || 'both';
  const pair = ctx.parameters.pair !== false;
  const t = theme === 'dark' ? 'dark' : 'light';
  const refSlug = ctx.parameters.ref as string | undefined;
  // Тема страницы вокруг примера (фон body и всё, что вне .sl-root).
  document.documentElement.dataset.theme = t;
  document.body.style.background = 'var(--sl-bg)';

  let view: ReactNode;
  if (pair && theme === 'both') {
    view = (
      <div className="sb-pair" data-ref={refSlug}>
        <Stage theme="light" label="Светлая тема" refSlug={refSlug}><Story /></Stage>
        <Stage theme="dark" label="Тёмная тема" refSlug={refSlug}><Story /></Stage>
      </div>
    );
  } else if (!pair) {
    view = <div className="sl-root" data-theme={t} data-ref={refSlug}><Story /></div>;
  } else {
    view = <Stage theme={t} refSlug={refSlug}><Story /></Stage>;
  }

  view = <CodeSource storyId={ctx.id} react={storySource(ctx.parameters.fileName as string | undefined, ctx.name)}>{view}</CodeSource>;
  const key = componentFromTitle(ctx.title);
  const css = key ? componentCSS(key, { scale: Number(ctx.args.slScale ?? 100), radius: Number(ctx.args.slRadius ?? -1) }, '.sb-tweak ') : '';
  const hasBar = Boolean(key) || ctx.title === 'Основа/Редактор темы';
  return (
    <ToastProvider>
      {hasBar || css ? (
        <div className="sb-tweak">
          {css && <style>{css}</style>}
          <TemplateBar title={ctx.title} args={ctx.args as Args} />
          {view}
        </div>
      ) : view}
    </ToastProvider>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Тема',
      toolbar: { title: 'Тема', icon: 'mirror', items: [
        { value: 'both', title: 'Обе рядом' }, { value: 'light', title: 'Светлая' }, { value: 'dark', title: 'Тёмная' }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'both', viewport: { value: undefined } },
  // Размер и скругление есть у каждого компонента; в шаблон они уходят кнопкой «＋ В шаблон».
  args: { slScale: 100, slRadius: -1 },
  argTypes: {
    slScale: { name: 'Размер компонента, %', control: { type: 'range', min: 60, max: 160, step: 5 }, table: { category: 'Размер и форма' } },
    slRadius: { name: 'Скругление, px (−1 — как в теме)', control: { type: 'range', min: -1, max: 24, step: 1 }, table: { category: 'Размер и форма' } },
  },
  parameters: {
    layout: 'padded',
    pair: true,
    viewport: { options: {
      phone: { name: 'Телефон 390', styles: { width: '390px', height: '844px' }, type: 'mobile' },
      tablet: { name: 'Планшет 768', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
      laptop: { name: 'Ноутбук 1024', styles: { width: '1024px', height: '768px' }, type: 'desktop' },
      desktop: { name: 'Монитор 1440', styles: { width: '1440px', height: '900px' }, type: 'desktop' },
      wide: { name: 'Монитор 1920', styles: { width: '1920px', height: '1080px' }, type: 'desktop' },
    } },
    a11y: { test: 'error' },
  },
  decorators: [withStage],
};
export default preview;
