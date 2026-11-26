/** Регистрирует элемент только один раз: библиотеку можно подключить дважды без ошибок. */
export function define(tag, ctor) {
  if (typeof customElements !== 'undefined' && !customElements.get(tag)) customElements.define(tag, ctor);
}

/** Выполняет fn, когда содержимое элемента уже разобрано (элемент может подключиться раньше своих детей). */
export function whenParsed(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
  else queueMicrotask(fn);
}
