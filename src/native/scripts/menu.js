/* Sloyka · 18 · Menu — меню с кнопкой (HTML + CSS).
   Кнопка .sl-menu__trigger открывает и закрывает панель (aria-controls → id панели).
   Закрывают: Esc (фокус возвращается на кнопку), щелчок снаружи, выбор пункта.
   Событие на .sl-menu-anchor: sl-toggle, detail.open. */
(function () {
  if (window.__slMenu) return;
  window.__slMenu = true;
  function parts(anchor) {
    var btn = anchor && anchor.querySelector('.sl-menu__trigger');
    var panel = btn && document.getElementById(btn.getAttribute('aria-controls'));
    return { btn: btn, panel: panel };
  }
  function set(anchor, open) {
    var p = parts(anchor);
    if (!p.btn || !p.panel || p.panel.hidden === !open) return;
    p.panel.hidden = !open;
    p.btn.setAttribute('aria-expanded', String(open));
    p.btn.classList.toggle('is-open', open);
    anchor.dispatchEvent(new CustomEvent('sl-toggle', { bubbles: true, detail: { open: open } }));
  }
  function openAnchors() {
    return Array.prototype.filter.call(document.querySelectorAll('.sl-menu-anchor'), function (a) {
      var p = parts(a);
      return p.panel && !p.panel.hidden;
    });
  }
  document.addEventListener('click', function (e) {
    var t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    var btn = t.closest('.sl-menu__trigger');
    if (btn) {
      var a = btn.closest('.sl-menu-anchor');
      var p = parts(a);
      if (p.panel) set(a, p.panel.hidden);
      return;
    }
    var item = t.closest('.sl-menu--popover .sl-menu__item');
    if (item) set(item.closest('.sl-menu-anchor'), false);
  });
  document.addEventListener('pointerdown', function (e) {
    openAnchors().forEach(function (a) { if (!a.contains(e.target)) set(a, false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || e.defaultPrevented) return;
    openAnchors().forEach(function (a) { e.preventDefault(); set(a, false); parts(a).btn.focus(); });
  });
})();
