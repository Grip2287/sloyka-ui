// Проверка длинных слов: ничего не должно вылезать за экран.
export default { title: 'Проверки/Длинный текст', parameters: { pair: false } };
const W = 'Высококвалифицированныйспециалист';
const MAIL = 'very.long.email.address@example-company.ru';
export const LongText = {
  name: 'Длинный текст',
  render: () => `<div style="display:grid;gap:16px">
  <article class="sl-card" data-accent="ok"><div class="sl-card__head"><div><div class="sl-card__title">${W}</div><div class="sl-card__sub">${MAIL}</div></div><span class="sl-tag">${W}</span></div>
    <dl class="sl-kv"><dt>Почта</dt><dd>${MAIL}</dd><dt>${W}</dt><dd>${W}</dd></dl><div class="sl-card__foot"><span class="sl-status sl-status--ok">На связи</span></div></article>
  <div class="sl-list"><div class="sl-row"><div class="sl-row__main"><span class="sl-row__title">${W} ${MAIL}</span><span class="sl-status">Офлайн</span></div></div></div>
  <div class="sl-banner sl-banner--warn"><div class="sl-banner__title">${W}</div><div class="sl-banner__text">${MAIL}</div></div>
  <nav class="sl-nav sl-nav--rail"><a class="sl-nav__item" href="#"><i data-ic="users"></i><span class="sl-nav__label">${W}</span></a></nav>
</div>`,
};
