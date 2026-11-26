import type { ReactNode } from 'react';
import { defineMeta, renderLink, type LinkProps } from '../../core';

export interface LinkComponentProps extends LinkProps {
  children?: ReactNode;
}

export const Link = defineMeta(function Link({ href, linkAs, external, children }: LinkComponentProps) {
  return <>{renderLink({ href, linkAs, external, className: 'sl-link', children })}</>;
}, {
  n: '00', group: 'Основа', name: 'Link', allowed: 'any',
  props: { href: { type: 'string', required: true }, linkAs: { type: 'component' }, external: { type: 'boolean' } },
});
