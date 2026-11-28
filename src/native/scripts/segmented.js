/* Sloyka · 03 · Segmented — сегменты (HTML + CSS).
   Выбор щелчком и стрелками. Событие на .sl-segmented: change, detail.value (атрибут value кнопки). */
(function () {
  if (window.__slSegmented) return;
  window.__slSegmented = true;
  function select(group, btn, focus) {
    Array.prototype.forEach.call(group.querySelectorAll('button'), function (b) {
      var on = b === btn;
      b.setAttribute('aria-pressed', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    if (focus) btn.focus();
    group.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: btn.value } }));
  }
  document.addEventListener('click', function (e) {
    var b = e.target instanceof Element ? e.target.closest('.sl-segmented button') : null;
    if (b) select(b.closest('.sl-segmented'), b, false);
  });
  document.addEventListener('keydown', function (e) {
    var b = e.target instanceof Element ? e.target.closest('.sl-segmented button') : null;
    var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!b || !step) return;
    e.preventDefault();
    var group = b.closest('.sl-segmented');
    var all = Array.prototype.slice.call(group.querySelectorAll('button'));
    select(group, all[(all.indexOf(b) + step + all.length) % all.length], true);
  });
})();
