const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToTasksTab } = require('./helpers');

test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14

test.describe('Mobile Done section', () => {
  test('Done section toggle is present and works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);
    // Done toggle should exist if there are done tasks
    const doneToggle = page.locator('#mobile-done-toggle');
    const count = await doneToggle.count();
    if (count === 0) { test.skip(true, 'No done tasks in test data'); return; }
    await expect(doneToggle).toBeVisible();
    // Section should start collapsed
    const doneSection = page.locator('#mobile-done-section');
    await expect(doneSection).not.toHaveClass(/expanded/);
    // Click toggle to expand
    await doneToggle.click();
    await expect(doneSection).toHaveClass(/expanded/);
    // Click again to collapse
    await doneToggle.click();
    await expect(doneSection).not.toHaveClass(/expanded/);
  });
});
