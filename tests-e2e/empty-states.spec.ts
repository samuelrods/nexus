import { test, expect } from '@playwright/test';
import { ORG_SLUG, uniqueId } from './helpers/test-utils';

test.describe('Empty States', () => {
  test('companies list shows empty state when no results match search', async ({ page }) => {
    await page.goto(`/${ORG_SLUG}/companies`);

    // Search for a random string that won't match anything
    const randomQuery = uniqueId('nonexistent');
    await page.getByTestId('table-search').fill(randomQuery);

    // Wait for the table to update
    const emptyState = page.getByTestId('table-empty');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No data found');
    await expect(emptyState).toContainText('Try adjusting your search');
  });

  test('contacts list shows empty state when no results match search', async ({ page }) => {
    await page.goto(`/${ORG_SLUG}/contacts`);

    const randomQuery = uniqueId('nonexistent');
    await page.getByTestId('table-search').fill(randomQuery);

    const emptyState = page.getByTestId('table-empty');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No data found');
  });

  test('leads list shows empty state when no results match search', async ({ page }) => {
    await page.goto(`/${ORG_SLUG}/leads`);

    const randomQuery = uniqueId('nonexistent');
    await page.getByTestId('table-search').fill(randomQuery);

    const emptyState = page.getByTestId('table-empty');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No data found');
  });
});
