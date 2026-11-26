// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/21 · Модальное окно',
  tags: ["autodocs"],
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
