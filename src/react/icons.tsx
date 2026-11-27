import type { ReactElement } from 'react';
import { defineMeta } from './core';

// Иконки Sloyka: сетка 16×16, линия 1.5, currentColor. Набор перенесён из 0.1.x без изменений.
export const ICON_PATHS = {
  search: '<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/>',
  'chevron-down': '<path d="M4 6l4 4 4-4"/>',
  'chevron-up': '<path d="M4 10l4-4 4 4"/>',
  'chevron-right': '<path d="M6 4l4 4-4 4"/>',
  plus: '<path d="M8 3v10M3 8h10"/>',
  minus: '<path d="M3 8h10"/>',
  x: '<path d="M4 4l8 8M12 4l-8 8"/>',
  'arrow-left': '<path d="M13 8H3M7 4L3 8l4 4"/>',
  'arrow-right': '<path d="M3 8h10M9 4l4 4-4 4"/>',
  refresh: '<path d="M13 5.5A5.5 5.5 0 1 0 13.5 9"/><path d="M13.5 2.5v3h-3"/>',
  moon: '<path d="M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5z"/>',
  sun: '<circle cx="8" cy="8" r="2.8"/><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M12.6 3.4l-1 1M4.4 11.6l-1 1"/>',
  power: '<path d="M8 2v6"/><path d="M4.6 4.4a5 5 0 1 0 6.8 0"/>',
  user: '<circle cx="8" cy="5.5" r="2.5"/><path d="M3 13.5c.6-2.6 2.6-3.8 5-3.8s4.4 1.2 5 3.8"/>',
  users: '<circle cx="6" cy="5.8" r="2.2"/><path d="M2 13c.5-2.3 2-3.5 4-3.5s3.5 1.2 4 3.5"/><path d="M10.5 3.8a2 2 0 0 1 0 4M12 9.8c1.2.4 1.8 1.4 2 3"/>',
  layers: '<path d="M8 2l6 3-6 3-6-3z"/><path d="M2 8l6 3 6-3"/><path d="M2 11l6 3 6-3"/>',
  map: '<path d="M2 4l4-1.5 4 1.5 4-1.5v9.5L10 13.5 6 12l-4 1.5z"/><path d="M6 2.5V12M10 4v9.5"/>',
  panel: '<rect x="2" y="2.5" width="12" height="11" rx="2"/><path d="M6.5 2.5v11"/>',
  chat: '<path d="M2.5 3.5h11v7.5H7l-3 2.5V11H2.5z"/>',
  edit: '<path d="M10.5 2.5l3 3L6 13H3v-3z"/><path d="M9 4l3 3"/>',
  grid: '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>',
  filter: '<path d="M2.5 4h11M4.5 8h7M6.5 12h3"/>',
  bell: '<path d="M4 11V7.2a4 4 0 0 1 8 0V11l1 1.5H3z"/><path d="M6.5 14.2h3"/>',
  shield: '<path d="M8 1.8l5 2v3.9c0 3-2.1 5-5 6.3-2.9-1.3-5-3.3-5-6.3V3.8z"/>',
  plug: '<path d="M6 1.8v3M10 1.8v3"/><path d="M4.5 4.8h7v2.7a3.5 3.5 0 0 1-7 0z"/><path d="M8 11v3.2"/>',
  server: '<rect x="2.5" y="2.5" width="11" height="4.5" rx="1.2"/><rect x="2.5" y="9" width="11" height="4.5" rx="1.2"/><path d="M5 4.8h.1M5 11.3h.1"/>',
  journal: '<rect x="3" y="2" width="10" height="12" rx="1.5"/><path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3"/>',
  login: '<path d="M9.5 2.5h2.5a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9.5"/><path d="M2.5 8h7M7 5.5L9.5 8 7 10.5"/>',
  pulse: '<path d="M1.5 8.5h3l1.5-4 3 8 1.5-4h4"/>',
  help: '<circle cx="8" cy="8" r="6"/><path d="M6.3 6.3a1.8 1.8 0 0 1 3.5.6c0 1.3-1.8 1.5-1.8 2.7M8 11.6v.1"/>',
  check: '<path d="M3 8.5l3 3 7-7"/>',
  alert: '<path d="M8 2.3l6 10.7H2z"/><path d="M8 6.5v3M8 11.3v.1"/>',
  info: '<circle cx="8" cy="8" r="6"/><path d="M8 7.3v4M8 4.9v.1"/>',
  upload: '<path d="M8 10.5V2.5M5 5.5l3-3 3 3"/><path d="M2.5 10.5v2a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-2"/>',
  maximize: '<path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10"/>',
  menu: '<path d="M2.5 4h11M2.5 8h11M2.5 12h11"/>',
  key: '<circle cx="5.5" cy="10.5" r="2.7"/><path d="M7.4 8.6L13 3M11 5l1.7 1.7"/>',
  target: '<circle cx="8" cy="8" r="5"/><circle cx="8" cy="8" r="1.3"/>',
  wrench: '<path d="M10.5 2.5a3 3 0 0 0-2.8 4.1L2.8 11.5a1.2 1.2 0 0 0 1.7 1.7l4.9-4.9a3 3 0 0 0 4.1-2.8l-1.9 1.9-1.8-.3-.3-1.8z"/>',
  camera: '<rect x="2" y="4.5" width="8.5" height="7" rx="1.5"/><path d="M10.5 7l3.5-2v6l-3.5-2"/>',
  phone: '<path d="M3.5 2.5H6l1 3-1.5 1a7 7 0 0 0 3.5 3.5l1-1.5 3 1V12a1 1 0 0 1-1 1A10.5 10.5 0 0 1 2.5 3.5a1 1 0 0 1 1-1z"/>',
} as const;

export type IconName = keyof typeof ICON_PATHS;

export interface IconProps {
  name: IconName;
  size?: 16 | 20;
}

function IconImpl({ name, size = 16 }: IconProps): ReactElement {
  return (
    <svg
      className="sl-ic"
      viewBox="0 0 16 16"
      aria-hidden="true"
      {...(size === 20 ? { width: 20, height: 20, style: { width: 20, height: 20 } } : {})}
      // Статичные пути из ICON_PATHS, пользовательский ввод сюда не попадает.
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] ?? '' }}
    />
  );
}

export const Icon = defineMeta(IconImpl, {
  n: '00', group: 'Основа', name: 'Icon', allowed: 'none',
  props: {
    name: { type: 'enum', options: Object.keys(ICON_PATHS), required: true, description: 'Имя иконки из набора Sloyka' },
    size: { type: 'enum', options: ['16', '20'], default: '16' },
  },
});
