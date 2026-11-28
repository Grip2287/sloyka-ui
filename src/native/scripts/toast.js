/* Sloyka · 22 · Toast — уведомления (HTML + CSS).
   slToast.ok(text, { title, duration }), а также warn, crit, info. crit не скрывается сам, остальные — через 5 с.
   Возвращает { close }. Разметка уведомления совпадает с React-версией (useToast). */
(function () {
  if (window.slToast) return;
  var ICON = { ok: '__SL_ICON_check__', warn: '__SL_ICON_alert__', crit: '__SL_ICON_alert__', info: '__SL_ICON_info__' };
  var CLOSE = '<button class="sl-btn sl-btn--ghost sl-btn--sm sl-btn--icon" type="button" aria-label="Закрыть">__SL_ICON_x__</button>';
  function region() {
    var r = document.querySelector('.sl-toast-region');
    if (!r) {
      r = document.createElement('div');
      r.className = 'sl-toast-region';
      r.setAttribute('aria-live', 'polite');
      document.body.appendChild(r);
    }
    return r;
  }
  function span(cls, value) { var el = document.createElement('span'); el.className = cls; el.textContent = value; return el; }
  function make(kind) {
    return function (message, options) {
      options = options || {};
      var duration = options.duration != null ? options.duration : (kind === 'crit' ? 0 : 5000);
      var el = document.createElement('div');
      el.className = 'sl-toast sl-toast--' + kind;
      el.setAttribute('role', kind === 'crit' ? 'alert' : 'status');
      var icon = document.createElement('span');
      icon.className = 'sl-toast__icon';
      icon.innerHTML = ICON[kind];
      var body = document.createElement('div');
      body.className = 'sl-toast__body';
      if (options.title) { body.appendChild(span('sl-toast__title', options.title)); body.appendChild(span('sl-toast__text', message)); }
      else body.appendChild(span('sl-toast__title', message));
      el.appendChild(icon);
      el.appendChild(body);
      el.insertAdjacentHTML('beforeend', CLOSE);
      var timer = 0;
      var close = function () { clearTimeout(timer); el.remove(); };
      el.lastElementChild.addEventListener('click', close);
      region().appendChild(el);
      if (duration > 0) timer = setTimeout(close, duration);
      return { close: close };
    };
  }
  window.slToast = { ok: make('ok'), warn: make('warn'), crit: make('crit'), info: make('info') };
})();
