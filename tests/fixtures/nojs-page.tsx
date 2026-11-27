// Страница для проверки без JavaScript: React-компоненты, отрисованные на сервере (renderToStaticMarkup),
// как их отдаст SSR до гидрации. Пишется в tests/fixtures/.generated/nojs.html перед тестом.
import { renderToStaticMarkup } from 'react-dom/server';
import { Shell, Topbar, Nav, List, Group, Row, Disclosure } from '../../src/react';

export function nojsHtml(): string {
  const body = renderToStaticMarkup(
    <Shell
      topbar={<Topbar brand={{ mark: 'S', name: 'SLOYKA' }} />}
      nav={<Nav current="#devices"><Nav.Item icon="plug" href="#devices">Устройства</Nav.Item></Nav>}
    >
      <List>
        <Group title="Средства">
          <Row title="Камера КПП-1" />
          <Row title="Шлюз-04" />
        </Group>
      </List>
      <Disclosure title="Объект" defaultOpen>Название, адрес, периметр объекта.</Disclosure>
    </Shell>,
  );
  return `<!doctype html><html lang="ru" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="../../../dist/styles.css"></head><body class="sl-root">${body}</body></html>`;
}
