import { test, expect } from '@playwright/test';
test('page without sl-root/theme still gets base styles', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('http://127.0.0.1:6008/tests/fixtures/plain.html');
  await expect(page.locator('body')).toHaveCSS('margin-top', '0px');
  expect(await page.locator('#p').evaluate(e => getComputedStyle(e).fontFamily)).toContain('Inter');
});
test('inner data-theme block paints its own background', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('http://127.0.0.1:6008/tests/fixtures/plain.html');
  await expect(page.locator('#nb')).toHaveCSS('background-color', 'rgb(12, 14, 17)');
});
