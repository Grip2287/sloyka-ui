/* Sloyka · 24 · Shell — меню на телефоне (HTML + CSS).
   Кнопка .sl-shell__toggle открывает и закрывает меню; Esc, затемнение и выбор пункта закрывают.
   Без скрипта меню всё равно открывается ссылкой #sl-nav. */
(function () {
  if (window.__slShell) return;
  window.__slShell = true;
  function set(shell, open) {
    if (!shell || shell.hasAttribute('data-nav-open') === open) return;
    var toggle = shell.querySelector('.sl-shell__toggle');
    if (open) shell.setAttribute('data-nav-open', ''); else shell.removeAttribute('data-nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    if (open) { var first = shell.querySelector('.sl-shell__nav .sl-nav__item'); if (first) first.focus(); }
    else if (toggle) toggle.focus();
  }
  document.addEventListener('click', function (e) {
    var t = e.target instanceof Element ? e.target : null;
    var shell = t && t.closest('.sl-shell');
    if (!shell) return;
    if (t.closest('.sl-shell__toggle')) { e.preventDefault(); set(shell, !shell.hasAttribute('data-nav-open')); return; }
    if (t.closest('.sl-shell__backdrop')) { set(shell, false); return; }
    if (shell.hasAttribute('data-nav-open') && t.closest('.sl-shell__nav .sl-nav__item')) set(shell, false);
  });
  document.addEventListener('keydown', function (e) {
    var toggle = e.target instanceof Element ? e.target.closest('.sl-shell__toggle') : null;
    if (toggle && e.key === ' ') {
      e.preventDefault();
      var s = toggle.closest('.sl-shell');
      set(s, !s.hasAttribute('data-nav-open'));
      return;
    }
    if (e.key !== 'Escape' || e.defaultPrevented || document.querySelector('dialog[open]')) return;
    Array.prototype.forEach.call(document.querySelectorAll('.sl-shell[data-nav-open]'), function (s) { set(s, false); });
  });
})();
