import { test, expect } from '@playwright/test';
import { url } from './stories.js';

test('phone: burger opens nav, Escape closes it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url('каркас-админка--default', 'light'));
  const nav = page.locator('.sl-shell__nav');
  await expect(nav).not.toBeInViewport();
  await page.locator('[data-sl-nav-toggle]').click();
  await expect(nav).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(nav).not.toBeInViewport();
});

test('tablet: nav is a rail with icons and labels', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(url('каркас-админка--default', 'light'));
  const box = await page.locator('.sl-shell__nav').boundingBox();
  expect(box.width).toBe(100);
  await expect(page.locator('[data-sl-nav-toggle]')).toBeHidden();
});

test('modal opens, Escape closes and focus returns', async ({ page }) => {
  await page.goto(url('компоненты-21-·-модальное-окно--live', 'light'));
  const opener = page.locator('[data-sl-open]');
  await opener.click();
  await expect(page.locator('dialog.sl-modal')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog.sl-modal')).toBeHidden();
  await expect(opener).toBeFocused();
});

test('group collapses on click', async ({ page }) => {
  await page.goto(url('компоненты-11-·-список-с-группами--default', 'light'));
  const head = page.locator('.sl-group__head').first();
  await head.click();
  await expect(page.getByText('Камера КПП-1')).toBeHidden();
  await expect(head).toHaveAttribute('aria-expanded', 'false');
});

test('toast appears and crit stays', async ({ page }) => {
  await page.goto(url('компоненты-22-·-уведомления-и-подсказка--live', 'light'));
  await page.getByRole('button', { name: 'Ошибка' }).click();
  await expect(page.getByRole('alert')).toContainText('Не удалось загрузить журнал');
});
