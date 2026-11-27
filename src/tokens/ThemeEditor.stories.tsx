// Редактор темы: меняйте цвета и размеры в панели «Элементы управления» — пример пересобирается сразу.
// Кнопка «＋ В шаблон» над примером отправляет тему в «Основа → Мой шаблон».
import { themeCSS } from '../../.storybook/template-store.js';
import { Sample } from '../../.storybook/sample';

type Args = Record<string, any>;
const HIDE = { table: { disable: true } };

export default {
  title: 'Основа/Редактор темы',
  argTypes: { slScale: HIDE, slRadius: HIDE },
  parameters: {
    docs: { description: { component: 'Подберите главный цвет, фон, скругления и размеры. Нажмите «＋ В шаблон», чтобы собрать это вместе с примерками компонентов, или скопируйте CSS ниже.' } },
  },
};

export const Editor = {
  name: 'Редактор темы',
  // значения по умолчанию сохранены пользователем из Storybook
  args: { accentLight: '#16181c', accentDark: '#f9f9f9', bgLight: '#e9ebee', bgDark: '#0c0e11', radius: 9, fontSize: 13, controlHeight: 34 },
  argTypes: {
    accentLight: { name: 'Главный цвет · светлая', control: 'color' },
    accentDark: { name: 'Главный цвет · тёмная', control: 'color' },
    bgLight: { name: 'Фон страницы · светлая', control: 'color' },
    bgDark: { name: 'Фон страницы · тёмная', control: 'color' },
    radius: { name: 'Скругление кнопок и полей, px', control: { type: 'range', min: 0, max: 16, step: 1 } },
    fontSize: { name: 'Основной текст, px', control: { type: 'range', min: 12, max: 16, step: 1 } },
    controlHeight: { name: 'Высота кнопок и полей, px', control: { type: 'range', min: 28, max: 44, step: 2 } },
  },
  render: (a: Args) => {
    const scoped = themeCSS(a, { light: '[data-theme="light"] .sb-tune', dark: '[data-theme="dark"] .sb-tune', root: '.sb-tune', media: false });
    return (
      <>
        <style>{scoped}</style>
        <div className="sb-tune" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 16, padding: 16, borderRadius: 'var(--sl-r-lg)', background: 'var(--sl-bg)', fontSize: 'var(--sl-fs-body)' }}>
          <Sample />
        </div>
        <div className="sl-field">
          <span className="sl-label">CSS для проекта</span>
          <pre className="sb-code">{themeCSS(a)}</pre>
        </div>
      </>
    );
  },
};
