// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/20 · Плавающее окно',
  tags: ["autodocs", "ref-base"],
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

export const Playground = {
  name: 'Песочница',
  args: { title: 'Чат смены', bar: true, body: 'Сообщений пока нет', input: 'Сообщение…', width: 360 },
  argTypes: {
    title: { name: 'Заголовок', control: 'text' },
    bar: { name: 'Панель кнопок', control: 'boolean' },
    body: { name: 'Содержимое', control: 'text' },
    input: { name: 'Строка ввода (пусто — нет)', control: 'text' },
    width: { name: 'Ширина, px', control: { type: 'range', min: 280, max: 560, step: 20 } },
  },
  render: a => `<section class="sl-window" style="width:${a.width}px">
    <div class="sl-window__head"><i data-ic="chat"></i><span class="sl-window__title">${a.title}</span><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    ${a.bar ? '<div class="sl-window__bar"><span class="sl-chip">На линии <span class="sl-count">1</span></span><button class="sl-btn sl-btn--sm">Голосовое оповещение</button></div>' : ''}
    <div class="sl-window__body">${a.body}</div>
    ${a.input ? `<div class="sl-window__foot"><div class="sl-compose"><input class="sl-input" placeholder="${a.input}"><button class="sl-btn sl-btn--icon sl-btn--primary" aria-label="Отправить"><i data-ic="arrow-right"></i></button></div></div>` : ''}</section>`,
};
