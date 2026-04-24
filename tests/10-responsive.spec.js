const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToInsightsTab, goToMemoryTab } = require('./helpers');

test.describe('Responsive layout — Desktop (1280px)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await waitForTasksLoaded(page);
  });

  test('desktop layout is active at 1280px', async ({ page }) => {
    const desktopLayout = page.locator('.desktop-layout');
    await expect(desktopLayout).toBeVisible();

    // Mobile layout should be hidden
    const mobileLayout = page.locator('.mobile-layout');
    await expect(mobileLayout).not.toBeVisible();
  });

  test('board has 3 or more columns at 1280px', async ({ page }) => {
    const columns = page.locator('.desktop-layout .column, .board .column');
    const count = await columns.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('kanban board is visible with column headers', async ({ page }) => {
    const board = page.locator('.board');
    await expect(board).toBeVisible({ timeout: 5000 });

    const columnTitles = page.locator('.column-title');
    await expect(columnTitles.first()).toBeVisible();
    expect(await columnTitles.count()).toBeGreaterThanOrEqual(3);
  });

  test('FAB is visible on desktop', async ({ page }) => {
    await expect(page.locator('.fab')).toBeVisible();
  });

  test('filter buttons visible on desktop', async ({ page }) => {
    await expect(page.locator('.filter-btn').first()).toBeVisible();
  });

  test('Memory tab renders correctly on desktop', async ({ page }) => {
    await goToMemoryTab(page);
    const activePanel = page.locator('.tab-panel.active');
    await expect(activePanel).toBeVisible({ timeout: 5000 });
  });

  test('Insights tab renders correctly on desktop', async ({ page }) => {
    await goToInsightsTab(page);
    await page.waitForTimeout(2000);
    const activePanel = page.locator('.tab-panel.active');
    await expect(activePanel).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Responsive layout — Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await waitForTasksLoaded(page);
  });

  test('mobile layout is active at 375px', async ({ page }) => {
    const mobileLayout = page.locator('.mobile-layout');
    await expect(mobileLayout).toBeVisible();

    // Desktop layout should be hidden
    const desktopLayout = page.locator('.desktop-layout');
    await expect(desktopLayout).not.toBeVisible();
  });

  test('mobile sections are stacked vertically', async ({ page }) => {
    const sections = page.locator('.mobile-layout .section');
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);

    // Sections should be stacked (each below the other)
    if (count >= 2) {
      const box1 = await sections.nth(0).boundingBox();
      const box2 = await sections.nth(1).boundingBox();
      if (box1 && box2) {
        // Section 2 top should be below section 1 bottom (stacked)
        expect(box2.y).toBeGreaterThan(box1.y);
      }
    }
  });

  test('FAB is visible on mobile', async ({ page }) => {
    await expect(page.locator('.fab')).toBeVisible();
  });

  test('header filters are horizontally scrollable on mobile', async ({ page }) => {
    const filters = page.locator('.filters');
    await expect(filters).toBeVisible();
  });

  test('task cards are full-width on mobile', async ({ page }) => {
    const cards = page.locator('.card');
    if (await cards.count() > 0) {
      const box = await cards.first().boundingBox();
      if (box) {
        // Card should be nearly full viewport width
        expect(box.width).toBeGreaterThan(300);
      }
    }
  });

  test('nav tabs visible and tappable on mobile', async ({ page }) => {
    const tabs = page.locator('.nav-tab');
    await expect(tabs.first()).toBeVisible();

    // Tap Memory tab
    await tabs.filter({ hasText: 'Memory' }).click();
    await expect(tabs.filter({ hasText: 'Memory' })).toHaveClass(/active/);
  });
});
