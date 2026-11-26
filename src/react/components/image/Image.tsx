import { defineMeta, pick, warnOnce, cx } from '../../core';

const FITS = ['cover', 'contain'] as const;
const RADII = ['none', 'sm', 'md', 'lg'] as const;

export interface ImageProps {
  src: string;
  /** Обязателен; пустая строка — декоративная картинка. */
  alt: string;
  width?: number;
  height?: number;
  fit?: (typeof FITS)[number];
  radius?: (typeof RADII)[number];
  /** Не откладывать загрузку (главная картинка страницы). */
  priority?: boolean;
}

export const Image = defineMeta(function Image({ src, alt, width, height, fit, radius, priority }: ImageProps) {
  if (alt === undefined || alt === null) {
    warnOnce('Image', 'alt', 'нет alt; считаю картинку декоративной (alt=""). Опишите картинку или передайте alt="".');
  }
  const f = pick('Image', 'fit', fit, FITS, 'cover');
  const r = pick('Image', 'radius', radius, RADII, 'none');
  return (
    <img
      className={cx('sl-image', `sl-image--${f}`, r !== 'none' && `sl-image--r-${r}`)}
      src={src}
      alt={alt ?? ''}
      width={width}
      height={height}
      loading={priority ? undefined : 'lazy'}
      decoding="async"
    />
  );
}, {
  n: '00', group: 'Основа', name: 'Image', allowed: 'none',
  props: {
    src: { type: 'string', required: true }, alt: { type: 'string', required: true },
    width: { type: 'number' }, height: { type: 'number' },
    fit: { type: 'enum', options: FITS, default: 'cover' },
    radius: { type: 'enum', options: RADII, default: 'none' },
    priority: { type: 'boolean' },
  },
});
