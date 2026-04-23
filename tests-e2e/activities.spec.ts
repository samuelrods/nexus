import { test, expect } from '@playwright/test';
import { ORG_SLUG, uniqueId, selectRadixOption, pickRelationshipOption } from './helpers/test-utils';

test.describe('Activities', () => {
  test('list renders records', async ({ page }) => {
    await page.goto(`/${ORG_SLUG}/activities`);

    const rows = page.locator('tr[data-testid^="table-row-"]');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('log a call activity', async ({ page }) => {
    const uid = uniqueId('call');

    await page.goto(`/${ORG_SLUG}/activities/create`);

    // Select an existing contact via RelationshipSelector (required)
    await pickRelationshipOption(page, 'Contact', '');

    // Select an existing lead via RelationshipSelector (required)
    await pickRelationshipOption(page, 'Lead (Optional)', '');

    // Select activity type: Call
    await selectRadixOption(page, 'activity-type-trigger', 'Call');

    // Date should already be set to today by default
    const dateTrigger = page.getByTestId('activity-date-trigger');
    const dateText = await dateTrigger.textContent();
    if (dateText?.includes('Pick a date')) {
      await dateTrigger.click();
      const dayButton = page.locator('[role="gridcell"] button:not([disabled])').first();
      await dayButton.waitFor({ state: 'visible' });
      await dayButton.click();
    }

    // Set time
    await page.getByTestId('activity-time').fill('14:30');

    // Fill description
    await page.getByTestId('activity-description').fill(`E2E call activity ${uid}`);

    // Submit
    await page.getByTestId('activity-submit').click();

    // Should redirect to show page
    await page.waitForURL(/\/activities\/\d+/);
    await expect(page.getByTestId('activity-heading')).toContainText(/call activity/i);
    await expect(page.getByTestId('activity-type-label')).toHaveText('call');
  });

  test('log an email activity', async ({ page }) => {
    const uid = uniqueId('email');

    await page.goto(`/${ORG_SLUG}/activities/create`);

    await pickRelationshipOption(page, 'Contact', '');
    await pickRelationshipOption(page, 'Lead (Optional)', '');

    // Select activity type: Email
    await selectRadixOption(page, 'activity-type-trigger', 'Email');

    const dateTrigger = page.getByTestId('activity-date-trigger');
    const dateText = await dateTrigger.textContent();
    if (dateText?.includes('Pick a date')) {
      await dateTrigger.click();
      const dayButton = page.locator('[role="gridcell"] button:not([disabled])').first();
      await dayButton.waitFor({ state: 'visible' });
      await dayButton.click();
    }

    await page.getByTestId('activity-time').fill('09:00');
    await page.getByTestId('activity-description').fill(`E2E email activity ${uid}`);
    await page.getByTestId('activity-submit').click();

    await page.waitForURL(/\/activities\/\d+/);
    await expect(page.getByTestId('activity-heading')).toContainText(/email activity/i);
    await expect(page.getByTestId('activity-type-label')).toHaveText('email');
  });

  test('log a meeting activity', async ({ page }) => {
    const uid = uniqueId('meeting');

    await page.goto(`/${ORG_SLUG}/activities/create`);

    await pickRelationshipOption(page, 'Contact', '');
    await pickRelationshipOption(page, 'Lead (Optional)', '');

    // Select activity type: Meeting
    await selectRadixOption(page, 'activity-type-trigger', 'Meeting');

    const dateTrigger = page.getByTestId('activity-date-trigger');
    const dateText = await dateTrigger.textContent();
    if (dateText?.includes('Pick a date')) {
      await dateTrigger.click();
      const dayButton = page.locator('[role="gridcell"] button:not([disabled])').first();
      await dayButton.waitFor({ state: 'visible' });
      await dayButton.click();
    }

    await page.getByTestId('activity-time').fill('16:00');
    await page.getByTestId('activity-description').fill(`E2E meeting activity ${uid}`);
    await page.getByTestId('activity-submit').click();

    await page.waitForURL(/\/activities\/\d+/);
    await expect(page.getByTestId('activity-heading')).toContainText(/meeting activity/i);
    await expect(page.getByTestId('activity-type-label')).toHaveText('meeting');
  });

  test('edit an existing activity', async ({ page }) => {
    // Navigate to activities list and click the first activity
    await page.goto(`/${ORG_SLUG}/activities`);
    const firstRow = page.locator('tr[data-testid^="table-row-"]').first();
    await expect(firstRow).toBeVisible();
    await firstRow.click();

    await page.waitForURL(/\/activities\/\d+$/);

    // Go to edit page
    await page.getByTestId('activity-edit-btn').click();
    await page.waitForURL(/\/activities\/\d+\/edit/);

    // Update description
    const updatedDesc = `Updated activity ${uniqueId('edit')}`;
    await page.getByTestId('activity-description').fill(updatedDesc);
    await page.getByTestId('activity-submit').click();

    // Should redirect back to show page
    await page.waitForURL(/\/activities\/\d+$/);
    await expect(page.getByTestId('activity-heading')).toBeVisible();
  });

  test('delete an activity', async ({ page }) => {
    // Create an activity to delete
    const uid = uniqueId('del');

    await page.goto(`/${ORG_SLUG}/activities/create`);
    await pickRelationshipOption(page, 'Contact', '');
    await pickRelationshipOption(page, 'Lead (Optional)', '');
    await selectRadixOption(page, 'activity-type-trigger', 'Other');

    const dateTrigger = page.getByTestId('activity-date-trigger');
    const dateText = await dateTrigger.textContent();
    if (dateText?.includes('Pick a date')) {
      await dateTrigger.click();
      const dayButton = page.locator('[role="gridcell"] button:not([disabled])').first();
      await dayButton.waitFor({ state: 'visible' });
      await dayButton.click();
    }

    await page.getByTestId('activity-time').fill('11:00');
    await page.getByTestId('activity-description').fill(`Delete test ${uid}`);
    await page.getByTestId('activity-submit').click();
    await page.waitForURL(/\/activities\/\d+/);

    // Delete
    await page.getByTestId('activity-delete-btn').click();
    await page.getByTestId('activity-delete-confirm').click();

    // Should redirect back to activities index
    await page.waitForURL(new RegExp(`/${ORG_SLUG}/activities$`));
  });
});
