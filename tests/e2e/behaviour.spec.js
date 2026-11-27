import { test, expect } from '@playwright/test';
import { url } from './stories.js';

const SHELL = 'каркас-админка--default';
const MODAL = 'компоненты-21-·-модальное-окно--live';
const TOAST = 'компоненты-22-·-уведомления-и-подсказка--live';
const TOOLTIP = 'компоненты-22-·-уведомления-и-подсказка--default';
const MENU_AND_MODAL = 'проверки-поведение--menu-and-modal';

/** Фокус внутри открытого диалога? */
const focusInDialog = page => page.evaluate(() => Boolean(document.activeElement?.closest('dialog[open]')));

test('phone: burger opens nav with aria-expanded, Escape closes it and focus returns', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url(SHELL, 'light'));
  const nav = page.locator('.sl-shell__nav');
  const toggle = page.locator('.sl-shell__toggle');
  await expect(nav).not.toBeInViewport();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(nav).toBeInViewport();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.locator('.sl-nav__item').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(nav).not.toBeInViewport();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('phone: backdrop click closes the nav', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url(SHELL, 'light'));
  await page.locator('.sl-shell__toggle').click();
  await expect(page.locator('.sl-shell__nav')).toBeInViewport();
  await page.mouse.click(380, 400); // справа от меню — фон
  await expect(page.locator('.sl-shell__nav')).not.toBeInViewport();
});

test('tablet: nav is a rail with icons and labels', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(url(SHELL, 'light'));
  const box = await page.locator('.sl-shell__nav').boundingBox();
  expect(box.width).toBe(100);
  await expect(page.locator('.sl-shell__toggle')).toBeHidden();
});

test('modal opens, Escape closes and focus returns to the opener', async ({ page }) => {
  await page.goto(url(MODAL, 'light'));
  const opener = page.getByRole('button', { name: 'Добавить устройство' });
  const dialog = page.locator('dialog.sl-modal');
  await opener.click();
  await expect(dialog).toBeVisible();
  expect(await focusInDialog(page)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('modal: click on the backdrop closes', async ({ page }) => {
  await page.goto(url(MODAL, 'light'));
  await page.getByRole('button', { name: 'Добавить устройство' }).click();
  const dialog = page.locator('dialog.sl-modal');
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialog).toBeHidden();
});

test('modal: press inside and release on the backdrop does not close', async ({ page }) => {
  await page.goto(url(MODAL, 'light'));
  await page.getByRole('button', { name: 'Добавить устройство' }).click();
  const dialog = page.locator('dialog.sl-modal');
  const box = await dialog.getByLabel('Название').boundingBox();
  await page.mouse.move(box.x + 10, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(5, 5, { steps: 5 });
  await page.mouse.up();
  await expect(dialog).toBeVisible();
});

test('modal: Tab and Shift+Tab stay inside', async ({ page }) => {
  await page.goto(url(MODAL, 'light'));
  await page.getByRole('button', { name: 'Добавить устройство' }).click();
  await expect(page.locator('dialog.sl-modal')).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await focusInDialog(page), `Tab #${i + 1}`).toBe(true);
  }
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Shift+Tab');
    expect(await focusInDialog(page), `Shift+Tab #${i + 1}`).toBe(true);
  }
});

test('phone: Escape closes an open modal first, the nav stays open; next Escape closes the nav', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url(MENU_AND_MODAL, 'light'));
  const dialog = page.locator('dialog.sl-modal');
  const shell = page.locator('.sl-shell');
  const toggle = page.locator('.sl-shell__toggle');
  await expect(dialog).toBeVisible();
  await expect(shell).toHaveAttribute('data-nav-open', '');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(shell).toHaveAttribute('data-nav-open', '');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(shell).not.toHaveAttribute('data-nav-open', '');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('tooltip shows on focus and hides on Escape', async ({ page }) => {
  await page.goto(url(TOOLTIP, 'light'));
  const tip = page.getByRole('tooltip');
  await expect(tip).toHaveCount(0);
  await page.getByRole('button', { name: 'Тёмная тема' }).focus();
  await expect(tip).toBeVisible();
  await expect(tip).toHaveText('Переключить тему');
  await page.keyboard.press('Escape');
  await expect(tip).toHaveCount(0);
});

test('group collapses on click', async ({ page }) => {
  await page.goto(url('компоненты-11-·-список-с-группами--default', 'light'));
  const head = page.locator('.sl-group__head').first();
  await head.click();
  await expect(page.getByText('Камера КПП-1')).toBeHidden();
  await expect(head).toHaveAttribute('aria-expanded', 'false');
});

test('toast: ok disappears after 5 s, crit stays', async ({ page }) => {
  await page.clock.install();
  await page.goto(url(TOAST, 'light'));
  await page.getByRole('button', { name: 'Успех' }).click();
  const ok = page.locator('.sl-toast-region [role="status"]').filter({ hasText: 'Устройство добавлено' });
  await expect(ok).toBeVisible();
  await page.getByRole('button', { name: 'Ошибка' }).click();
  const crit = page.getByRole('alert');
  await expect(crit).toContainText('Не удалось загрузить журнал');
  await page.clock.runFor(4900);
  await expect(ok).toBeVisible();
  await page.clock.runFor(200);
  await expect(ok).toHaveCount(0);
  await page.clock.runFor(60000);
  await expect(crit).toBeVisible();
});
