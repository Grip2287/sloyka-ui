/* Sloyka · 00 · ThemeToggle — переключатель темы (HTML + CSS).
   Кнопка [data-sl-theme-toggle] меняет светлую и тёмную тему и запоминает выбор (localStorage 'sl-theme').
   Для страницы без мигания подключите в <head> файл theme-head.js. Из своего кода: slTheme.set('dark' | 'light' | 'system'). */
(function () {
  if (window.slTheme) return;
  var KEY = 'sl-theme';
  var SUN = '__SL_ICON_sun__';
  var MOON = '__SL_ICON_moon__';
  var root = document.documentElement;
  function resolved() {
    var t = root.dataset.theme;
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function sync() {
    var dark = resolved() === 'dark';
    Array.prototype.forEach.call(document.querySelectorAll('[data-sl-theme-toggle]'), function (b) {
      b.setAttribute('aria-pressed', String(dark));
      b.innerHTML = dark ? SUN : MOON;
    });
  }
  function set(theme) {
    if (theme === 'system') {
      delete root.dataset.theme;
      try { localStorage.removeItem(KEY); } catch (e) { /* тема просто не запомнится */ }
    } else {
      root.dataset.theme = theme;
      try { localStorage.setItem(KEY, theme); } catch (e) { /* тема просто не запомнится */ }
    }
    sync();
  }
  document.addEventListener('click', function (e) {
    var b = e.target instanceof Element ? e.target.closest('[data-sl-theme-toggle]') : null;
    if (b) set(resolved() === 'dark' ? 'light' : 'dark');
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', sync);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync); else sync();
  window.slTheme = { set: set, get: resolved };
})();
