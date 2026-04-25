const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToTasksTab } = require('./helpers');

test.describe('Tasks tab — data loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
  });

  test('tasks load from GitHub — at least one card visible', async ({ page }) => {
    await waitForTasksLoaded(page);
    const cards = page.locator('.card');
    await expect(cards.first()).toBeVisible({ timeout: 20000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('filter buttons are present', async ({ page }) => {
    await expect(page.locator('.filter-btn').first()).toBeVisible({ timeout: 10000 });
  });

  test('sync indicator is present', async ({ page }) => {
    await expect(page.locator('.sync-indicator')).toBeVisible({ timeout: 10000 });
  });

  test('column/section headers are visible', async ({ page }) => {
    // Mobile: .section-title, Desktop: .column-title
    const mobileSections = page.locator('.section-title');
    const desktopColumns = page.locator('.column-title');
    const mobileCount = await mobileSections.count();
    const desktopCount = await desktopColumns.count();
    expect(mobileCount + desktopCount).toBeGreaterThan(0);
  });

  test('task cards have title and meta badges', async ({ page }) => {
    await waitForTasksLoaded(page);
    const firstCard = page.locator('.card').first();
    await expect(firstCard.locator('.card-title')).toBeVisible();
    // Card meta may have tag, estimate badges
    const cardMeta = firstCard.locator('.card-meta');
    await expect(cardMeta).toBeVisible();
  });
});
