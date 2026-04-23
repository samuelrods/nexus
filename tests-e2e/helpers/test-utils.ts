import { Page, expect } from '@playwright/test';

/** Organization slug used by the seeded admin user */
export const ORG_SLUG = 'nexus-corp';

/**
 * Select an option from a Radix UI <Select> component.
 *
 * Radix renders the dropdown in a portal, so we click the trigger first,
 * wait for the content to appear, then click the matching option.
 */
export async function selectRadixOption(
  page: Page,
  triggerTestId: string,
  optionText: string,
) {
  await page.getByTestId(triggerTestId).click();
  // Radix Select renders items with role="option"
  await page.getByRole('option', { name: optionText }).click();
}

/**
 * Pick an existing item from a RelationshipSelector dialog.
 *
 * The RelationshipSelector renders a combobox button → Dialog with search.
 * We locate by the Label text above the selector, open it, search, and pick
 * the first matching result.
 */
export async function pickRelationshipOption(
  page: Page,
  labelText: string,
  searchText: string,
) {
  // Find the field wrapper via its <Label> and then click the combobox trigger inside
  const fieldWrapper = page.locator('.space-y-1', {
    has: page.getByText(labelText, { exact: true }),
  });
  await fieldWrapper.getByRole('combobox').click();

  // Wait for the dialog to appear
  const dialog = page.getByRole('dialog');
  await dialog.waitFor({ state: 'visible' });

  // Type into the search input inside the dialog
  const searchInput = dialog.locator('input[placeholder="Type to search..."]');
  await searchInput.fill(searchText);

  // Wait for results to load, then click the first match
  const firstResult = dialog.locator(
    'button.w-full.flex.items-center',
  ).first();
  await firstResult.waitFor({ state: 'visible' });
  await firstResult.click();
}

/**
 * Generate a unique string for test isolation.
 */
export function uniqueId(prefix = 'e2e'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
