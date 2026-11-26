// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/09 · Баннеры',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Сообщение о состоянии раздела: штатно, предупреждение со списком причин и действиями, ошибка."}}},
};

export const Default = {
  name: 'Баннеры',
  render: () => `<div class="sl-banner"><div class="sl-banner__title"><i data-ic="check"></i>Система работает штатно</div><div class="sl-banner__text">Обновлено в 11:04:59</div></div>
  <div class="sl-banner sl-banner--warn"><div class="sl-banner__title"><i data-ic="alert"></i>План строится, но без части рекомендаций</div>
    <div class="sl-banner__item"><span>Группа «Дежурные силы» не подключена к оповещению</span><button class="sl-btn sl-btn--sm">Подключить группу</button></div>
    <div class="sl-banner__item"><span>Периметр объекта не нанесён на карту</span><button class="sl-btn sl-btn--sm">Открыть карту</button></div></div>
  <div class="sl-banner sl-banner--crit"><div class="sl-banner__title"><i data-ic="alert"></i>Сценарии недоступны</div><div class="sl-banner__text">Причина: устройства не привязаны к периметру объекта.</div></div>`,
};
