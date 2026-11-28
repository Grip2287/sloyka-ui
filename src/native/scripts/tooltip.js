/* Sloyka · 22 · Tooltip — подсказка (HTML + CSS).
   .sl-tooltip-host с вложенной .sl-tooltip[hidden]: подсказка видна при наведении и фокусе, Esc её скрывает. */
(function () {
  if (window.__slTooltip) return;
  window.__slTooltip = true;
  function set(host, shown) {
    var tip = host && host.querySelector('.sl-tooltip');
    if (!tip) return;
    tip.hidden = !shown;
    if (shown) host.setAttribute('aria-describedby', tip.id); else host.removeAttribute('aria-describedby');
  }
  function hostOf(t) { return t instanceof Element ? t.closest('.sl-tooltip-host') : null; }
  document.addEventListener('mouseover', function (e) { var h = hostOf(e.target); if (h && !h.contains(e.relatedTarget)) set(h, true); });
  document.addEventListener('mouseout', function (e) { var h = hostOf(e.target); if (h && !h.contains(e.relatedTarget)) set(h, false); });
  document.addEventListener('focusin', function (e) { set(hostOf(e.target), true); });
  document.addEventListener('focusout', function (e) { set(hostOf(e.target), false); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    Array.prototype.forEach.call(document.querySelectorAll('.sl-tooltip:not([hidden])'), function (t) {
      e.preventDefault();
      set(t.closest('.sl-tooltip-host'), false);
    });
  }, true);
})();
