import { expect, test } from '@playwright/test';

test('home page identifies the project foundation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Shop Management ERP' })).toBeVisible();
  await expect(page.getByText('Foundation only')).toBeVisible();
});
