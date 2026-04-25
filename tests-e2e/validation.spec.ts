import { test, expect } from "@playwright/test";
import { ORG_SLUG } from "./helpers/test-utils";

test.describe("Form Validations", () => {
    test.describe.configure({ mode: "serial" });

    test("company creation shows validation errors", async ({ page }) => {
        test.slow(); // Give more time for parallel execution spikes
        await page.goto(`/${ORG_SLUG}/companies/create`);

        // Bypass HTML5 validation by adding noValidate to the form
        await page
            .locator("form")
            .evaluate((form) => form.setAttribute("novalidate", "novalidate"));

        // Submit empty form
        await page.getByTestId("company-submit").click();

        // Check for error messages
        const errors = page.getByTestId("input-error");
        // We expect at least two errors (name and industry)
        await expect(errors.first()).toBeVisible({ timeout: 30000 });
        await expect(
            page.locator("text=/name.*required/i").first(),
        ).toBeVisible();
        await expect(
            page.locator("text=/industry.*required/i").first(),
        ).toBeVisible();
    });

    test("contact creation shows validation errors", async ({ page }) => {
        test.slow();
        await page.goto(`/${ORG_SLUG}/contacts/create`);

        // Bypass HTML5 validation
        await page
            .locator("form")
            .evaluate((form) => form.setAttribute("novalidate", "novalidate"));

        await page.getByTestId("contact-submit").click();

        const errors = page.getByTestId("input-error");
        await expect(errors.first()).toBeVisible({ timeout: 30000 });
        await expect(
            page.locator("text=/first name.*required/i").first(),
        ).toBeVisible();
        await expect(
            page.locator("text=/last name.*required/i").first(),
        ).toBeVisible();
        await expect(
            page.locator("text=/email.*required/i").first(),
        ).toBeVisible();
    });
});
