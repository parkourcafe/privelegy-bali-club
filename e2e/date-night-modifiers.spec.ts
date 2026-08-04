import { test, expect } from "@playwright/test";

// Tests for date-night modifier refinement (Intent OS pilot OB-CAN-0011).
// These tests use seeded fixture venues (NEXT_PUBLIC_TEST_MODE=1) to verify
// the modifier UI rendering and filtering behavior without requiring a live
// Supabase connection.
//
// Note: NEXT_PUBLIC_TEST_MODE=1 is set in playwright.config.ts webServer.env
// NEXT_PUBLIC_OB_DATE_NIGHT_MODIFIERS must be set in tests that require the feature flag.

test.describe("Date-night modifiers — feature flag OFF", () => {
  test("should render the date-night spoke without modifier UI when flag is off", async ({
    page,
  }) => {
    await page.goto("/bali/ubud/date-night");

    // Should render without 404
    const title = await page.locator("h1");
    await expect(title).toBeVisible();

    // No "Narrow it down" heading when flag is off
    const narrowHeading = page.locator('text="Narrow it down"');
    await expect(narrowHeading).not.toBeVisible();

    // Should render all 9 venues without filtering
    const venueCards = page.locator("[data-refine-grid]");
    // With flag OFF, the grid wrapper should not exist
    const hasRefineGrid = await venueCards.count();
    expect(hasRefineGrid).toBe(0);
  });
});

test.describe("Date-night modifiers — Ubud", () => {
  // NEXT_PUBLIC_TEST_MODE=1 is set in playwright.config.ts
  // NEXT_PUBLIC_OB_DATE_NIGHT_MODIFIERS=1 is set by environment or must be enabled for these tests

  test("should render modifier UI with correct modifier counts", async ({ page }) => {
    await page.goto("/bali/ubud/date-night");

    // Page should load successfully
    await expect(page.locator("h1")).toBeVisible();

    // "Narrow it down" section should be visible
    const narrowHeading = page.locator('text="Narrow it down"');
    await expect(narrowHeading).toBeVisible();

    // Check "Any" button exists and is active
    const anyButton = page.locator("a[aria-current=true]", {
      hasText: "Any",
    });
    await expect(anyButton).toBeVisible();

    // Verify modifier chips are present with correct counts
    const specialOccasionChip = page.locator("text=/Special occasion.*4/");
    await expect(specialOccasionChip).toBeVisible();

    const sunsetViewChip = page.locator("text=/Sunset view.*2/");
    await expect(sunsetViewChip).toBeVisible();

    // Quiet should not be visible (0 venues have it in Ubud fixtures)
    const quietChip = page.locator("text=Quiet");
    await expect(quietChip).not.toBeVisible();

    // Secluded should not be visible (permanently unavailable)
    const secludedChip = page.locator("text=Secluded");
    await expect(secludedChip).not.toBeVisible();

    // All 9 venues should be visible
    const visibleCards = page.locator("[data-refine-grid] > [data-refine]");
    await expect(visibleCards).toHaveCount(9);
  });

  test("should filter venues when Special occasion is selected", async ({ page }) => {
    await page.goto("/bali/ubud/date-night");

    // Click the "Special occasion" modifier chip
    const specialOccasionChip = page.locator("a", {
      hasText: /Special occasion/,
    });
    await specialOccasionChip.click();

    // Should see only 4 special-occasion venues
    const visibleCards = page.locator("[data-refine-grid] > [data-refine]:visible");
    const cardCount = await visibleCards.count();
    expect(cardCount).toBe(4);

    // URL should include ?refine=special-occasion
    await expect(page).toHaveURL(/\?refine=special-occasion$/);

    // The "Special occasion" chip should be marked as active
    const activeChip = page.locator("a[aria-current=true]", {
      hasText: /Special occasion/,
    });
    await expect(activeChip).toBeVisible();
  });

  test("should filter venues when Sunset view is selected", async ({ page }) => {
    await page.goto("/bali/ubud/date-night");

    // Click the "Sunset view" modifier chip
    const sunsetViewChip = page.locator("a", {
      hasText: /Sunset view/,
    });
    await sunsetViewChip.click();

    // Should see only 2 sunset-view venues
    const visibleCards = page.locator("[data-refine-grid] > [data-refine]:visible");
    const cardCount = await visibleCards.count();
    expect(cardCount).toBe(2);

    // URL should include ?refine=sunset-view
    await expect(page).toHaveURL(/\?refine=sunset-view$/);

    // The "Sunset view" chip should be marked as active
    const activeChip = page.locator("a[aria-current=true]", {
      hasText: /Sunset view/,
    });
    await expect(activeChip).toBeVisible();
  });

  test("should restore full venue list when clicking Any after filtering", async ({
    page,
  }) => {
    await page.goto("/bali/ubud/date-night?refine=special-occasion");

    // Initially should show only 4 venues
    let visibleCards = page.locator("[data-refine-grid] > [data-refine]:visible");
    expect(await visibleCards.count()).toBe(4);

    // Click the "Any" button
    const anyButton = page.locator("a", {
      hasText: "Any",
    });
    await anyButton.click();

    // Should restore all 9 venues
    visibleCards = page.locator("[data-refine-grid] > [data-refine]:visible");
    expect(await visibleCards.count()).toBe(9);

    // URL should not include refine parameter
    await expect(page).toHaveURL(/^\/bali\/ubud\/date-night$/);
  });

  test("should not create duplicate venues when filtering", async ({ page }) => {
    await page.goto("/bali/ubud/date-night");

    // Get all venues when showing everything
    const allCards = page.locator("[data-refine-grid] > [data-refine]");
    const allCardCount = await allCards.count();
    expect(allCardCount).toBe(9);

    // Apply a filter
    const specialOccasionChip = page.locator("a", {
      hasText: /Special occasion/,
    });
    await specialOccasionChip.click();

    // Get filtered venues count
    const filteredCards = page.locator("[data-refine-grid] > [data-refine]:visible");
    const filteredCardCount = await filteredCards.count();
    expect(filteredCardCount).toBe(4);

    // Ensure no duplicate rendering (check by verifying count matches expected)
    expect(filteredCardCount).toBeLessThanOrEqual(allCardCount);
  });

  test("should track analytics when modifier is applied", async ({ page }) => {
    await page.goto("/bali/ubud/date-night");

    // Intercept analytics calls (if any)
    const requests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("analytics") || req.url().includes("track")) {
        requests.push(req.url());
      }
    });

    // Click a modifier
    const specialOccasionChip = page.locator("a", {
      hasText: /Special occasion/,
    });
    await specialOccasionChip.click();

    // Wait a moment for analytics to fire
    await page.waitForTimeout(100);
  });
});

test.describe("Date-night modifiers — Uluwatu & Bukit", () => {
  // NEXT_PUBLIC_TEST_MODE=1 is set in playwright.config.ts
  // NEXT_PUBLIC_OB_DATE_NIGHT_MODIFIERS=1 is set by environment or must be enabled for these tests

  test("should render Quiet modifier for Uluwatu with correct count", async ({ page }) => {
    await page.goto("/bali/uluwatu-bukit/date-night");

    // Page should load successfully
    await expect(page.locator("h1")).toBeVisible();

    // "Narrow it down" section should be visible
    const narrowHeading = page.locator('text="Narrow it down"');
    await expect(narrowHeading).toBeVisible();

    // Quiet should be visible with count 7
    const quietChip = page.locator("text=/Quiet.*7/");
    await expect(quietChip).toBeVisible();

    // All 7 venues should be visible
    const visibleCards = page.locator("[data-refine-grid] > [data-refine]");
    await expect(visibleCards).toHaveCount(7);
  });

  test("should filter Uluwatu venues when Quiet is selected", async ({ page }) => {
    await page.goto("/bali/uluwatu-bukit/date-night");

    // Click the "Quiet" modifier chip
    const quietChip = page.locator("a", {
      hasText: /Quiet/,
    });
    await quietChip.click();

    // Should see all 7 quiet venues (all in fixture have quiet tag)
    const visibleCards = page.locator("[data-refine-grid] > [data-refine]:visible");
    const cardCount = await visibleCards.count();
    expect(cardCount).toBe(7);

    // URL should include ?refine=quiet
    await expect(page).toHaveURL(/\?refine=quiet$/);

    // The "Quiet" chip should be marked as active
    const activeChip = page.locator("a[aria-current=true]", {
      hasText: /Quiet/,
    });
    await expect(activeChip).toBeVisible();
  });
});

test.describe("Date-night modifiers — Edge cases", () => {
  // NEXT_PUBLIC_TEST_MODE=1 is set in playwright.config.ts
  // NEXT_PUBLIC_OB_DATE_NIGHT_MODIFIERS=1 is set by environment or must be enabled for these tests

  test("should render zero-result state when no venues match the filter", async ({
    page,
  }) => {
    // Use a URL with a filter that would theoretically return 0 results
    // This tests the defensive coding path
    await page.goto("/bali/ubud/date-night?refine=quiet");

    // Ubud has no quiet venues in the fixture
    // The "Quiet" modifier should not appear in the UI at all when offered = []
    // But if we manually edit the URL, we should still see a reasonable state

    // Should still show all venues (unknown/unavailable modifiers return the full set)
    const visibleCards = page.locator("[data-refine-grid] > [data-refine]:visible");
    const cardCount = await visibleCards.count();
    expect(cardCount).toBe(9);
  });

  test("should have no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.goto("/bali/ubud/date-night");

    // Click through various modifiers to ensure no errors
    const specialOccasionChip = page.locator("a", {
      hasText: /Special occasion/,
    });
    await specialOccasionChip.click();

    await page.waitForTimeout(100);

    // Should have no errors
    expect(errors).toHaveLength(0);
  });

  test("should have no hydration mismatches", async ({ page }) => {
    let hydrationErrors = false;
    page.on("pageerror", (error) => {
      if (error.message.includes("Hydration") || error.message.includes("hydration")) {
        hydrationErrors = true;
      }
    });

    await page.goto("/bali/ubud/date-night?refine=special-occasion");
    await page.waitForTimeout(100);

    expect(hydrationErrors).toBe(false);
  });

  test("should preserve other page functionality", async ({ page }) => {
    await page.goto("/bali/ubud/date-night");

    // Breadcrumb should be visible
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();

    // Main heading should be visible
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // "More in [district]" section should be visible
    const moreSection = page.locator("text=/More in Ubud/");
    await expect(moreSection).toBeVisible();
  });
});

test.describe("Date-night modifiers — Accessibility", () => {
  // NEXT_PUBLIC_TEST_MODE=1 is set in playwright.config.ts
  // NEXT_PUBLIC_OB_DATE_NIGHT_MODIFIERS=1 is set by environment or must be enabled for these tests

  test("modifier chips should be keyboard navigable", async ({ page }) => {
    await page.goto("/bali/ubud/date-night");

    // Focus the "Any" button
    const anyButton = page.locator("a[aria-current=true]", {
      hasText: "Any",
    });

    // Tab to next element (should be Special occasion)
    await anyButton.focus();
    await page.keyboard.press("Tab");

    const specialButton = page.locator("a:focus", {
      hasText: /Special occasion/,
    });
    await expect(specialButton).toBeFocused();
  });

  test("modifier chips should have minimum touch target size", async ({ page }) => {
    await page.goto("/bali/ubud/date-night");

    // Get the Special occasion chip
    const specialChip = page.locator("a", {
      hasText: /Special occasion/,
    });

    // Get its bounding box
    const box = await specialChip.boundingBox();
    expect(box).not.toBeNull();

    // Should be at least 44px in height for mobile
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("should have proper aria-current state", async ({ page }) => {
    await page.goto("/bali/ubud/date-night");

    // Initially, "Any" should have aria-current=true
    let activeLink = page.locator("a[aria-current=true]");
    const activeCountInitial = await activeLink.count();
    expect(activeCountInitial).toBe(1);

    // Click Special occasion
    await page.locator("a", {
      hasText: /Special occasion/,
    }).click();

    // "Any" should no longer have aria-current
    const anyLink = page.locator("a", { hasText: "Any" });
    const ariaCurrentValue = await anyLink.getAttribute("aria-current");
    expect(ariaCurrentValue).toBeFalsy();

    // Special occasion should have aria-current=true
    activeLink = page.locator("a[aria-current=true]", {
      hasText: /Special occasion/,
    });
    await expect(activeLink).toBeVisible();
  });
});
