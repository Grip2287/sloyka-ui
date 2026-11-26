// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/20 · Плавающее окно',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Окно поверх карты (чат смены): заголовок с иконкой и закрытием, панель кнопок, содержимое, строка ввода."}}},
};

export const Default = {
  name: 'Плавающее окно',
  render: () => `<section class="sl-window">
    <div class="sl-window__head"><i data-ic="chat"></i><span class="sl-window__title">Чат смены</span><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    <div class="sl-window__bar"><span class="sl-chip">На линии <span class="sl-count">1</span></span><button class="sl-btn sl-btn--sm">Голосовое оповещение</button></div>
    <div class="sl-window__body">Сообщений пока нет</div>
    <div class="sl-window__foot"><div class="sl-compose"><input class="sl-input" placeholder="Сообщение…"><button class="sl-btn sl-btn--icon sl-btn--primary" aria-label="Отправить"><i data-ic="arrow-right"></i></button></div></div>
  </section>`,
};
