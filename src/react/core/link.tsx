import { createElement, type ComponentProps, type ComponentType, type ReactNode } from 'react';

/** Компонент роутера (next/link, Link из react-router): получает href, className, children и aria-*. */
export type LinkLike = ComponentType<{
  href: string;
  className?: string;
  children?: ReactNode;
  target?: string;
  rel?: string;
  [aria: `aria-${string}`]: string | boolean | undefined;
}>;

export interface LinkProps {
  href: string;
  linkAs?: LinkLike;
  external?: boolean;
}

export interface RenderLinkArgs extends LinkProps {
  className?: string;
  children?: ReactNode;
  aria?: Record<`aria-${string}`, string | boolean | undefined>;
}

/** Внутренний помощник: <a> или linkAs; external → target=_blank + rel. */
export function renderLink({ href, linkAs, external, className, children, aria }: RenderLinkArgs): ReactNode {
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const props = { href, className, ...ext, ...aria };
  return linkAs ? createElement(linkAs, props as ComponentProps<LinkLike>, children) : createElement('a', props as ComponentProps<'a'>, children);
}
