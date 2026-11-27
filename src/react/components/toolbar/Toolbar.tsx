import type { ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, checkChildren } from '../../core';

const CONTROLS = ['Button', 'ButtonGroup', 'Field', 'Search', 'Select', 'Textarea', 'Compose', 'Segmented', 'Switch', 'Checkbox', 'Radio', 'RadioGroup'];

export interface ToolbarProps {
  children?: ReactNode;
}
function ToolbarImpl({ children }: ToolbarProps) {
  checkChildren(ToolbarImpl as unknown as SloykaMarked, children);
  return <div className="sl-toolbar">{children}</div>;
}
const ToolbarBase = defineMeta(ToolbarImpl, {
  n: '15', group: 'Заголовок страницы и панель фильтров', name: 'Toolbar', allowed: [...CONTROLS, 'Toolbar.End'],
  props: {},
});

export interface ToolbarEndProps {
  children?: ReactNode;
}
function ToolbarEndImpl({ children }: ToolbarEndProps) {
  checkChildren(ToolbarEndImpl as unknown as SloykaMarked, children);
  return <div className="sl-toolbar__end">{children}</div>;
}
const ToolbarEnd = defineMeta(ToolbarEndImpl, {
  n: '15', group: 'Заголовок страницы и панель фильтров', name: 'Toolbar.End', allowed: CONTROLS,
  props: {},
});

/** Панель фильтров; `Toolbar.End` прижимает главное действие вправо. */
export const Toolbar = Object.assign(ToolbarBase, { End: ToolbarEnd });
