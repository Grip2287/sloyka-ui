// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/21 · Модальное окно',
  tags: ["autodocs", "ref-base"],
  parameters: {"docs": {"description": {"component": "Форма поверх затемнения: заголовок, поля, кнопки внизу."}}},
};

export const Default = {
  name: 'Модальное окно',
  render: () => `<div style="display:grid;grid-template-columns:minmax(0,420px);justify-content:center;padding:28px;border-radius:var(--sl-r-lg);background:var(--sl-backdrop)"><div class="sl-modal" role="dialog" aria-labelledby="m1">
    <div class="sl-modal__head"><span class="sl-modal__title" id="m1">Новое устройство</span><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    <div class="sl-modal__body">
      <label class="sl-field"><span class="sl-label">Название</span><input class="sl-input" placeholder="Например, Камера КПП-2"></label>
      <div class="g2"><label class="sl-field"><span class="sl-label">Класс</span><select class="sl-select" aria-label="Видео"><option>Видео</option></select></label><label class="sl-field"><span class="sl-label">Адрес</span><input class="sl-input" placeholder="10.0.0.1:9100"></label></div>
      <label class="sl-switch"><input type="checkbox" checked>Принимать данные</label>
    </div>
    <div class="sl-modal__foot"><button class="sl-btn sl-btn--ghost">Отмена</button><button class="sl-btn sl-btn--primary">Добавить</button></div>
  </div></div>`,
};

export const Live = {
  name: 'Открыть по кнопке',
  parameters: { pair: false },
  render: () => `<button class="sl-btn sl-btn--primary" data-sl-open="demo-modal"><i data-ic="plus"></i>Добавить устройство</button>
<sl-modal id="demo-modal"><dialog class="sl-modal" aria-labelledby="dm-title">
  <div class="sl-modal__head"><span class="sl-modal__title" id="dm-title">Новое устройство</span><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть" data-sl-close><i data-ic="x"></i></button></div>
  <div class="sl-modal__body"><label class="sl-field"><span class="sl-label">Название</span><input class="sl-input" placeholder="Например, Камера КПП-2"></label></div>
  <div class="sl-modal__foot"><button class="sl-btn sl-btn--ghost" data-sl-close>Отмена</button><button class="sl-btn sl-btn--primary" data-sl-close>Добавить</button></div>
</dialog></sl-modal>`,
};

export const Playground = {
  name: 'Песочница',
  args: { title: 'Новое устройство', fields: 'Название\nАдрес', switchLabel: 'Принимать данные', ok: 'Добавить', cancel: 'Отмена', width: 420 },
  argTypes: {
    title: { name: 'Заголовок', control: 'text' },
    fields: { name: 'Поля, по строке', control: 'text' },
    switchLabel: { name: 'Тумблер (пусто — нет)', control: 'text' },
    ok: { name: 'Главная кнопка', control: 'text' },
    cancel: { name: 'Кнопка отмены', control: 'text' },
    width: { name: 'Ширина, px', control: { type: 'range', min: 320, max: 640, step: 20 } },
  },
  render: a => `<div style="display:grid;grid-template-columns:minmax(0,${a.width}px);justify-content:center;padding:28px;border-radius:var(--sl-r-lg);background:var(--sl-backdrop)"><div class="sl-modal" role="dialog" aria-label="${a.title}">
    <div class="sl-modal__head"><span class="sl-modal__title">${a.title}</span><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    <div class="sl-modal__body">${a.fields.split('\n').filter(Boolean).map(f => `<label class="sl-field"><span class="sl-label">${f}</span><input class="sl-input"></label>`).join('')}${a.switchLabel ? `<label class="sl-switch"><input type="checkbox" checked>${a.switchLabel}</label>` : ''}</div>
    <div class="sl-modal__foot">${a.cancel ? `<button class="sl-btn sl-btn--ghost">${a.cancel}</button>` : ''}<button class="sl-btn sl-btn--primary">${a.ok}</button></div></div></div>`,
};
