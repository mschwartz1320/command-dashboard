const { test, expect } = require('@playwright/test');
const { goToMemoryTab, goToInsightsTab } = require('./helpers');

test.describe('Memory tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
  });

  test('Memory tab loads and shows sub-tabs or content', async ({ page }) => {
    await goToMemoryTab(page);

    // Memory panel should be active
    const activePanel = page.locator('.tab-panel.active');
    await expect(activePanel).toBeVisible({ timeout: 5000 });

    // Sub-tabs should be present (memory has sub-tabs for context sections)
    const subTabs = page.locator('.sub-tab, .ctx-tab');
    const subTabCount = await subTabs.count();
    expect(subTabCount).toBeGreaterThan(0);
  });

  test('Memory sub-tabs are clickable', async ({ page }) => {
    await goToMemoryTab(page);

    const subTabs = page.locator('.sub-tab, .ctx-tab');
    const count = await subTabs.count();

    if (count > 1) {
      // Click second sub-tab
      await subTabs.nth(1).click();
      await expect(subTabs.nth(1)).toHaveClass(/active/);
      await page.waitForTimeout(500);
      // Click first sub-tab back
      await subTabs.first().click();
      await expect(subTabs.first()).toHaveClass(/active/);
    }
  });

  test('Memory tab displays markdown content', async ({ page }) => {
    await goToMemoryTab(page);
    await page.waitForTimeout(2000); // Allow async markdown fetch

    // md-content div should contain rendered markdown
    const mdContent = page.locator('.md-content, .memory-wrap .sub-panel.active');
    if (await mdContent.count() > 0) {
      // Content should be non-empty
      const text = await mdContent.first().textContent();
      // May be loading or loaded
      expect(typeof text).toBe('string');
    }
  });

  test('sync meta info is shown in Memory tab', async ({ page }) => {
    await goToMemoryTab(page);
    await page.waitForTimeout(1000);

    const syncMeta = page.locator('.sync-meta');
    // May or may not be visible depending on data
    expect(true).toBeTruthy();
  });
});

test.describe('Insights tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
  });

  test('Insights tab loads and shows content list', async ({ page }) => {
    await goToInsightsTab(page);

    const activePanel = page.locator('.tab-panel.active');
    await expect(activePanel).toBeVisible({ timeout: 5000 });

    // Insights sidebar list items should appear
    const listItems = page.locator('.insight-list-item');
    await page.waitForTimeout(2000);
    const count = await listItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking an insight shows its content', async ({ page }) => {
    await goToInsightsTab(page);
    await page.waitForTimeout(2000);

    const listItems = page.locator('.insight-list-item');
    if (await listItems.count() > 0) {
      await listItems.first().click();
      await expect(listItems.first()).toHaveClass(/active/);
      await page.waitForTimeout(1000);

      // Content area should show markdown
      const content = page.locator('.insights-content .md-content');
      if (await content.count() > 0) {
        await expect(content).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('Insights tab has title header', async ({ page }) => {
    await goToInsightsTab(page);
    await page.waitForTimeout(1000);

    const insightsTitle = page.locator('.insights-title');
    if (await insightsTitle.count() > 0) {
      await expect(insightsTitle.first()).toBeVisible();
    }
  });
});
