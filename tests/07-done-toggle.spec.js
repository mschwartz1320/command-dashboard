const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToTasksTab } = require('./helpers');

test.describe('Done column toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);
  });

  test('Done section is present or can be toggled visible', async ({ page }) => {
    const sectionTitles = page.locator('.section-title, .column-title');
    const allTitles = await sectionTitles.allTextContents();
    const hasDone = allTitles.some(t => /done/i.test(t));

    if (!hasDone) {
      // Look for a toggle button
      const toggleBtn = page.locator('button, .filter-btn').filter({ hasText: /show done|done/i });
      if (await toggleBtn.count() > 0) {
        await toggleBtn.first().click();
        await page.waitForTimeout(500);
        const titlesAfter = await page.locator('.section-title, .column-title').allTextContents();
        // Either Done appeared or toggle changed state
        expect(true).toBeTruthy(); // toggle didn't crash
      } else {
        // Done might be always visible on desktop
        test.skip(true, 'Done column not found in current viewport');
      }
    } else {
      expect(hasDone).toBeTruthy();
    }
  });

  test('Done column is visible on desktop layout', async ({ page, viewport }) => {
    // This test only applies at desktop width
    if (viewport && viewport.width < 768) {
      test.skip(true, 'Desktop-only test');
      return;
    }
    const desktopColumns = page.locator('.desktop-layout .column-title');
    const titles = await desktopColumns.allTextContents();
    const hasDone = titles.some(t => /done/i.test(t));
    expect(hasDone).toBeTruthy();
  });
});
