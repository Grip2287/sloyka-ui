/* Sloyka · 21 · Modal — поведение нативного модального окна (HTML + CSS).
   Кнопка <button data-sl-open="id-окна"> открывает <dialog class="sl-modal" id="id-окна">.
   Закрывают: кнопка «Закрыть» в шапке, любая кнопка с data-sl-close, Esc, щелчок по затемнению.
   Из своего кода: slModal.open('id'), slModal.close('id'). События на <dialog>: sl-open, sl-close. */
(function () {
  if (window.slModal) return;
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var openers = new WeakMap();
  var downOnBackdrop = false;
  function find(d) { return typeof d === 'string' ? document.getElementById(d) : d; }
  function open(id, opener) {
    var d = find(id);
    if (!d || d.open) return;
    openers.set(d, opener || (document.activeElement instanceof HTMLElement ? document.activeElement : null));
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    var body = d.querySelector('.sl-modal__body');
    var foot = d.querySelector('.sl-modal__foot');
    var target = d.querySelector('[autofocus]')
      || (body && body.querySelector(FOCUSABLE))
      || (foot && foot.querySelector(FOCUSABLE))
      || d.querySelector(FOCUSABLE);
    if (target) target.focus(); else { d.tabIndex = -1; d.focus(); }
    d.dispatchEvent(new CustomEvent('sl-open', { bubbles: true }));
  }
  function close(id) {
    var d = find(id);
    if (!d || !d.open) return;
    if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
    var back = openers.get(d);
    openers.delete(d);
    if (back && back.isConnected) back.focus();
    d.dispatchEvent(new CustomEvent('sl-close', { bubbles: true }));
  }
  document.addEventListener('click', function (e) {
    var t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    var opener = t.closest('[data-sl-open]');
    if (opener) { e.preventDefault(); open(opener.getAttribute('data-sl-open'), opener); return; }
    var d = t.closest('dialog.sl-modal');
    if (!d) return;
    if (t === d) { if (downOnBackdrop) close(d); downOnBackdrop = false; return; }
    if (t.closest('[data-sl-close]') || t.closest('.sl-modal__head .sl-btn')) close(d);
  });
  // Щелчок по затемнению: нажали и отпустили на самом <dialog>, а не на его содержимом.
  document.addEventListener('pointerdown', function (e) {
    downOnBackdrop = e.target instanceof Element && e.target.matches('dialog.sl-modal');
  });
  // Esc в нативном диалоге — событие cancel: закрываем сами, чтобы вернуть фокус.
  document.addEventListener('cancel', function (e) {
    if (e.target instanceof Element && e.target.matches('dialog.sl-modal')) { e.preventDefault(); close(e.target); }
  }, true);
  document.addEventListener('keydown', function (e) {
    var d = e.target instanceof Element ? e.target.closest('dialog.sl-modal[open]') : null;
    if (!d) return;
    if (e.key === 'Escape' && typeof d.showModal !== 'function') { e.preventDefault(); close(d); return; }
    if (e.key !== 'Tab') return;
    // Фокус по Tab ходит по кругу внутри окна.
    var items = Array.prototype.slice.call(d.querySelectorAll(FOCUSABLE));
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.slModal = { open: open, close: close };
})();
