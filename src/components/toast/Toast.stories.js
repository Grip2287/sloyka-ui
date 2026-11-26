// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/22 · Уведомления и подсказка',
  tags: ["autodocs"],
  parameters: {"docs": {"description": {"component": "Всплывающие уведомления: успех, предупреждение, ошибка. Тёмная подсказка при наведении."}}},
};

export const Default = {
  name: 'Уведомления и подсказка',
  render: () => `<div class="col">
    <div class="sl-toast" style="--c:var(--sl-ok)"><i data-ic="check" class="sl-toast__icon"></i><div class="sl-toast__body"><span class="sl-toast__title">Устройство добавлено</span><span class="sl-toast__text">Камера КПП-2 появится на карте после размещения.</span></div><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    <div class="sl-toast" style="--c:var(--sl-warn)"><i data-ic="alert" class="sl-toast__icon"></i><div class="sl-toast__body"><span class="sl-toast__title">Связь нестабильна</span><span class="sl-toast__text">Шлюз-04 отвечает с задержкой.</span></div><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    <div class="sl-toast" style="--c:var(--sl-crit)"><i data-ic="alert" class="sl-toast__icon"></i><div class="sl-toast__body"><span class="sl-toast__title">Не удалось загрузить журнал</span><span class="sl-toast__text">Проверьте соединение и обновите страницу.</span></div><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>
    <span><span class="sl-tooltip">Переключить тему</span></span>
  </div>`,
};

export const Live = {
  name: 'Показать уведомление',
  parameters: { pair: false },
  render: () => `<div class="row">
  <button class="sl-btn" data-demo-toast="ok">Успех</button>
  <button class="sl-btn" data-demo-toast="warn">Предупреждение</button>
  <button class="sl-btn" data-demo-toast="crit">Ошибка</button>
</div>`,
};

export const Playground = {
  name: 'Песочница',
  args: { kind: 'ok', title: 'Устройство добавлено', text: 'Камера КПП-2 появится на карте после размещения.' },
  argTypes: {
    kind: { name: 'Вид', control: 'inline-radio', options: ['ok', 'warn', 'crit', 'info'] },
    title: { name: 'Заголовок', control: 'text' },
    text: { name: 'Текст', control: 'text' },
  },
  render: a => `<div class="sl-toast" style="--c:var(--sl-${a.kind === 'info' ? 'text-2' : a.kind})"><i data-ic="${{ ok: 'check', warn: 'alert', crit: 'alert', info: 'info' }[a.kind]}" class="sl-toast__icon"></i><div class="sl-toast__body"><span class="sl-toast__title">${a.title}</span><span class="sl-toast__text">${a.text}</span></div><button class="sl-btn sl-btn--icon sl-btn--sm sl-btn--ghost" aria-label="Закрыть"><i data-ic="x"></i></button></div>`,
};
