// Панель «Код» под каждым примером: React-исходник примера и та же вёрстка нативными компонентами (HTML + CSS).
import React, { useEffect, useState } from 'react';
import { addons, types, useChannel, useStorybookState } from 'storybook/manager-api';
import { AddonPanel, SyntaxHighlighter } from 'storybook/internal/components';

const ADDON = 'sloyka/code';
const EVENT = 'sloyka/code';

interface CodeEvent { storyId: string; react: string; html: string; scripts: string[]; scriptSources: Record<string, string> }

const TAB = (active: boolean) => ({
  font: 'inherit', fontSize: 13, padding: '6px 12px', border: 0, cursor: 'pointer',
  borderBottom: `2px solid ${active ? '#2563eb' : 'transparent'}`, background: 'transparent', color: 'inherit', fontWeight: active ? 600 : 400,
});

function nativeHead(scripts: string[]) {
  return [
    '<!-- Нативная вёрстка Sloyka: только HTML + CSS. Все варианты каждого компонента — node_modules/sloyka/native/*.html. -->',
    '<!-- Подключение один раз на странице: -->',
    '<link rel="stylesheet" href="node_modules/sloyka/dist/styles.css">',
    '<script src="node_modules/sloyka/native/theme-head.js"></script>  <!-- в <head>: тема без мигания -->',
    ...scripts.map((s) => `<script src="node_modules/sloyka/native/${s}"></script>  <!-- поведение компонента -->`),
    '',
  ].join('\n');
}

function CodePanel() {
  const state = useStorybookState();
  const [tab, setTab] = useState<'react' | 'html' | 'js'>('react');
  const [data, setData] = useState<CodeEvent | null>(null);
  useChannel({ [EVENT]: (e: CodeEvent) => setData(e) });
  useEffect(() => { setData(null); }, [state.storyId]);
  const html = data && data.storyId === state.storyId ? data : null;

  const react = html ? (html.react || 'Исходник этого примера не найден.') : 'Загрузка…';
  const nativeCode = html ? nativeHead(html.scripts) + html.html : 'Загрузка разметки…';
  const jsCode = html ? html.scripts.map((s) => `// sloyka/native/${s}\n${html.scriptSources[s] ?? ''}`).join('\n\n') : '';
  const code = tab === 'react' ? react : tab === 'html' ? nativeCode : jsCode;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(128,128,128,.25)', padding: '0 8px', alignItems: 'center' }}>
        <button type="button" style={TAB(tab === 'react')} onClick={() => setTab('react')}>React</button>
        <button type="button" style={TAB(tab === 'html')} onClick={() => setTab('html')}>HTML + CSS (нативные)</button>
        {html && html.scripts.length > 0 && (
          <button type="button" style={TAB(tab === 'js')} onClick={() => setTab('js')}>JS компонента ({html.scripts.join(', ')})</button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>
          {tab === 'react' ? 'import из пакета sloyka' : 'то же самое без React — для вёрстки «только HTML и CSS»'}
        </span>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <SyntaxHighlighter language={tab === 'react' ? 'jsx' : tab === 'html' ? 'html' : 'jsextra'} copyable bordered={false} padded>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

addons.register(ADDON, () => {
  addons.add(`${ADDON}/panel`, {
    type: types.PANEL,
    title: 'Код',
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => <AddonPanel active={Boolean(active)}><CodePanel /></AddonPanel>,
  });
});
