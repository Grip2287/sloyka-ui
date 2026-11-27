import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import type { SloykaMarked, SloykaMeta } from './meta';
import { isDev, warnOnce } from './props';

/**
 * Dev-проверка детей по `allowed` из метки компонента.
 * Пропускает текст, числа, null/false, массивы, фрагменты и немеченые функции-компоненты.
 */
export function checkChildren(component: SloykaMarked, children: ReactNode): void {
  if (!isDev()) return;
  const { name, allowed } = component.__sloyka;
  if (allowed === 'any') return;
  walk(name, allowed, children);
}

function walk(owner: string, allowed: Exclude<SloykaMeta['allowed'], 'any'>, node: ReactNode): void {
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return;
    const type = child.type as unknown;
    if (type === Fragment) {
      walk(owner, allowed, (child.props as { children?: ReactNode }).children);
      return;
    }
    let found: string | undefined;
    if (typeof type === 'string') {
      // Серверные Sloyka-дети приходят в клиентский контейнер готовыми host-элементами с классом sl-* — это допустимый вывод Sloyka.
      const cls = (child.props as { className?: unknown }).className;
      if (typeof cls === 'string' && cls.split(/\s+/).some((c) => c.startsWith('sl-'))) return;
      found = type;
    }
    else if (type && (typeof type === 'function' || typeof type === 'object')) {
      found = (type as Partial<SloykaMarked>).__sloyka?.name;
    }
    if (found === undefined) return; // немеченый компонент — не заглядываем внутрь
    if (allowed !== 'none' && allowed.includes(found)) return;
    const list = allowed === 'none' ? 'ничего' : allowed.join(', ');
    warnOnce(owner, `child:${found}`, `<${found}> недопустим внутри, разрешено: ${list}`);
  });
}
