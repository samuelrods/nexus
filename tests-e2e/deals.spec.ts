import { test, expect } from "@playwright/test";
import {
    ORG_SLUG,
    uniqueId,
    selectRadixOption,
    pickRelationshipOption,
} from "./helpers/test-utils";

test.describe("Deals", () => {
    test.describe.configure({ mode: "serial" });

    test("list renders records", async ({ page }) => {
        await page.goto(`/${ORG_SLUG}/deals`);

        const rows = page.locator('tr[data-testid^="table-row-"]');
        await expect(rows.first()).toBeVisible();
        expect(await rows.count()).toBeGreaterThan(0);
    });

    test("create a deal with value", async ({ page }) => {
        const uid = uniqueId("deal");
        const dealName = `Deal-${uid}`;

        await page.goto(`/${ORG_SLUG}/deals/create`);

        // Fill deal details
        await page.getByTestId("deal-name").fill(dealName);
        await page.getByTestId("deal-value").fill("50000");

        // Pick a close date — click the date trigger, then select a day
        await page.getByTestId("deal-close-date-trigger").click();
        // react-day-picker uses role="gridcell" for day buttons
        const dayButton = page
            .locator('[role="gridcell"] button:not([disabled])')
            .first();
        await dayButton.waitFor({ state: "visible" });
        await dayButton.click();

        // Set status to pending
        await selectRadixOption(page, "deal-status-trigger", "Pending");

        // Select required relationships
        await pickRelationshipOption(page, "Lead", "");
        await pickRelationshipOption(page, "Company", "");
        await pickRelationshipOption(page, "Contact", "");

        // Fill description
        await page.getByTestId("deal-description").fill(`E2E deal test ${uid}`);

        // Submit
        await page.getByTestId("deal-submit").click();

        // Should redirect to show page
        await page.waitForURL(/\/deals\/\d+/);
        await expect(page.getByTestId("deal-name")).toHaveText(dealName);
    });

    test("edit a deal", async ({ page }) => {
        // Navigate to deals list and click the first deal
        await page.goto(`/${ORG_SLUG}/deals`);
        const firstRow = page.locator('tr[data-testid^="table-row-"]').first();
        await expect(firstRow).toBeVisible();
        await firstRow.click();

        await page.waitForURL(/\/deals\/\d+$/);

        // Go to edit page
        await page.getByTestId("deal-edit-btn").click();
        await page.waitForURL(/\/deals\/\d+\/edit/);

        // Update the name
        const updatedName = `Updated-Deal-${uniqueId("edit")}`;
        await page.getByTestId("deal-name").fill(updatedName);
        await page.getByTestId("deal-submit").click();

        // Verify on show page
        await page.waitForURL(/\/deals\/\d+$/);
        await expect(page.getByTestId("deal-name")).toHaveText(updatedName);
    });

    test("status transition: pending → won", async ({ page }) => {
        test.slow(); // Triple the default timeout for this test

        // Navigate to deals list and find a deal that is PENDING
        await page.goto(`/${ORG_SLUG}/deals`);

        // Search for a deal we know exists or just pick one that says 'pending'
        // This is still prone to collisions, so let's try to pick a different one based on worker index if possible,
        // but Playwright doesn't easily expose worker index here without complex setup.
        // Instead, let's just make the transition more robust.
        const pendingRow = page
            .locator("tr")
            .filter({ has: page.locator("span", { hasText: /^pending$/i }) })
            .first();
        await expect(pendingRow).toBeVisible();
        await pendingRow.click();

        await page.waitForURL(/\/deals\/\d+$/);

        // Go to edit page
        await page.getByTestId("deal-edit-btn").click();
        await page.waitForURL(/\/deals\/\d+\/edit/);

        // Change status to Won
        await selectRadixOption(page, "deal-status-trigger", "Won");
        await page.getByTestId("deal-submit").click();

        // Verify on show page
        await page.waitForURL(/\/deals\/\d+$/);
        const statusBadge = page.locator("span.capitalize", {
            hasText: /^won$/i,
        });
        await expect(statusBadge.first()).toBeVisible({ timeout: 20000 });
    });

    test("status transition: pending → lost", async ({ page }) => {
        test.slow();

        // Navigate to deals list and find a deal that is PENDING
        await page.goto(`/${ORG_SLUG}/deals`);

        // Pick the LAST pending row to reduce collision with the 'won' test which picks the FIRST
        const pendingRow = page
            .locator("tr")
            .filter({ has: page.locator("span", { hasText: /^pending$/i }) })
            .last();
        await expect(pendingRow).toBeVisible();
        await pendingRow.click();

        await page.waitForURL(/\/deals\/\d+$/);

        // Go to edit page
        await page.getByTestId("deal-edit-btn").click();
        await page.waitForURL(/\/deals\/\d+\/edit/);

        // Change status to Lost
        await selectRadixOption(page, "deal-status-trigger", "Lost");
        await page.getByTestId("deal-submit").click();

        // Verify on show page
        await page.waitForURL(/\/deals\/\d+$/);
        const statusBadge = page.locator("span.capitalize", {
            hasText: /^lost$/i,
        });
        await expect(statusBadge.first()).toBeVisible({ timeout: 20000 });
    });

    test("delete a deal", async ({ page }) => {
        // Navigate to a deal's show page via the list
        await page.goto(`/${ORG_SLUG}/deals`);
        const rows = page.locator('tr[data-testid^="table-row-"]');
        await expect(rows.first()).toBeVisible();

        // Click last row to avoid interfering with the status transition tests
        await rows.last().click();
        await page.waitForURL(/\/deals\/\d+$/);

        // Click Delete button
        const deleteBtn = page.getByRole("button", { name: /Delete/i });
        await deleteBtn.click();

        // Confirm deletion in the dialog
        const confirmBtn = page.getByRole("button", { name: /Yes, I'm sure/i });
        await confirmBtn.click();

        // Should redirect back to deals index
        await page.waitForURL(new RegExp(`/${ORG_SLUG}/deals$`));
    });
});
