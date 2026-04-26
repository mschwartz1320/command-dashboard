const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToTasksTab } = require('./helpers');

test.describe('Show more description expand', () => {
  test('show more expands full description without breaking HTML', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);
    // Look for a show more link
    const showMore = page.locator('.show-more').first();
    const count = await showMore.count();
    if (count === 0) { test.skip(true, 'No cards with long descriptions'); return; }
    const descEl = page.locator('.card-desc').first();
    const beforeText = await descEl.textContent();
    await showMore.click();
    // After clicking, show more should be gone and text should be longer
    await expect(page.locator('.show-more').first()).toHaveCount(0);
    const afterText = await descEl.textContent();
    expect(afterText.length).toBeGreaterThanOrEqual(beforeText.length);
    // Text should not contain raw HTML entities
    expect(afterText).not.toContain('&lt;');
    expect(afterText).not.toContain('&gt;');
  });
});
