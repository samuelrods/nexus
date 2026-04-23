import { test, expect } from '@playwright/test';

// Auth tests need a fresh (unauthenticated) context, so we override storageState
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test('valid login redirects to organization selection', async ({ page }) => {
    await page.goto('/login');

    // Fill valid credentials
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('password');
    await page.getByTestId('login-submit').click();

    // Admin has multiple orgs, so should redirect to org selection page
    await page.waitForURL(/\/organizations/);
    await expect(page).toHaveURL(/\/organizations/);

    // Should show the organization cards
    await expect(page.locator('text=Nexus Corp')).toBeVisible();
  });

  test('invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');

    // Fill invalid credentials
    await page.getByTestId('login-email').fill('wrong@example.com');
    await page.getByTestId('login-password').fill('wrongpassword');
    await page.getByTestId('login-submit').click();

    // Should stay on login page and display error
    await expect(page).toHaveURL(/\/login/);

    // Laravel returns "These credentials do not match our records." for invalid login
    const errorMessage = page.locator('[data-testid="login-error-email"], .text-red-600, .text-red-400');
    await expect(errorMessage.first()).toBeVisible();
  });
});
