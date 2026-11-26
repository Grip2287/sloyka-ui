import { defineMeta, renderLink, type LinkLike } from '../../core';
import { Icon, type IconName } from '../../icons';

export interface LinkCardProps {
  icon: IconName;
  title: string;
  text: string;
  href: string;
  linkAs?: LinkLike;
}

export const LinkCard = defineMeta(function LinkCard({ icon, title, text, href, linkAs }: LinkCardProps) {
  return <>{renderLink({
    href, linkAs, className: 'sl-card sl-card--interactive sl-link-card',
    children: (
      <>
        <Icon name={icon} size={20} />
        <div><div className="sl-card__title">{title}</div><div className="sl-card__sub">{text}</div></div>
        <Icon name="chevron-right" />
      </>
    ),
  })}</>;
}, {
  n: '08', group: 'Карточки-ссылки и шаги', name: 'LinkCard', allowed: 'none',
  props: {
    icon: { type: 'IconName', required: true }, title: { type: 'string', required: true },
    text: { type: 'string', required: true }, href: { type: 'string', required: true }, linkAs: { type: 'component' },
  },
});

export interface StepsProps {
  items: ReadonlyArray<{ title: string; text: string }>;
}

export const Steps = defineMeta(function Steps({ items }: StepsProps) {
  return (
    <div className="sl-steps">
      {items.map((s, i) => (
        <div className="sl-card sl-step" key={`${i}:${s.title}`}>
          <span className="sl-step__num">{i + 1}</span>
          <div className="sl-card__title">{s.title}</div>
          <div className="sl-card__sub">{s.text}</div>
        </div>
      ))}
    </div>
  );
}, {
  n: '08', group: 'Карточки-ссылки и шаги', name: 'Steps', allowed: 'none',
  props: { items: { type: '{ title, text }[]', required: true } },
});
