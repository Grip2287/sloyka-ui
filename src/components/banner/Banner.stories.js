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

export const Playground = {
  name: 'Песочница',
  args: { kind: 'warn', title: 'План строится, но без части рекомендаций', text: 'Группа «Дежурные силы» не подключена к оповещению', action: 'Подключить группу' },
  argTypes: {
    kind: { name: 'Вид', control: 'inline-radio', options: ['ok', 'warn', 'crit'] },
    title: { name: 'Заголовок', control: 'text' },
    text: { name: 'Текст', control: 'text' },
    action: { name: 'Кнопка (пусто — без неё)', control: 'text' },
  },
  render: a => `<div class="sl-banner${a.kind !== 'ok' ? ' sl-banner--' + a.kind : ''}"><div class="sl-banner__title"><i data-ic="${a.kind === 'ok' ? 'check' : 'alert'}"></i>${a.title}</div>${a.action ? `<div class="sl-banner__item"><span>${a.text}</span><button class="sl-btn sl-btn--sm">${a.action}</button></div>` : `<div class="sl-banner__text">${a.text}</div>`}</div>`,
};

export const Test = {
  args:{
    kind:"crit",
    title:"План строится, но без части рекомендаций",
    text:"Группа «Дежурные силы» не подключена к оповещению",
    action:"Подключить группу"
  },
  name:"Песочница",
  argTypes:{
    kind:{
      name:"Вид",
      control:"inline-radio",
      options:["ok", "warn", "crit"]
    },
    title:{
      name:"Заголовок",
      control:"text"
    },
    text:{
      name:"Текст",
      control:"text"
    },
    action:{
      name:"Кнопка (пусто — без неё)",
      control:"text"
    }
  },
  render:a => `<div class="sl-banner${a.kind !== "ok" ? " sl-banner--" + a.kind : ""}"><div class="sl-banner__title"><i data-ic="${a.kind === "ok" ? "check" : "alert"}"></i>${a.title}</div>${a.action ? `<div class="sl-banner__item"><span>${a.text}</span><button class="sl-btn sl-btn--sm">${a.action}</button></div>` : `<div class="sl-banner__text">${a.text}</div>`}</div>`
};
