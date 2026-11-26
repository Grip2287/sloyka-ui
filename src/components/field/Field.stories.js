// Сгенерировано из одобренного прототипа (docs/sloyka-source/redesign/index.html).
export default {
  title: 'Компоненты/02 · Поля ввода',
  tags: ["autodocs", "ref-base"],
  parameters: {"docs": {"description": {"component": "Поле с подписью, с ошибкой, поиск, выпадающий список, многострочное, строка сообщения с кнопкой отправки."}}},
};

export const Default = {
  name: 'Поля ввода',
  render: () => `<div class="g2">
    <label class="sl-field"><span class="sl-label">Имя пользователя</span><input class="sl-input" placeholder="Введите логин"></label>
    <label class="sl-field"><span class="sl-label">Пароль</span><input class="sl-input" type="password" value="12345" aria-invalid="true"><span class="sl-error">Неверный пароль</span></label>
    <label class="sl-search"><i data-ic="search"></i><input class="sl-input" placeholder="Поиск устройства…"></label>
    <select class="sl-select" aria-label="Все статусы"><option>Все статусы</option><option>На связи</option></select>
  </div>
  <label class="sl-field"><span class="sl-label">Текст оповещения</span><textarea class="sl-textarea">Внимание. Проверка системы оповещения.</textarea><span class="sl-hint">До 500 символов</span></label>
  <div class="sl-compose"><input class="sl-input" placeholder="Сообщение в канал «Дежурная смена»…"><button class="sl-btn sl-btn--icon sl-btn--primary" aria-label="Отправить"><i data-ic="arrow-right"></i></button></div>`,
};

export const Playground = {
  name: 'Песочница',
  args: { label: 'Имя пользователя', placeholder: 'Введите логин', value: '', kind: 'поле', hint: '', error: '' },
  argTypes: {
    label: { name: 'Подпись', control: 'text' },
    placeholder: { name: 'Подсказка внутри', control: 'text' },
    value: { name: 'Значение', control: 'text' },
    kind: { name: 'Тип', control: 'inline-radio', options: ['поле', 'поиск', 'список', 'многострочное'] },
    hint: { name: 'Пояснение под полем', control: 'text' },
    error: { name: 'Текст ошибки', control: 'text' },
  },
  render: a => {
    const inv = a.error ? ' aria-invalid="true"' : '';
    const ctl = {
      'поле': `<input class="sl-input" placeholder="${a.placeholder}" value="${a.value}"${inv}>`,
      'поиск': `<span class="sl-search"><i data-ic="search"></i><input class="sl-input" placeholder="${a.placeholder}" value="${a.value}"${inv}></span>`,
      'список': `<select class="sl-select"${inv}><option>${a.value || a.placeholder}</option></select>`,
      'многострочное': `<textarea class="sl-textarea" placeholder="${a.placeholder}"${inv}>${a.value}</textarea>`,
    }[a.kind];
    return `<label class="sl-field" style="max-width:360px">${a.label ? `<span class="sl-label">${a.label}</span>` : ''}${ctl}${a.hint ? `<span class="sl-hint">${a.hint}</span>` : ''}${a.error ? `<span class="sl-error">${a.error}</span>` : ''}</label>`;
  },
};
