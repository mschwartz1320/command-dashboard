const { test, expect } = require('@playwright/test');

test.describe('Memory overview summary card', () => {
  test('summary card appears above memory content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    // Switch to Memory tab
    await page.locator('.nav-tab').filter({ hasText: 'Memory' }).click();
    await page.waitForSelector('#panel-memory.active', { timeout: 5000 });
    // Wait for content to load
    await page.waitForSelector('.memory-summary-card', { timeout: 15000 });
    const card = page.locator('.memory-summary-card');
    await expect(card).toBeVisible();
    // Should contain key reference info
    const text = await card.textContent();
    expect(text).toContain('Name');
    expect(text).toContain('Location');
  });

  test('summary card appears before raw markdown content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await page.locator('.nav-tab').filter({ hasText: 'Memory' }).click();
    await page.waitForSelector('.memory-summary-card', { timeout: 15000 });
    // Summary card should come before the md-content
    const summaryCard = page.locator('.memory-summary-card');
    const mdContent = page.locator('#overview-content .md-content');
    const summaryBox = await summaryCard.boundingBox();
    const mdBox = await mdContent.boundingBox();
    if (summaryBox && mdBox) {
      expect(summaryBox.y).toBeLessThan(mdBox.y);
    }
  });
});
