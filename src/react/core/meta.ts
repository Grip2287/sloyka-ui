export interface PropSpec {
  type: string;
  options?: readonly string[];
  default?: unknown;
  required?: boolean;
  description?: string;
}

export interface SloykaMeta {
  /** Номер компонента '00'–'24'. */
  n: string;
  /** Название группы (по-русски), как в Storybook 0.1.x. */
  group: string;
  name: string;
  /** Что можно класть внутрь: всё, ничего или список имён компонентов. */
  allowed: 'any' | 'none' | string[];
  props: Record<string, PropSpec>;
}

export type SloykaMarked = { __sloyka: SloykaMeta };

/** Вешает метку `__sloyka` на компонент и возвращает его же. */
export function defineMeta<T extends object>(component: T, meta: SloykaMeta): T & SloykaMarked {
  (component as T & SloykaMarked).__sloyka = meta;
  return component as T & SloykaMarked;
}
