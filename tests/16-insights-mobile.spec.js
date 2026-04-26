const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14

test.describe('Insights mobile layout', () => {
  test('insight list renders as horizontal scroll on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    // Switch to Insights tab
    await page.locator('.nav-tab').filter({ hasText: 'Insights' }).click();
    await page.waitForSelector('#panel-insights.active', { timeout: 5000 });
    // Wait for list to load
    await page.waitForSelector('.insight-list-item', { timeout: 10000 });
    // List should be flex row (horizontal) on mobile
    const list = page.locator('.insight-list');
    const display = await list.evaluate(el => getComputedStyle(el).flexDirection);
    expect(display).toBe('row');
    // Clicking an item should load content
    const firstItem = page.locator('.insight-list-item').first();
    await firstItem.click();
    await page.waitForFunction(() => {
      const area = document.getElementById('insights-content-area');
      return area && !area.innerHTML.includes('spinner') && area.innerHTML.length > 100;
    }, { timeout: 10000 });
    const content = await page.locator('#insights-content-area').textContent();
    expect(content.length).toBeGreaterThan(50);
  });
});
