import type { ReactNode } from 'react';
import type { SloykaMarked } from '../../core';
import { defineMeta, pick, cx, checkChildren, renderLink, type LinkLike } from '../../core';
import { Icon, type IconName } from '../../icons';

const ACCENTS = ['ok', 'warn', 'crit', 'off'] as const;

/** Что можно класть в карточку: поля, теги, статусы, показатель, таблицу, пары «название — значение», кнопки и текст. */
const CARD_ALLOWED = [
  'Card.Head', 'Card.Foot', 'KeyValue', 'Metric', 'Table', 'Button', 'ButtonGroup',
  'Field', 'Search', 'Select', 'Textarea', 'Compose', 'Segmented', 'Switch', 'Checkbox', 'Radio', 'RadioGroup',
  'Tag', 'Count', 'Chip', 'Status', 'StatusPill', 'Text', 'Stack', 'Grid', 'Link', 'Image',
];

export interface CardProps {
  /** Цветная полоса слева по статусу. */
  accent?: (typeof ACCENTS)[number];
  /** Подъём при наведении (сама по себе не делает карточку ссылкой). */
  interactive?: boolean;
  /** Вся карточка становится ссылкой. */
  href?: string;
  linkAs?: LinkLike;
  children?: ReactNode;
}

function CardImpl({ accent, interactive, href, linkAs, children }: CardProps) {
  checkChildren(CardImpl as unknown as SloykaMarked, children);
  const a = accent === undefined ? undefined : pick('Card', 'accent', accent, ACCENTS, 'off');
  const className = cx('sl-card', (interactive || href !== undefined) && 'sl-card--interactive');
  if (href !== undefined) {
    return <>{renderLink({
      href, linkAs, className, children,
      // data-accent передаётся вместе с aria: renderLink просто разворачивает объект в атрибуты.
      aria: { 'data-accent': a } as unknown as Record<`aria-${string}`, string | undefined>,
    })}</>;
  }
  return <article className={className} data-accent={a}>{children}</article>;
}

const CardBase = defineMeta(CardImpl, {
  n: '06', group: 'Карточка объекта', name: 'Card', allowed: CARD_ALLOWED,
  props: {
    accent: { type: 'enum', options: ACCENTS },
    interactive: { type: 'boolean' },
    href: { type: 'string' },
    linkAs: { type: 'component' },
  },
});

export interface CardHeadProps {
  title: string;
  subtitle?: string;
  /** Справа в шапке: тег, счётчик, статус. */
  aside?: ReactNode;
  /** Круглая иконка слева от заголовка (вариант для пользователя). */
  icon?: IconName;
}

function CardHeadImpl({ title, subtitle, aside, icon }: CardHeadProps) {
  checkChildren(CardHeadImpl as unknown as SloykaMarked, aside);
  const text = (
    <div>
      <div className="sl-card__title">{title}</div>
      {subtitle && <div className="sl-card__sub">{subtitle}</div>}
    </div>
  );
  return (
    <div className="sl-card__head">
      {icon ? <div className="sl-card__who"><span className="sl-avatar"><Icon name={icon} /></span>{text}</div> : text}
      {aside}
    </div>
  );
}
const CardHead = defineMeta(CardHeadImpl, {
  n: '06', group: 'Карточка объекта', name: 'Card.Head', allowed: ['Tag', 'Count', 'Chip', 'Status', 'StatusPill', 'Button'],
  props: { title: { type: 'string', required: true }, subtitle: { type: 'string' }, aside: { type: 'ReactNode' }, icon: { type: 'IconName' } },
});

export interface CardFootProps {
  children?: ReactNode;
}
function CardFootImpl({ children }: CardFootProps) {
  checkChildren(CardFootImpl as unknown as SloykaMarked, children);
  return <div className="sl-card__foot">{children}</div>;
}
const CardFoot = defineMeta(CardFootImpl, {
  n: '06', group: 'Карточка объекта', name: 'Card.Foot', allowed: ['Status', 'StatusPill', 'Tag', 'Count', 'Button', 'ButtonGroup', 'Text', 'Link'],
  props: {},
});

export const Card = Object.assign(CardBase, { Head: CardHead, Foot: CardFoot });

export interface KeyValueProps {
  /** Пары «название — значение»: значение — текст или компонент (Tag, Status). */
  items: ReadonlyArray<readonly [label: string, value: ReactNode]>;
}

function KeyValueImpl({ items }: KeyValueProps) {
  items.forEach(([, v]) => checkChildren(KeyValueImpl as unknown as SloykaMarked, v));
  return (
    <dl className="sl-kv">
      {items.map(([label, value]) => <KvPair key={label} label={label} value={value} />)}
    </dl>
  );
}
function KvPair({ label, value }: { label: string; value: ReactNode }) {
  return <><dt>{label}</dt><dd>{value}</dd></>;
}
export const KeyValue = defineMeta(KeyValueImpl, {
  n: '06', group: 'Карточка объекта', name: 'KeyValue', allowed: ['Tag', 'Count', 'Chip', 'Status', 'StatusPill', 'Text', 'Link'],
  props: { items: { type: '[label, node][]', required: true } },
});
