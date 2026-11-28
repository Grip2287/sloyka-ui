/* Sloyka · 02 · Compose — строка сообщения (HTML + CSS).
   Enter или кнопка отправляют текст: событие на .sl-compose — sl-send, detail.value; поле очищается.
   Пустой текст не отправляется. */
(function () {
  if (window.__slCompose) return;
  window.__slCompose = true;
  function send(box) {
    var input = box.querySelector('.sl-input');
    if (!input || input.disabled || !input.value.trim()) return;
    var value = input.value;
    input.value = '';
    box.dispatchEvent(new CustomEvent('sl-send', { bubbles: true, detail: { value: value } }));
  }
  document.addEventListener('click', function (e) {
    var b = e.target instanceof Element ? e.target.closest('.sl-compose .sl-btn') : null;
    if (b) send(b.closest('.sl-compose'));
  });
  document.addEventListener('keydown', function (e) {
    var i = e.target instanceof Element ? e.target.closest('.sl-compose .sl-input') : null;
    if (i && e.key === 'Enter' && !e.isComposing) { e.preventDefault(); send(i.closest('.sl-compose')); }
  });
})();
