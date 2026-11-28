// Свой код страницы: только обработчики событий. Разметку и классы Sloyka он не создаёт и не меняет —
// заполняет тексты, значения полей, атрибуты hidden и aria-invalid, клонирует готовый <template>.
const $ = (id) => document.getElementById(id);
const sites = $('sites');

// ── Сводка и фильтр ──
function refresh() {
  const query = $('query').value.trim().toLowerCase();
  const state = $('state').value;
  const cards = [...sites.querySelectorAll('article')];
  let shown = 0;
  for (const card of cards) {
    const name = card.querySelector('.sl-card__title').textContent.toLowerCase();
    const visible = (state === 'all' || card.dataset.accent === state) && name.includes(query);
    card.hidden = !visible;
    if (visible) shown++;
  }
  $('empty').hidden = shown > 0;
  const count = (tone) => cards.filter((c) => c.dataset.accent === tone).length;
  $('stat-all').textContent = String(cards.length);
  $('stat-ok').textContent = String(count('ok'));
  $('stat-warn').textContent = String(count('warn'));
  $('stat-crit').textContent = String(count('crit'));
}
$('query').addEventListener('input', refresh);
$('state').addEventListener('change', refresh);

// ── Ошибки полей: показать или скрыть готовую подпись .sl-error ──
function setError(input, message) {
  const error = $(input.getAttribute('aria-describedby').split(' ').pop());
  error.hidden = !message;
  if (message) { error.textContent = message; input.setAttribute('aria-invalid', 'true'); }
  else input.removeAttribute('aria-invalid');
  return !message;
}
function resetForm(dialog) {
  for (const input of dialog.querySelectorAll('input')) {
    input.value = '';
    if (input.hasAttribute('aria-describedby')) setError(input, '');
  }
}
for (const input of document.querySelectorAll('dialog input')) {
  input.addEventListener('input', () => { if (input.getAttribute('aria-invalid')) setError(input, ''); });
}
// Окно закрыли любым способом (Отменить, Esc, затемнение) — форма очищается.
for (const dialog of document.querySelectorAll('dialog')) dialog.addEventListener('sl-close', () => resetForm(dialog));

// ── Новый пользователь: 4 поля ──
$('user-save').addEventListener('click', () => {
  const form = $('user-modal');
  const field = (name) => form.querySelector(`[name="${name}"]`);
  const ok = [
    setError(field('name'), field('name').value.trim() ? '' : 'Укажите имя пользователя'),
    setError(field('email'), /^\S+@\S+\.\S+$/.test(field('email').value.trim()) ? '' : 'Укажите почту в формате name@example.ru'),
    setError(field('login'), field('login').value.trim() ? '' : 'Укажите логин'),
    setError(field('password'), field('password').value.length >= 8 ? '' : 'Пароль — не короче 8 символов'),
  ].every(Boolean);
  if (!ok) return;
  const name = field('name').value.trim();
  // здесь — отправка на сервер: fetch('/api/users', { method: 'POST', body: … })
  slModal.close('user-modal');
  slToast.ok(`Пользователь «${name}» сохранён`, { title: 'Готово' });
});

// ── Новый объект: клон готовой карточки ──
$('site-save').addEventListener('click', () => {
  const form = $('site-modal');
  const title = form.querySelector('[name="title"]');
  const address = form.querySelector('[name="address"]');
  if (!setError(title, title.value.trim() ? '' : 'Укажите название')) return;
  const card = $('site-card').content.firstElementChild.cloneNode(true);
  card.querySelector('.sl-card__title').textContent = title.value.trim();
  card.querySelector('.sl-card__sub').textContent = address.value.trim() || '—';
  sites.append(card);
  const name = title.value.trim();
  slModal.close('site-modal');
  slToast.ok(`Объект «${name}» добавлен`, { title: 'Готово' });
  refresh();
});

$('profile').addEventListener('click', () => slToast.info('Профиль'));
$('logout').addEventListener('click', () => slToast.info('Выход выполнен'));
refresh();
