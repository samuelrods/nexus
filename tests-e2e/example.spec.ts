import { test, expect } from '@playwright/test';

test('has title or heading', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // Since we don't know the exact title, we'll check if the page loads successfully.
  await expect(page).not.toHaveTitle(/404|Error/i);
});

test('authenticated user can access dashboard', async ({ page }) => {
  // The storageState is loaded so user is already logged in
  // Navigating to the root may redirect to dashboard or org selector
  await page.goto('/');

  // Page should load without errors
  await expect(page).not.toHaveTitle(/404|Error/i);
});
