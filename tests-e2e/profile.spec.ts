import { test, expect } from '@playwright/test';
import { ORG_SLUG } from './helpers/test-utils';

test.describe('User Profile', () => {
  test('can navigate to profile from navbar', async ({ page }) => {
    await page.goto(`/${ORG_SLUG}/dashboard`);
    
    // Open user menu
    await page.locator('header button.rounded-full').click();
    
    // Wait for the dropdown menu to be visible
    const dropdownMenu = page.getByRole('menu');
    await expect(dropdownMenu).toBeVisible();
    
    // Click Profile link
    const profileLink = page.getByRole('menuitem', { name: /Profile/i });
    await expect(profileLink).toBeVisible();
    await profileLink.click();
    
    await page.waitForURL(/\/profile/);
    await expect(page.getByRole('heading', { name: 'Profile', exact: true })).toBeVisible();
  });

  test('can update profile information', async ({ page }) => {
    await page.goto('/profile');
    
    const firstNameInput = page.getByTestId('profile-first-name');
    const lastNameInput = page.getByTestId('profile-last-name');
    const submitBtn = page.getByTestId('profile-info-submit');

    // Verify initial values
    await expect(firstNameInput).toHaveValue('Admin');
    await expect(lastNameInput).toHaveValue('User');

    // Fill new info
    await firstNameInput.fill('Admin-Updated');
    await lastNameInput.fill('User-Updated');
    await submitBtn.click();

    // Check for success message
    const successMsg = page.getByTestId('profile-info-success');
    await expect(successMsg).toBeVisible();
    await expect(successMsg).toContainText('Saved');

    // Verify it persisted (refresh)
    await page.reload();
    await expect(page.getByTestId('profile-first-name')).toHaveValue('Admin-Updated');
    await expect(page.getByTestId('profile-last-name')).toHaveValue('User-Updated');

    // Restore original info
    await page.getByTestId('profile-first-name').fill('Admin');
    await page.getByTestId('profile-last-name').fill('User');
    await page.getByTestId('profile-info-submit').click();
    await expect(page.getByTestId('profile-info-success')).toBeVisible();
  });

  test('can update password', async ({ page }) => {
    await page.goto('/profile');

    await page.getByTestId('profile-current-password').fill('password');
    await page.getByTestId('profile-new-password').fill('new-password123');
    await page.getByTestId('profile-password-confirmation').fill('new-password123');
    
    await page.getByTestId('profile-password-submit').click();

    const successMsg = page.getByTestId('profile-password-success');
    await expect(successMsg).toBeVisible();
    await expect(successMsg).toContainText('Saved');

    // Restore original password
    await page.getByTestId('profile-current-password').fill('new-password123');
    await page.getByTestId('profile-new-password').fill('password');
    await page.getByTestId('profile-password-confirmation').fill('password');
    await page.getByTestId('profile-password-submit').click();
    await expect(page.getByTestId('profile-password-success')).toBeVisible();
  });

  test('delete account dialog opens and closes', async ({ page }) => {
    await page.goto('/profile');

    await page.getByTestId('profile-delete-button').click();
    
    await expect(page.getByText('Are you sure you want to delete your account?')).toBeVisible();
    await expect(page.getByTestId('profile-delete-confirm')).toBeVisible();
    
    // Close dialog
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.getByText('Are you sure you want to delete your account?')).not.toBeVisible();
  });
});
