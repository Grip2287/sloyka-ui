import type { ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, checkChildren } from '../../core';

export interface PageHeaderProps {
  /** Заголовок раздела (рисуется капсом, h1). */
  title: string;
  /** Подпись справа от заголовка: текст, Text, Tag или Status. */
  aside?: ReactNode;
}

function PageHeaderImpl({ title, aside }: PageHeaderProps) {
  checkChildren(PageHeaderImpl as unknown as SloykaMarked, aside);
  return (
    <div className="sl-page-head">
      <h1 className="sl-page-title">{title}</h1>
      {aside !== undefined && aside !== null && aside !== false && <span className="sl-page-head__aside">{aside}</span>}
    </div>
  );
}
export const PageHeader = defineMeta(PageHeaderImpl, {
  n: '15', group: 'Заголовок страницы и панель фильтров', name: 'PageHeader',
  allowed: ['Text', 'Tag', 'Count', 'Status', 'StatusPill', 'Chip'],
  props: { title: { type: 'string', required: true }, aside: { type: 'ReactNode' } },
});
