import { test, expect } from '@playwright/test';

test('should load the homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/(ru|pt)\/deck$/);
  await expect(page).toHaveTitle(/Kids Probability Deck/i);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
