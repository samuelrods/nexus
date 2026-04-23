import { test as setup, expect } from '@playwright/test';

const AUTH_FILE = 'tests-e2e/.auth/user.json';

setup('authenticate as admin', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');

  // Fill credentials
  await page.getByTestId('login-email').fill('admin@example.com');
  await page.getByTestId('login-password').fill('password');

  // Submit
  await page.getByTestId('login-submit').click();

  // After login, the app redirects to /organizations for org selection.
  // Click "Enter" on the "Nexus Corp" organization card.
  await page.waitForURL(/\/organizations/);

  // Find the Nexus Corp card and click the "Enter" button
  const nexusCard = page.locator('text=Nexus Corp').first();
  await nexusCard.waitFor({ state: 'visible' });

  // The "Enter" button is inside the same card
  const enterButton = page
    .locator('div', { has: page.locator('text=Nexus Corp') })
    .getByRole('button', { name: /Enter/i })
    .first();
  await enterButton.click();

  // Wait for redirect to the org-scoped dashboard
  await page.waitForURL(/\/dashboard/);

  // Save signed-in state
  await page.context().storageState({ path: AUTH_FILE });
});
