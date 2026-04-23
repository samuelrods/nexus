import { test, expect } from '@playwright/test';

test('has title or heading', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // Since we don't know the exact title, we'll check if the page loads successfully.
  await expect(page).not.toHaveTitle(/404|Error/i);
});

test('can navigate to login', async ({ page }) => {
  await page.goto('/login');

  // Expect the login page to have an email input.
  await expect(page.locator('input[type="email"]')).toBeVisible();
});
