import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { stories } from './stories.js';
import { nojsHtml } from '../fixtures/nojs-page.tsx';

// Без JS Storybook не рисует историю, поэтому проверяем компоненты, отрисованные на сервере, на отдельной странице без скриптов.
const html = nojsHtml();
mkdirSync('tests/fixtures/.generated', { recursive: true });
writeFileSync('tests/fixtures/.generated/nojs.html', html);
const PAGE = 'http://127.0.0.1:6008/tests/fixtures/.generated/nojs.html';
// id меню выдаёт useId; у кнопки меню телефона aria-controls указывает на него же.
const navId = html.match(/<nav[^>]* id="([^"]+)"/)[1];

test('content reachable without JavaScript', async ({ page }) => {
  await page.goto(PAGE);
  for (const t of ['Камера КПП-1', 'Шлюз-04', 'Название, адрес, периметр объекта.', 'Устройства']) await expect(page.getByText(t, { exact: true }).first()).toBeVisible();
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto(`${PAGE}#${navId}`);
  await expect(page.locator(`[id="${navId}"]`)).toBeInViewport();
});
test('server markup: phone menu button points at the nav', () => {
  expect(html).toContain(`aria-controls="${navId}"`);
});
test('stories list is not empty', () => { expect(stories.length).toBeGreaterThan(20); });
