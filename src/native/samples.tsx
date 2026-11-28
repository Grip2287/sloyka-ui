// Примеры для нативных компонентов (HTML + CSS). Из них scripts/gen-native.js получает разметку через
// renderToStaticMarkup — поэтому нативный HTML всегда совпадает с тем, что выдаёт React-компонент.
// У каждого компонента из components.json должен быть хотя бы один пример (tests/unit/native.test.js).
import type { ReactNode } from 'react';
import {
  Icon, Text, Stack, Grid, Page, Link, Image, Form, Button, ButtonGroup, Field, Search, Select, Textarea, Compose,
  Segmented, Switch, Checkbox, Radio, RadioGroup, Tag, Count, Chip, Status, StatusPill, Card, KeyValue, Metric,
  LinkCard, Steps, Banner, Stats, List, Row, Group, Disclosure, Table, Empty, Dropzone, PageHeader, Toolbar, Topbar,
  StatusBar, DockButton, Menu, Picker, Tile, Window, Modal, Tooltip, Login, Nav, Shell, ThemeProvider, ThemeToggle,
} from '../react';
import { themeScriptSource } from '../react/components/theme/ThemeScript';

/** Для генератора: иконки для скриптов (`__SL_ICON_<имя>__`) и текст theme-head.js. */
export { Icon, themeScriptSource };

export interface NativeSample {
  /** Название варианта, по-русски. */
  title: string;
  node: ReactNode;
  /** Правка готовой разметки: например, скрыть панель, которую открывает скрипт. */
  post?: (html: string) => string;
}

export interface NativeScript {
  /** Файл в src/native/scripts/ и в пакете sloyka/native/. */
  file: string;
  /** Что делает скрипт и какие атрибуты и события у него есть. */
  about: string;
}

const noop = () => {};
/** Меню в закрытом виде: панель есть в разметке, но скрыта; её открывает menu.js. */
const hidePopover = (html: string) => html
  .replace('sl-menu__trigger is-open', 'sl-menu__trigger')
  .replace('aria-expanded="true"', 'aria-expanded="false"')
  .replace('class="sl-menu sl-menu--popover"', 'class="sl-menu sl-menu--popover" hidden');
/** Подсказка в скрытом виде: её показывает tooltip.js при наведении и фокусе. */
const hideTooltip = (html: string) => html
  .replace(/<span class="sl-tooltip-host" aria-describedby="[^"]*">/, '<span class="sl-tooltip-host">')
  .replace('<span class="sl-tooltip" role="tooltip"', '<span class="sl-tooltip" role="tooltip" hidden');
const withTheme = (n: ReactNode) => <ThemeProvider>{n}</ThemeProvider>;

const TOPBAR = <Topbar brand={{ mark: 'П', name: 'Пульт' }} title="Объекты"><ThemeToggle /></Topbar>;
const NAV = (
  <Nav current="/">
    <Nav.Section title="Мониторинг" />
    <Nav.Item href="/" icon="grid">Объекты</Nav.Item>
    <Nav.Item href="/journal" icon="journal" count={3}>Журнал</Nav.Item>
  </Nav>
);

/** Скрипты компонентов: подключаются только там, где компонент есть на странице. */
export const SCRIPTS: Record<string, NativeScript> = {
  Modal: { file: 'modal.js', about: 'Открывает окно кнопкой с `data-sl-open="<id окна>"`, закрывает кнопкой «Закрыть», любой кнопкой с `data-sl-close`, клавишей Esc и щелчком по затемнению. Фокус уходит в окно и возвращается на кнопку. Из своего кода: `slModal.open(id)`, `slModal.close(id)`; события `sl-open` и `sl-close` на `<dialog>`.' },
  Menu: { file: 'menu.js', about: 'Кнопка `.sl-menu__trigger` открывает и закрывает меню; Esc, щелчок снаружи и выбор пункта закрывают его. Событие `sl-toggle` (`detail.open`) на `.sl-menu-anchor`.' },
  ThemeToggle: { file: 'theme.js', about: 'Кнопка `data-sl-theme-toggle` переключает светлую и тёмную тему и запоминает выбор в `localStorage` (`sl-theme`). Для страницы без мигания подключите в `<head>` файл `theme-head.js`.' },
  ThemeScript: { file: 'theme-head.js', about: 'Ставится в `<head>` до стилей: читает сохранённую тему и сразу ставит `data-theme` на `<html>`, без мигания.' },
  ThemeProvider: { file: 'theme.js', about: 'В нативной вёрстке провайдер не нужен: `theme.js` и `theme-head.js` делают то же самое.' },
  ToastProvider: { file: 'toast.js', about: 'Показывает уведомления: `slToast.ok(text, { title, duration })`, а также `warn`, `crit`, `info`. `crit` не скрывается сам, остальные — через 5 с. Возвращает `{ close }`.' },
  Group: { file: 'group.js', about: 'Щелчок по заголовку группы сворачивает и разворачивает её. Событие `sl-toggle` (`detail.collapsed`) на `.sl-group`.' },
  Tooltip: { file: 'tooltip.js', about: 'Подсказка появляется при наведении и фокусе, Esc её скрывает.' },
  Segmented: { file: 'segmented.js', about: 'Выбор сегмента щелчком и стрелками. Событие `change` (`detail.value`) на `.sl-segmented`; значение — атрибут `value` кнопки.' },
  Compose: { file: 'compose.js', about: 'Enter или кнопка отправляют текст: событие `sl-send` (`detail.value`) на `.sl-compose`, поле очищается. Пустой текст не отправляется.' },
  Shell: { file: 'shell.js', about: 'Меню на телефоне: кнопка в верхней панели открывает и закрывает его, Esc, затемнение и выбор пункта закрывают. Без скрипта меню открывается ссылкой `#sl-nav`.' },
  Window: { file: 'window.js', about: 'Кнопка «Закрыть» прячет окно (`hidden`) и шлёт событие `sl-close` на `.sl-window`.' },
};

export const SAMPLES: Record<string, NativeSample[]> = {
  // 00 · Основа
  Form: [{ title: 'Форма', node: <Form action="/save" method="post"><Field label="Название" name="title" /><Button variant="primary" type="submit">Сохранить</Button></Form> }],
  Grid: [
    { title: 'Сетка на 3 колонки', node: <Grid columns="3" gap="3"><Text>Первая</Text><Text>Вторая</Text><Text>Третья</Text></Grid> },
    { title: 'Автосетка карточек', node: <Grid columns="auto" min="sm"><Text>Ячейка</Text><Text>Ячейка</Text></Grid> },
  ],
  Icon: [{ title: 'Иконка', node: <Icon name="bell" /> }, { title: 'Иконка 20 px', node: <Icon name="bell" size="20" /> }],
  Image: [{ title: 'Картинка', node: <Image src="/photo.jpg" alt="Вид на КПП" width={320} height={180} radius="md" /> }],
  Link: [{ title: 'Ссылка', node: <Link href="/journal">Журнал</Link> }, { title: 'Внешняя ссылка', node: <Link href="https://example.com" external>Сайт</Link> }],
  Page: [{ title: 'Страница', node: <Page width="narrow"><Text as="page">Настройки</Text></Page> }],
  Stack: [
    { title: 'Столбик', node: <Stack gap="2"><Text>Первая строка</Text><Text>Вторая строка</Text></Stack> },
    { title: 'Ряд с разносом', node: <Stack direction="row" justify="between" align="center"><Text>Слева</Text><Button>Справа</Button></Stack> },
  ],
  Text: [
    { title: 'Заголовок страницы', node: <Text as="page">Объекты</Text> },
    { title: 'Заголовок раздела', node: <Text as="section">Камеры</Text> },
    { title: 'Текст', node: <Text>Обычный текст</Text> },
    { title: 'Приглушённый мелкий', node: <Text as="small" tone="muted">Обновлено 5 минут назад</Text> },
  ],
  ThemeProvider: [{ title: 'Провайдер темы', node: <Text>В нативной вёрстке не нужен — см. скрипт theme.js</Text> }],
  ThemeScript: [{ title: 'Тема без мигания', node: <Text>В &lt;head&gt;: &lt;script src="sloyka/native/theme-head.js"&gt;&lt;/script&gt;</Text> }],
  ThemeToggle: [{ title: 'Переключатель темы', node: withTheme(<ThemeToggle />) }],

  // 01 · Кнопки
  Button: [
    { title: 'Главная', node: <Button variant="primary" icon="plus">Добавить</Button> },
    { title: 'Обычная', node: <Button>Отмена</Button> },
    { title: 'Прозрачная', node: <Button variant="ghost">Подробнее</Button> },
    { title: 'Опасная', node: <Button variant="danger">Удалить</Button> },
    { title: 'Маленькая', node: <Button size="sm">Ещё</Button> },
    { title: 'Только иконка', node: <Button iconOnly icon="refresh" aria-label="Обновить" /> },
    { title: 'Ссылка-кнопка', node: <Button href="/journal">Журнал</Button> },
    { title: 'Отключена', node: <Button disabled>Недоступно</Button> },
  ],
  ButtonGroup: [{ title: 'Группа кнопок', node: <ButtonGroup direction="row"><Button>Отмена</Button><Button variant="primary">Сохранить</Button></ButtonGroup> }],

  // 02 · Поля ввода
  Compose: [{ title: 'Строка сообщения', node: <Compose onSend={noop} placeholder="Сообщение оператору" /> }],
  Field: [
    { title: 'Поле', node: <Field label="Имя пользователя" name="name" placeholder="Иван Петров" /> },
    { title: 'С подсказкой', node: <Field label="Почта" type="email" name="email" hint="Для уведомлений" /> },
    { title: 'С ошибкой', node: <Field label="Пароль" type="password" name="password" error="Не короче 8 символов" /> },
  ],
  Search: [{ title: 'Поиск', node: <Search placeholder="Найти объект" /> }],
  Select: [{ title: 'Список', node: <Select label="Класс" name="kind" options={[{ value: 'video', label: 'Видео' }, { value: 'door', label: 'Дверь' }]} /> }],
  Textarea: [{ title: 'Многострочное поле', node: <Textarea label="Комментарий" name="note" /> }],

  // 03 · Переключатели
  Checkbox: [{ title: 'Флажок', node: <Checkbox name="agree" defaultChecked>Получать отчёты</Checkbox> }],
  Radio: [{ title: 'Переключатель', node: <Radio name="mode" value="auto" defaultChecked>Автоматически</Radio> }],
  RadioGroup: [{ title: 'Группа переключателей', node: <RadioGroup name="period" defaultValue="day" aria-label="Период"><Radio value="day">День</Radio><Radio value="week">Неделя</Radio></RadioGroup> }],
  Segmented: [{ title: 'Сегменты', node: <Segmented aria-label="Период" options={[{ value: 'day', label: 'День' }, { value: 'week', label: 'Неделя' }, { value: 'month', label: 'Месяц' }]} /> }],
  Switch: [{ title: 'Тумблер', node: <Switch name="live" defaultChecked>Принимать данные</Switch> }],

  // 04 · Теги и счётчики
  Chip: [{ title: 'Фильтр-чип', node: <Chip icon="filter" count={4}>Тревоги</Chip> }],
  Count: [{ title: 'Счётчик', node: <Count>12</Count> }, { title: 'Залитый счётчик', node: <Count solid>3</Count> }],
  Tag: [
    { title: 'Тег', node: <Tag>Видео</Tag> },
    { title: 'Тег «норма»', node: <Tag tone="ok">В сети</Tag> },
    { title: 'Тег «внимание»', node: <Tag tone="warn">Медленно</Tag> },
    { title: 'Тег «авария»', node: <Tag tone="crit">Нет связи</Tag> },
  ],

  // 05 · Статусы
  Status: [
    { title: 'Статус', node: <Status tone="ok">На связи</Status> },
    { title: 'Статус с пометкой', node: <Status tone="warn" note="2 мин">Задержка</Status> },
  ],
  StatusPill: [{ title: 'Статус-плашка', node: <StatusPill tone="crit">Авария</StatusPill> }],

  // 06 · Карточка объекта
  Card: [{
    title: 'Карточка объекта',
    node: (
      <Card accent="ok">
        <Card.Head title="КПП-1" subtitle="ул. Заводская, 12" icon="shield" />
        <KeyValue items={[['Состояние', <Status tone="ok">На связи</Status>], ['Камер', '4']]} />
        <Card.Foot><Button size="sm">Открыть</Button></Card.Foot>
      </Card>
    ),
  }, { title: 'Карточка-ссылка', node: <Card href="/objects/1"><Card.Head title="Склад" subtitle="Корпус Б" /></Card> }],
  'Card.Head': [{ title: 'Шапка карточки', node: <Card><Card.Head title="КПП-2" subtitle="Въезд" aside={<Tag tone="warn">Медленно</Tag>} /></Card> }],
  'Card.Foot': [{ title: 'Низ карточки', node: <Card><Card.Head title="КПП-3" /><Card.Foot><Status tone="off">Выключен</Status><Button size="sm">Включить</Button></Card.Foot></Card> }],
  KeyValue: [{ title: 'Пары «название — значение»', node: <KeyValue items={[['Адрес', '10.0.0.1'], ['Порт', '9100']]} /> }],

  // 07 · Карточка показателя
  Metric: [{ title: 'Показатель', node: <Metric label="Загрузка канала" value={72} note="за час" /> }],

  // 08 · Карточки-ссылки и шаги
  LinkCard: [{ title: 'Карточка-ссылка', node: <LinkCard href="/help" icon="help" title="Справка" text="Как подключить камеру" /> }],
  Steps: [{ title: 'Шаги', node: <Steps items={[{ title: 'Подключите', text: 'Кабель к порту 1' }, { title: 'Проверьте', text: 'Статус «На связи»' }]} /> }],

  // 09 · Баннеры
  Banner: [{ title: 'Баннер', node: <Banner tone="warn" title="Две камеры без связи"><Banner.Item action={<Button size="sm">Открыть</Button>}>КПП-2, въезд</Banner.Item></Banner> }],
  'Banner.Item': [{ title: 'Строка баннера', node: <Banner tone="crit" title="Авария"><Banner.Item>Склад, корпус Б</Banner.Item></Banner> }],

  // 10 · Сводка цифрами
  Stats: [{ title: 'Сводка', node: <Stats items={[{ label: 'Всего', value: 24 }, { label: 'В сети', value: 21, tone: 'ok' }, { label: 'Авария', value: 1, tone: 'crit' }]} /> }],

  // 11 · Список с группами
  List: [{
    title: 'Список с группой',
    node: (
      <List>
        <Group title="Камеры" count={2}>
          <Row title="КПП-1" status={<Status tone="ok">На связи</Status>} href="/cam/1" chevron />
          <Row title="КПП-2" status={<Status tone="crit">Нет связи</Status>} href="/cam/2" chevron current />
        </Group>
      </List>
    ),
  }],
  Group: [{ title: 'Свёрнутая группа', node: <List><Group title="Двери" count={1} defaultCollapsed><Row title="Вход А" /></Group></List> }],
  Row: [{ title: 'Строка-ссылка', node: <List><Row title="КПП-1" href="/cam/1" chevron status={<StatusPill tone="ok">Норма</StatusPill>} /></List> }],

  // 12 · Раскрывающиеся разделы
  Disclosure: [{ title: 'Раскрывающийся раздел', node: <Disclosure title="Дополнительно"><Text>Скрытые настройки</Text></Disclosure> }],

  // 13 · Таблица
  Table: [{
    title: 'Таблица',
    node: (
      <Table rowKey="id"
        columns={[{ key: 'name', title: 'Объект' }, { key: 'state', title: 'Состояние', render: (r: { state: string }) => <Status tone={r.state === 'ok' ? 'ok' : 'crit'}>{r.state === 'ok' ? 'На связи' : 'Нет связи'}</Status> }, { key: 'ip', title: 'Адрес', align: 'right' }]}
        rows={[{ id: 1, name: 'КПП-1', state: 'ok', ip: '10.0.0.1' }, { id: 2, name: 'КПП-2', state: 'crit', ip: '10.0.0.2' }]} />
    ),
  }],

  // 14 · Пустое состояние и загрузка файла
  Dropzone: [{ title: 'Загрузка файла', node: <Dropzone icon="upload" title="Перетащите файл" text="или выберите на компьютере" action={<Button size="sm">Выбрать</Button>} /> }],
  Empty: [{ title: 'Пусто', node: <Empty icon="pulse" title="Событий нет" text="Здесь появятся тревоги" /> }],

  // 15 · Заголовок страницы и панель фильтров
  PageHeader: [{ title: 'Заголовок страницы', node: <PageHeader title="Объекты" aside={<Count>24</Count>} /> }],
  Toolbar: [{
    title: 'Панель фильтров',
    node: <Toolbar><Search aria-label="Поиск объекта" /><Toolbar.End><Button variant="primary" icon="plus">Добавить</Button></Toolbar.End></Toolbar>,
  }],
  'Toolbar.End': [{ title: 'Правая часть панели', node: <Toolbar><Toolbar.End><Button>Экспорт</Button></Toolbar.End></Toolbar> }],

  // 16 · Верхняя панель
  Topbar: [{ title: 'Верхняя панель', node: withTheme(TOPBAR) }],

  // 17 · Строка состояния и плавающие кнопки
  DockButton: [{ title: 'Плавающая кнопка', node: <DockButton icon="chat" chevron="up">Чат</DockButton> }],
  StatusBar: [{ title: 'Строка состояния', node: <StatusBar items={[{ label: 'Объектов', value: '24' }, { label: 'Тревог', value: '1' }]} system={{ tone: 'ok', text: 'Работает' }} /> }],

  // 18 · Меню аккаунта
  Menu: [
    {
      title: 'Меню с кнопкой',
      node: (
        <Menu trigger={{ label: 'Меню аккаунта', initials: 'ИП' }} header={{ name: 'Иван Петров', role: 'Оператор' }} defaultOpen>
          <Menu.Item icon="user" href="/profile">Профиль</Menu.Item>
          <Menu.Separator />
          <Menu.Item icon="power" danger>Выйти</Menu.Item>
        </Menu>
      ),
      post: hidePopover,
    },
    { title: 'Меню-панель', node: <Menu header={{ name: 'Иван Петров' }}><Menu.Item icon="key">Сменить пароль</Menu.Item></Menu> },
  ],
  'Menu.Item': [{ title: 'Пункт меню', node: <Menu><Menu.Item icon="user" href="/profile">Профиль</Menu.Item><Menu.Item icon="power" danger>Выйти</Menu.Item></Menu> }],
  'Menu.Separator': [{ title: 'Разделитель', node: <Menu><Menu.Item>Первый</Menu.Item><Menu.Separator /><Menu.Item>Второй</Menu.Item></Menu> }],

  // 19 · Выбор из плиток
  Picker: [{ title: 'Выбор плитки', node: <Picker title="Тип объекта"><Tile selected note="4 шт.">Камера</Tile><Tile>Дверь</Tile><Tile disabled>Датчик</Tile></Picker> }],
  Tile: [{ title: 'Плитка-ссылка', node: <Picker title="Разделы"><Tile href="/cams">Камеры</Tile></Picker> }],

  // 20 · Плавающее окно
  Window: [{ title: 'Плавающее окно', node: <Window title="Чат" icon="chat" onClose={noop} footer={<Compose onSend={noop} />}><Text>Сообщений пока нет</Text></Window> }],

  // 21 · Модальное окно
  Modal: [{
    title: 'Модальное окно (кнопка + окно)',
    node: (
      <>
        <Button variant="primary" icon="plus">Добавить пользователя</Button>
        <Modal title="Новый пользователь" defaultOpen
          footer={<><Button variant="ghost">Отменить</Button><Button variant="primary">Сохранить</Button></>}>
          <Field label="Имя пользователя" name="name" />
          <Field label="Почта" type="email" name="email" />
        </Modal>
      </>
    ),
    // Связь кнопки и окна — data-атрибуты для modal.js (у React их заменяет состояние open).
    post: (html) => html
      .replace('<button class="sl-btn sl-btn--primary">', '<button class="sl-btn sl-btn--primary" type="button" data-sl-open="user-modal">')
      .replace('<dialog class="sl-modal"', '<dialog class="sl-modal" id="user-modal"')
      .replace('<button class="sl-btn sl-btn--ghost">Отменить', '<button class="sl-btn sl-btn--ghost" type="button" data-sl-close="">Отменить'),
  }],

  // 22 · Уведомления и подсказка
  ToastProvider: [{ title: 'Место для уведомлений', node: <Text>Разметку уведомлений создаёт toast.js: slToast.ok('Сохранено')</Text> }],
  Tooltip: [{ title: 'Подсказка', node: <Tooltip text="Обновить список" defaultOpen><Button iconOnly icon="refresh" aria-label="Обновить" /></Tooltip>, post: hideTooltip }],

  // 23 · Карточка входа
  Login: [{ title: 'Вход', node: <Login brand={{ mark: 'П', name: 'Пульт' }} onSubmit={noop} /> }],

  // 24 · Боковое меню и каркас
  Nav: [{ title: 'Боковое меню', node: NAV }, { title: 'Рейл', node: <Nav rail current="/"><Nav.Item href="/" icon="grid">Объекты</Nav.Item></Nav> }],
  'Nav.Item': [{ title: 'Пункт меню', node: <Nav><Nav.Item href="/users" icon="users" count="2">Пользователи</Nav.Item></Nav> }],
  'Nav.Section': [{ title: 'Заголовок раздела меню', node: <Nav><Nav.Section title="Настройки" /></Nav> }],
  Shell: [{ title: 'Каркас админки', node: withTheme(<Shell topbar={TOPBAR} nav={NAV}><PageHeader title="Объекты" /></Shell>) }],
};
