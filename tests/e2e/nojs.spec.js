import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { stories } from './stories.js';
import { nojsHtml } from '../fixtures/nojs-page.tsx';

// Без JS Storybook не рисует историю, поэтому проверяем компоненты, отрисованные на сервере, на отдельной странице без скриптов.
const html = nojsHtml();
mkdirSync('tests/fixtures/.generated', { recursive: true });
writeFileSync('tests/fixtures/.generated/nojs.html', html);
const PAGE = 'http://127.0.0.1:6008/tests/fixtures/.generated/nojs.html';
test('content reachable without JavaScript', async ({ page }) => {
  await page.goto(PAGE);
  for (const t of ['Камера КПП-1', 'Шлюз-04', 'Название, адрес, периметр объекта.', 'Устройства']) await expect(page.getByText(t, { exact: true }).first()).toBeVisible();
});
test('phone without JavaScript: the menu button is a link that opens the nav', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto(PAGE);
  const nav = page.locator('#sl-nav');
  await expect(nav).not.toBeInViewport();
  await page.locator('a.sl-shell__toggle[href="#sl-nav"]').click();
  await expect(nav).toBeInViewport();
});
test('stories list is not empty', () => { expect(stories.length).toBeGreaterThan(20); });
