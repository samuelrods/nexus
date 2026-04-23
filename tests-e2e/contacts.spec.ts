import { test, expect } from '@playwright/test';
import { ORG_SLUG, uniqueId, pickRelationshipOption } from './helpers/test-utils';

test.describe('Contacts', () => {
  test('list renders records', async ({ page }) => {
    await page.goto(`/${ORG_SLUG}/contacts`);

    // Wait for the table to load — seeded data should produce at least one row
    const rows = page.locator('tr[data-testid^="table-row-"]');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('create a new contact via form', async ({ page }) => {
    const uid = uniqueId('contact');
    const firstName = `Test-${uid}`;
    const lastName = 'Doe';

    await page.goto(`/${ORG_SLUG}/contacts/create`);

    // Fill the form
    await page.getByTestId('contact-first-name').fill(firstName);
    await page.getByTestId('contact-last-name').fill(lastName);
    await page.getByTestId('contact-email').fill(`${uid}@e2etest.com`);
    await page.getByTestId('contact-phone').fill('+1 555 000 1234');
    await page.getByTestId('contact-job-title').fill('QA Engineer');
    await page.getByTestId('contact-description').fill('Created by E2E test');

    // Select a company via RelationshipSelector (required for organization_name)
    await pickRelationshipOption(page, 'Company', '');

    // Submit
    await page.getByTestId('contact-submit').click();

    // Should redirect to show page with the contact name visible
    await page.waitForURL(/\/contacts\/\d+/);
    await expect(page.getByTestId('contact-full-name')).toHaveText(`${firstName} ${lastName}`);
  });

  test('edit an existing contact', async ({ page }) => {
    // Navigate to contacts list and click the first contact
    await page.goto(`/${ORG_SLUG}/contacts`);
    const firstRow = page.locator('tr[data-testid^="table-row-"]').first();
    await expect(firstRow).toBeVisible();
    await firstRow.click();

    // Should be on show page
    await page.waitForURL(/\/contacts\/\d+$/);
    const originalName = await page.getByTestId('contact-full-name').textContent();

    // Go to edit page
    await page.getByTestId('contact-edit-btn').click();
    await page.waitForURL(/\/contacts\/\d+\/edit/);

    // Update the first name
    const updatedFirstName = `Updated-${uniqueId('edit')}`;
    await page.getByTestId('contact-first-name').fill(updatedFirstName);
    await page.getByTestId('contact-submit').click();

    // Should redirect back to show page with the updated name
    await page.waitForURL(/\/contacts\/\d+$/);
    await expect(page.getByTestId('contact-full-name')).toContainText(updatedFirstName);
  });

  test('delete a contact', async ({ page }) => {
    // First create a contact to delete
    const uid = uniqueId('del');

    await page.goto(`/${ORG_SLUG}/contacts/create`);
    await page.getByTestId('contact-first-name').fill(`Delete-${uid}`);
    await page.getByTestId('contact-last-name').fill('DelTest');
    await page.getByTestId('contact-email').fill(`${uid}@delete.com`);
    await page.getByTestId('contact-phone').fill('+1 555 333 4444');
    await page.getByTestId('contact-job-title').fill('Temp');
    await page.getByTestId('contact-description').fill('Will be deleted');

    // Select a company (required for organization_name)
    await pickRelationshipOption(page, 'Company', '');

    await page.getByTestId('contact-submit').click();
    await page.waitForURL(/\/contacts\/\d+/);

    // Click Delete button to open confirmation dialog
    await page.getByTestId('contact-delete-btn').click();

    // Confirm deletion
    await page.getByTestId('contact-delete-confirm').click();

    // Should redirect back to contacts index
    await page.waitForURL(new RegExp(`/${ORG_SLUG}/contacts$`));
  });
});
