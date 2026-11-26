import type { ReactNode } from 'react';
import { defineMeta } from '../../core';
import { Icon } from '../../icons';

export interface DisclosureProps {
  title: string;
  defaultOpen?: boolean;
  children?: ReactNode;
}

/** Нативный <details>: раскрывается без JS, поэтому компонент не клиентский. */
export const Disclosure = defineMeta(function Disclosure({ title, defaultOpen, children }: DisclosureProps) {
  return (
    <details className="sl-disclosure" open={defaultOpen || undefined}>
      <summary><Icon name="chevron-right" /><span className="sl-caps">{title}</span></summary>
      {children !== undefined && children !== null && children !== false && <div className="sl-disclosure__body">{children}</div>}
    </details>
  );
}, {
  n: '12', group: 'Раскрывающиеся разделы', name: 'Disclosure', allowed: 'any',
  props: { title: { type: 'string', required: true }, defaultOpen: { type: 'boolean' } },
});
