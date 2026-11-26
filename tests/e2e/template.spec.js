import { test, expect } from '@playwright/test';
import { url } from './stories.js';

test('playground size applies, goes to «Мой шаблон», can be edited and removed', async ({ page }) => {
  await page.goto(`/iframe.html?id=компоненты-01-·-кнопки--playground&viewMode=story&globals=theme:light&args=slScale:130;slRadius:14`);
  const btn = page.locator('.sb-stage .sl-btn').first();
  await expect(btn).toHaveCSS('zoom', '1.3');
  await expect(btn).toHaveCSS('border-top-left-radius', '14px');
  await page.locator('[data-tpl-add]').click();

  await page.goto(url('основа-мой-шаблон--template', 'light'));
  const row = page.locator('tr', { hasText: '01 · Кнопки' });
  await expect(row).toBeVisible();
  await expect(row.locator('[data-prop="scale"]')).toHaveValue('130');
  await expect(page.locator('#storybook-root pre')).toContainText('.sl-btn, .sl-btn-group { zoom: 1.3; --sl-r-xs: 12px; --sl-r-sm: 14px;');
  await expect(page.locator('.sb-tpl-preview[data-theme="light"] .sl-btn').first()).toHaveCSS('zoom', '1.3');

  await row.locator('[data-prop="scale"]').fill('110');
  await row.locator('[data-prop="scale"]').press('Tab');
  await expect(page.locator('#storybook-root pre')).toContainText('zoom: 1.1;');

  await page.locator('[data-del="button"]').click();
  await expect(page.locator('tr', { hasText: '01 · Кнопки' })).toHaveCount(0);
  // в собранном Storybook сохранять в библиотеку нельзя — кнопка недоступна, а скачать можно
  await expect(page.getByRole('button', { name: 'Сохранить в библиотеку' })).toBeDisabled();
});

test('theme editor sends the theme to the template', async ({ page }) => {
  await page.goto(`/iframe.html?id=основа-редактор-темы--editor&viewMode=story&globals=theme:light&args=accentLight:!hex(2563eb)`);
  await page.locator('[data-tpl-add]').click();
  await page.goto(url('основа-мой-шаблон--template', 'light'));
  await expect(page.locator('[data-theme-field="accentLight"]')).toHaveValue('#2563eb');
  await expect(page.locator('#storybook-root pre')).toContainText('--sl-inverse: #2563eb;');
});
