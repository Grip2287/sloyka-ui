import { test, expect } from '@playwright/test';
test('site styles outside layers beat the library', async ({ page }) => {
  await page.goto('http://127.0.0.1:6008/tests/fixtures/layers.html');
  await expect(page.locator('#b')).toHaveCSS('background-color', 'rgb(255, 0, 0)');
});
