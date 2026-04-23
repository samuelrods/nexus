import { test, expect } from '@playwright/test';
import { ORG_SLUG, uniqueId } from './helpers/test-utils';

test.describe('Companies', () => {
  test('list renders records', async ({ page }) => {
    await page.goto(`/${ORG_SLUG}/companies`);

    // Wait for the table to load — seeded data should produce at least one row
    const rows = page.locator('tr[data-testid^="table-row-"]');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('create a company with address and industry', async ({ page }) => {
    const uid = uniqueId('company');
    const companyName = `TestCorp-${uid}`;

    await page.goto(`/${ORG_SLUG}/companies/create`);

    // Fill company details
    await page.getByTestId('company-name').fill(companyName);
    await page.getByTestId('company-industry').fill('Technology');
    await page.getByTestId('company-website').fill(`https://${uid}.example.com`);
    await page.getByTestId('company-description').fill('Created by E2E test');

    // Fill address fields
    await page.getByTestId('company-street-address').fill('123 Test Street');
    await page.getByTestId('company-city').fill('Testville');
    await page.getByTestId('company-state').fill('TX');
    await page.getByTestId('company-zip-code').fill('78001');

    // Submit
    await page.getByTestId('company-submit').click();

    // Should redirect to show page with the company name visible
    await page.waitForURL(/\/companies\/\d+/);
    await expect(page.getByTestId('company-name')).toContainText(companyName);
  });

  test('edit an existing company', async ({ page }) => {
    // Navigate to companies list and click the first company
    await page.goto(`/${ORG_SLUG}/companies`);
    const firstRow = page.locator('tr[data-testid^="table-row-"]').first();
    await expect(firstRow).toBeVisible();
    await firstRow.click();

    // Should be on show page
    await page.waitForURL(/\/companies\/\d+$/);

    // Go to edit page
    await page.getByTestId('company-edit-btn').click();
    await page.waitForURL(/\/companies\/\d+\/edit/);

    // Update the industry
    const updatedIndustry = `Updated-Industry-${uniqueId('ind')}`;
    await page.getByTestId('company-industry').fill(updatedIndustry);
    await page.getByTestId('company-submit').click();

    // Should redirect back to show page
    await page.waitForURL(/\/companies\/\d+$/);
    // Verify the page loaded (the industry is displayed in the show page)
    await expect(page.getByTestId('company-name')).toBeVisible();
  });

  test('delete a company', async ({ page }) => {
    // Create a company to delete
    const uid = uniqueId('del');
    const companyName = `DelCo-${uid}`;

    await page.goto(`/${ORG_SLUG}/companies/create`);
    await page.getByTestId('company-name').fill(companyName);
    await page.getByTestId('company-industry').fill('Temp');
    await page.getByTestId('company-website').fill(`https://${uid}.temp.com`);
    await page.getByTestId('company-description').fill('Will be deleted');
    await page.getByTestId('company-street-address').fill('1 Temp St');
    await page.getByTestId('company-city').fill('Temptown');
    await page.getByTestId('company-state').fill('CA');
    await page.getByTestId('company-zip-code').fill('90001');
    await page.getByTestId('company-submit').click();
    await page.waitForURL(/\/companies\/\d+/);

    // Click Delete button to open confirmation dialog
    await page.getByTestId('company-delete-btn').click();

    // Confirm deletion
    await page.getByTestId('company-delete-confirm').click();

    // Should redirect back to companies index
    await page.waitForURL(new RegExp(`/${ORG_SLUG}/companies$`));
  });
});
