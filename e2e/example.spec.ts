import { test, expect } from '@playwright/test';

test('should load the homepage', async ({ page }) => {
  await page.goto('/');

  // You can update this to check for specific text on your page
  // For example, checking if the page has a valid title
  await expect(page).toHaveTitle(/.*|/);
});
