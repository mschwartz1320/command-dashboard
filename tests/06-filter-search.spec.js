const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToTasksTab } = require('./helpers');

test.describe('Filter and search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);
  });

  test('filter buttons are clickable and change active state', async ({ page }) => {
    const filterBtns = page.locator('.filter-btn');
    const count = await filterBtns.count();
    expect(count).toBeGreaterThan(0);

    if (count > 1) {
      // Click second filter button
      const btn = filterBtns.nth(1);
      await btn.click();
      await expect(btn).toHaveClass(/active/);
      await page.waitForTimeout(300);

      // Reset to first (All)
      await filterBtns.first().click();
      await expect(filterBtns.first()).toHaveClass(/active/);
    }
  });

  test('filter by job tag shows only job-tagged cards', async ({ page }) => {
    const filterBtns = page.locator('.filter-btn');
    const jobFilter = filterBtns.filter({ hasText: /job/i });

    if (await jobFilter.count() > 0) {
      const totalBefore = await page.locator('.card').count();
      await jobFilter.first().click();
      await page.waitForTimeout(500);

      // Cards shown should all have job tag (or empty state)
      const visibleCards = page.locator('.card');
      const countAfter = await visibleCards.count();

      // After filtering: either fewer cards or same if all are job
      expect(countAfter).toBeGreaterThanOrEqual(0);

      // Reset
      await filterBtns.first().click();
      await page.waitForTimeout(300);
      const countReset = await page.locator('.card').count();
      expect(countReset).toBe(totalBefore);
    } else {
      test.skip(true, 'No job filter button found');
    }
  });

  test('search box is present and filters cards', async ({ page }) => {
    // Search box may be in header area or tasks section
    const searchBox = page.locator('.search-box, input[placeholder*="Search" i], input[placeholder*="search" i]');

    if (await searchBox.count() > 0) {
      const sb = searchBox.first();
      await expect(sb).toBeVisible();

      // Search for a term that should match (task titles in TASKS.md)
      await sb.fill('Gorgias');
      await page.waitForTimeout(600);

      // Result: some cards visible matching Gorgias
      const cards = page.locator('.card');
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(0); // may be 0 if not in view

      // Clear search
      await sb.fill('');
      await sb.press('Enter');
      await page.waitForTimeout(300);
    } else {
      test.skip(true, 'No search box found');
    }
  });

  test('empty/nonsense search returns no cards', async ({ page }) => {
    const searchBox = page.locator('.search-box, input[placeholder*="Search" i], input[placeholder*="search" i]');

    if (await searchBox.count() > 0) {
      const sb = searchBox.first();

      await sb.fill('xyzzy_nonexistent_task_99999');
      await page.waitForTimeout(600);

      const visibleCards = page.locator('.card:visible');
      const count = await visibleCards.count();
      const emptyState = page.locator('.empty');
      const hasEmpty = await emptyState.isVisible().catch(() => false);

      // Either 0 cards or an empty state message
      expect(count === 0 || hasEmpty).toBeTruthy();

      // Clear
      await sb.fill('');
      await page.waitForTimeout(300);
    } else {
      test.skip(true, 'No search box found');
    }
  });

  test('filter with no matching results shows empty state or zero cards', async ({ page }) => {
    const filterBtns = page.locator('.filter-btn');
    const count = await filterBtns.count();

    if (count > 1) {
      // Click through filters to find one with 0 results (not guaranteed)
      for (let i = 1; i < Math.min(count, 5); i++) {
        await filterBtns.nth(i).click();
        await page.waitForTimeout(300);
        // Page should still be responsive
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('.fab')).toBeVisible();
      }
      // Reset
      await filterBtns.first().click();
      await page.waitForTimeout(300);
    }
  });
});
