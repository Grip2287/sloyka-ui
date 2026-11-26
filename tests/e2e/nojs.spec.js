import { test, expect } from '@playwright/test';
import { stories } from './stories.js';
// Без JS Storybook не рисует историю, поэтому проверяем «живые» компоненты на отдельной странице без скриптов.
test('content reachable without JavaScript', async ({ page }) => {
  await page.goto('http://127.0.0.1:6008/tests/fixtures/nojs.html');
  for (const t of ['Камера КПП-1', 'Шлюз-04', 'Название, адрес, периметр объекта.', 'Устройства']) await expect(page.getByText(t, { exact: true }).first()).toBeVisible();
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('http://127.0.0.1:6008/tests/fixtures/nojs.html#sl-nav');
  await expect(page.locator('#sl-nav')).toBeInViewport();
});
test('stories list is not empty', () => { expect(stories.length).toBeGreaterThan(20); });
