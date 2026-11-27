import { Segmented, Switch, Checkbox, Radio, RadioGroup } from '../../react';

type Args = Record<string, any>;
const opts = (labels: string[]) => labels.map((label, i) => ({ value: String(i + 1), label }));

export default {
  title: 'Компоненты/03 · Переключатели',
  tags: ['autodocs', 'ref-base'],
  parameters: { docs: { description: { component: 'Сегментированный переключатель (вид карты, режимы), тумблер, чекбокс и радиокнопка.' } } },
};

export const Default = {
  name: 'Переключатели',
  render: () => (
    <>
      <div className="col">
        <Segmented block options={opts(['Без зон', 'Рабочий', 'Всё'])} defaultValue="3" aria-label="Зоны" />
        <Segmented options={opts(['Схема', 'Спутник'])} defaultValue="2" aria-label="Вид карты" />
        <Segmented options={opts(['Авто', 'Оба', 'Подавление', 'Обнаружение', 'Скрыть'])} defaultValue="3" aria-label="Режим" />
      </div>
      <div className="row" style={{ gap: 24 }}>
        <Switch defaultChecked>Зоны охраны</Switch>
        <Switch>Птицы и шум</Switch>
        <Checkbox defaultChecked>Запомнить</Checkbox>
        <RadioGroup direction="row" defaultValue="devices" aria-label="Расчёт">
          <Radio value="devices">По приборам</Radio>
          <Radio value="area">Единой площадью</Radio>
        </RadioGroup>
      </div>
    </>
  ),
};

export const Playground = {
  name: 'Песочница',
  args: { options: 'Без зон, Рабочий, Всё', selected: 3, block: false, switchLabel: 'Зоны охраны', switchOn: true, checkLabel: 'Запомнить', checkOn: true, kind: 'checkbox' },
  argTypes: {
    options: { name: 'Сегменты через запятую', control: 'text' },
    selected: { name: 'Выбран сегмент №', control: { type: 'number', min: 1 } },
    block: { name: 'Сегменты на всю ширину', control: 'boolean' },
    switchLabel: { name: 'Подпись тумблера', control: 'text' },
    switchOn: { name: 'Тумблер включён', control: 'boolean' },
    checkLabel: { name: 'Подпись флажка', control: 'text' },
    checkOn: { name: 'Флажок отмечен', control: 'boolean' },
    kind: { name: 'Флажок или радиокнопка', control: 'inline-radio', options: ['checkbox', 'radio'] },
  },
  render: (a: Args) => {
    const labels = String(a.options).split(',').map((s) => s.trim()).filter(Boolean);
    return (
      <div className="col">
        <Segmented key={`${a.options}|${a.selected}`} block={a.block} options={opts(labels)} defaultValue={String(a.selected)} aria-label="Сегменты" />
        <div className="row" style={{ gap: 24 }}>
          <Switch key={`s${a.switchOn}`} defaultChecked={a.switchOn}>{a.switchLabel}</Switch>
          {a.kind === 'radio'
            ? <Radio key={`r${a.checkOn}`} value="pg" defaultChecked={a.checkOn}>{a.checkLabel}</Radio>
            : <Checkbox key={`c${a.checkOn}`} defaultChecked={a.checkOn}>{a.checkLabel}</Checkbox>}
        </div>
      </div>
    );
  },
};
