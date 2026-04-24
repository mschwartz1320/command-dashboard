const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded } = require('./helpers');

test.describe('Page load and navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
  });

  test('page title is Command', async ({ page }) => {
    await expect(page).toHaveTitle(/Command/i);
  });

  test('header is visible', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('all 3 nav tabs are present', async ({ page }) => {
    const tabs = page.locator('.nav-tab');
    await expect(tabs).toHaveCount(3);
    await expect(tabs.filter({ hasText: 'Tasks' })).toBeVisible();
    await expect(tabs.filter({ hasText: 'Memory' })).toBeVisible();
    await expect(tabs.filter({ hasText: 'Insights' })).toBeVisible();
  });

  test('Tasks tab is active by default', async ({ page }) => {
    const tasksTab = page.locator('.nav-tab').filter({ hasText: 'Tasks' });
    await expect(tasksTab).toHaveClass(/active/);
  });

  test('clicking Memory tab activates it', async ({ page }) => {
    await page.locator('.nav-tab').filter({ hasText: 'Memory' }).click();
    await expect(page.locator('.nav-tab').filter({ hasText: 'Memory' })).toHaveClass(/active/);
    await page.waitForTimeout(500);
    await expect(page.locator('.tab-panel.active')).toBeVisible();
  });

  test('clicking Insights tab activates it', async ({ page }) => {
    await page.locator('.nav-tab').filter({ hasText: 'Insights' }).click();
    await expect(page.locator('.nav-tab').filter({ hasText: 'Insights' })).toHaveClass(/active/);
    await page.waitForTimeout(500);
    await expect(page.locator('.tab-panel.active')).toBeVisible();
  });

  test('FAB add button is visible on Tasks tab', async ({ page }) => {
    await waitForTasksLoaded(page);
    await expect(page.locator('.fab')).toBeVisible();
  });
});
