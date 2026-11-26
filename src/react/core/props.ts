// Vite и Next заменяют process.env.NODE_ENV при сборке приложения.
declare const process: { env: { NODE_ENV?: string } } | undefined;

export const isDev = (): boolean => typeof process === 'undefined' || process.env.NODE_ENV !== 'production';

const seen = new Set<string>();

/** Одно предупреждение на ключ; только вне production. */
export function warnOnce(component: string, key: string, message: string): void {
  if (!isDev()) return;
  const id = `${component}\u0000${key}`;
  if (seen.has(id)) return;
  seen.add(id);
  console.warn(`Sloyka · ${component}: ${message}`);
}

/** Только для тестов: сбрасывает дедупликацию предупреждений. */
export function resetWarnings(): void {
  seen.clear();
}

/** Выбирает вариант из фиксированного набора; неизвестное значение → предупреждение и fallback. */
export function pick<T extends string>(
  component: string,
  prop: string,
  value: unknown,
  options: readonly T[],
  fallback: T,
): T {
  if (value === undefined || value === null) return fallback;
  if ((options as readonly unknown[]).includes(value)) return value as T;
  warnOnce(component, prop, `${prop}="${String(value)}" недопустимо, варианты: ${options.join(', ')}`);
  return fallback;
}
