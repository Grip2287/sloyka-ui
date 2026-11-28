/* Sloyka · 20 · Window — плавающее окно (HTML + CSS).
   Кнопка «Закрыть» в шапке прячет окно (hidden) и шлёт событие sl-close на .sl-window. */
(function () {
  if (window.__slWindow) return;
  window.__slWindow = true;
  document.addEventListener('click', function (e) {
    var b = e.target instanceof Element ? e.target.closest('.sl-window__head .sl-btn') : null;
    if (!b) return;
    var w = b.closest('.sl-window');
    w.hidden = true;
    w.dispatchEvent(new CustomEvent('sl-close', { bubbles: true }));
  });
})();
