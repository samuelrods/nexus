import { test, expect } from "@playwright/test";
import {
    ORG_SLUG,
    uniqueId,
    selectRadixOption,
    pickRelationshipOption,
} from "./helpers/test-utils";

test.describe("Leads", () => {
    test("list renders records", async ({ page }) => {
        await page.goto(`/${ORG_SLUG}/leads`);

        const rows = page.locator('tr[data-testid^="table-row-"]');
        await expect(rows.first()).toBeVisible();
        expect(await rows.count()).toBeGreaterThan(0);
    });

    test("create a lead with source", async ({ page }) => {
        const uid = uniqueId("lead");

        await page.goto(`/${ORG_SLUG}/leads/create`);

        // Select an existing company via RelationshipSelector
        await pickRelationshipOption(page, "Company", "");

        // Select an existing contact via RelationshipSelector
        await pickRelationshipOption(page, "Contact", "");

        // Select source
        await selectRadixOption(page, "lead-source-trigger", "Website");

        // Status should default to "open", but set it explicitly
        await selectRadixOption(page, "lead-status-trigger", "Open");

        // Fill description
        await page.getByTestId("lead-description").fill(`E2E lead test ${uid}`);

        // Submit
        await page.getByTestId("lead-submit").click();

        // Should redirect to show page
        await page.waitForURL(/\/leads\/\d+/);

        // Verify source is displayed
        await expect(page.getByTestId("lead-source")).toContainText("website");
    });

    test("status is displayed correctly on the list", async ({ page }) => {
        await page.goto(`/${ORG_SLUG}/leads`);

        // Wait for at least one row
        const rows = page.locator('tr[data-testid^="table-row-"]');
        await expect(rows.first()).toBeVisible();

        // Find status badges in the table — they should contain valid status values
        const statusBadges = page.locator(
            'tr[data-testid^="table-row-"] span.capitalize',
        );
        const firstBadge = statusBadges.first();
        await expect(firstBadge).toBeVisible();

        const statusText = await firstBadge.textContent();
        expect(["open", "closed", "converted"]).toContain(
            statusText?.toLowerCase(),
        );
    });

    test("edit an existing lead", async ({ page }) => {
        // Navigate to leads list and click the first lead
        await page.goto(`/${ORG_SLUG}/leads`);
        const firstRow = page.locator('tr[data-testid^="table-row-"]').first();
        await expect(firstRow).toBeVisible();
        await firstRow.click();

        // Should be on show page
        await page.waitForURL(/\/leads\/\d+$/);

        // Go to edit page
        await page.getByTestId("lead-edit-btn").click();
        await page.waitForURL(/\/leads\/\d+\/edit/);

        // Change source to Referral
        await selectRadixOption(page, "lead-source-trigger", "Referral");

        // Update description
        const updatedDesc = `Updated lead ${uniqueId("edit")}`;
        await page.getByTestId("lead-description").fill(updatedDesc);
        await page.getByTestId("lead-submit").click();

        // Should redirect back to show page
        await page.waitForURL(/\/leads\/\d+$/);
        await expect(page.getByTestId("lead-source")).toContainText("referral");
    });

    test("delete a lead", async ({ page }) => {
        // Create a lead to delete
        const uid = uniqueId("del");

        await page.goto(`/${ORG_SLUG}/leads/create`);
        await pickRelationshipOption(page, "Company", "");
        await pickRelationshipOption(page, "Contact", "");
        await selectRadixOption(page, "lead-source-trigger", "Other");
        await selectRadixOption(page, "lead-status-trigger", "Open");
        await page.getByTestId("lead-description").fill(`Delete test ${uid}`);
        await page.getByTestId("lead-submit").click();
        await page.waitForURL(/\/leads\/\d+/);

        // Delete
        await page.getByTestId("lead-delete-btn").click();
        await page.getByTestId("lead-delete-confirm").click();

        // Should redirect back to leads index
        await page.waitForURL(new RegExp(`/${ORG_SLUG}/leads$`));
    });
});
