// Ставит сохранённую тему до отрисовки. В <head> лучше вставить однострочник из README (без модуля);
// этот файл — для проектов со сборщиком.
export function applySavedTheme() {
  try {
    const t = localStorage.getItem('sl-theme');
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  } catch { /* localStorage закрыт — остаётся тема по системе */ }
}
applySavedTheme();
