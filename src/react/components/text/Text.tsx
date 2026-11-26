import type { ReactNode } from 'react';
import { defineMeta, pick, cx } from '../../core';

const LEVELS = ['page', 'section', 'title', 'body', 'small', 'caption'] as const;
const TONES = ['default', 'muted', 'ok', 'warn', 'crit'] as const;
const WEIGHTS = ['normal', 'strong'] as const;
const TAGS = { page: 'h1', section: 'h2', title: 'h3', body: 'p', small: 'p', caption: 'span' } as const;

export interface TextProps {
  as?: (typeof LEVELS)[number];
  tone?: (typeof TONES)[number];
  weight?: (typeof WEIGHTS)[number];
  /** Рендерить span: для вложения в другой Text. */
  inline?: boolean;
  children?: ReactNode;
}

export const Text = defineMeta(function Text({ as, tone, weight, inline, children }: TextProps) {
  const level = pick('Text', 'as', as, LEVELS, 'body');
  const t = pick('Text', 'tone', tone, TONES, 'default');
  const w = pick('Text', 'weight', weight, WEIGHTS, 'normal');
  const Tag = inline ? 'span' : TAGS[level];
  return (
    <Tag className={cx('sl-text', `sl-text--${level}`, t !== 'default' && `sl-text--${t}`, w === 'strong' && 'sl-text--strong')}>
      {children}
    </Tag>
  );
}, {
  n: '00', group: 'Основа', name: 'Text', allowed: 'any',
  props: {
    as: { type: 'enum', options: LEVELS, default: 'body' },
    tone: { type: 'enum', options: TONES, default: 'default' },
    weight: { type: 'enum', options: WEIGHTS, default: 'normal' },
    inline: { type: 'boolean' },
  },
});
