import { test, expect } from '@playwright/test';
import { ORG_SLUG } from './helpers/test-utils';

test.describe('Navigation', () => {
  test('sidebar links navigate to correct pages', async ({ page }) => {
    await page.goto(`/${ORG_SLUG}/dashboard`);

    // Check Dashboard link is active (has specific background class or just check URL)
    await expect(page.getByTestId('sidebar-item-dashboard')).toBeVisible();
    
    // Expand CRM group if not expanded (it should be expanded if we are on a CRM page, 
    // but on dashboard it might be collapsed depending on default state)
    const crmGroup = page.getByTestId('sidebar-group-crm');
    await crmGroup.click();

    // Click Contacts
    await page.getByTestId('sidebar-item-contacts').click();
    await page.waitForURL(new RegExp(`/${ORG_SLUG}/contacts`));
    await expect(page.locator('h1')).toContainText(/Contacts/i);

    // Expand Sales group
    const salesGroup = page.getByTestId('sidebar-group-sales');
    await salesGroup.click();

    // Click Deals
    await page.getByTestId('sidebar-item-deals').click();
    await page.waitForURL(new RegExp(`/${ORG_SLUG}/deals`));
    await expect(page.locator('h1')).toContainText(/Deals/i);
  });

  test('breadcrumbs update based on current page', async ({ page }) => {
    await page.goto(`/${ORG_SLUG}/companies`);
    
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText('Dashboard');
    await expect(breadcrumbs).toContainText('companies');

    // Navigate to a create page
    await page.goto(`/${ORG_SLUG}/companies/create`);
    await expect(breadcrumbs).toContainText('companies');
    await expect(breadcrumbs).toContainText('create');
  });

  test('navbar organization switcher opens', async ({ page }) => {
    await page.goto(`/${ORG_SLUG}/dashboard`);

    const orgSwitcher = page.getByRole('button', { name: /Nexus Corp/i });
    await expect(orgSwitcher).toBeVisible();
    await orgSwitcher.click();

    // Should see "Switch Organization" label in dropdown
    await expect(page.getByText('Switch Organization')).toBeVisible();
    // Should see "Manage Organizations" link
    await expect(page.getByText('Manage Organizations')).toBeVisible();
  });

  test('user profile dropdown opens', async ({ page }) => {
    await page.goto(`/${ORG_SLUG}/dashboard`);

    // The user profile button has UserCircle icon, let's find it by role or better if it had a testid
    // Based on Navbar.tsx, it's a Button with rounded-full
    const profileBtn = page.locator('header button.rounded-full');
    await profileBtn.click();

    await expect(page.getByText('Sign out')).toBeVisible();
    // Should show user info (admin@example.com from auth.setup.ts)
    await expect(page.getByText('admin@example.com')).toBeVisible();
  });
});
