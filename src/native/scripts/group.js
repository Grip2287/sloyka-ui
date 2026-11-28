/* Sloyka · 11 · Group — сворачиваемая группа списка (HTML + CSS).
   Щелчок по .sl-group__head сворачивает и разворачивает группу. Событие на .sl-group: sl-toggle, detail.collapsed. */
(function () {
  if (window.__slGroup) return;
  window.__slGroup = true;
  document.addEventListener('click', function (e) {
    var head = e.target instanceof Element ? e.target.closest('.sl-group__head') : null;
    if (!head) return;
    var g = head.closest('.sl-group');
    var collapsed = !g.hasAttribute('data-collapsed');
    if (collapsed) g.setAttribute('data-collapsed', ''); else g.removeAttribute('data-collapsed');
    head.setAttribute('aria-expanded', String(!collapsed));
    var count = head.querySelector('.sl-count');
    if (count) count.classList.toggle('sl-count--solid', !collapsed);
    g.dispatchEvent(new CustomEvent('sl-toggle', { bubbles: true, detail: { collapsed: collapsed } }));
  });
})();
