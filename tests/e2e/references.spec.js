import { test, expect } from '@playwright/test';
import { url } from './stories.js';

test('references page: form is there, adding is disabled without the dev server', async ({ page }) => {
  await page.goto(url('референсы-добавить-референс--add', 'light'));
  await expect(page.getByRole('heading', { name: 'Референсы' })).toBeVisible();
  await expect(page.getByLabel('Ссылка')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Добавить референс' })).toBeDisabled();
  await expect(page.getByText('Пока ни одного референса')).toBeVisible();
});

test('all-templates page shows an empty state in the static build', async ({ page }) => {
  await page.goto(url('основа-все-шаблоны--all', 'light'));
  await expect(page.getByRole('heading', { name: 'Все шаблоны' })).toBeVisible();
  await expect(page.getByText('Шаблонов пока нет')).toBeVisible();
});
