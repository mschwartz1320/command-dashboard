const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToTasksTab } = require('./helpers');

test.describe('Do it button', () => {
  test('Do it button is present in card sheet', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);
    const firstCard = page.locator('.card').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
    await page.waitForSelector('.sheet.open', { timeout: 5000 });
    const doBtn = page.locator('.do-btn');
    await expect(doBtn).toBeVisible();
    await expect(doBtn).toHaveText(/Do it/);
  });

  test('card sheet title shows task name not Move to', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);
    const firstCard = page.locator('.card').first();
    await firstCard.click();
    await page.waitForSelector('.sheet.open', { timeout: 5000 });
    const sheetTitle = await page.locator('#card-sheet .sheet-title').textContent();
    expect(sheetTitle).not.toMatch(/Move to/i);
  });

  test('toast appears after clicking Do it (mocked)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);
    // Mock webhook endpoint
    await page.route('**/*moltly*/**', route => route.fulfill({ status: 200, body: 'ok' }));
    // Mock TASKS.md PUT to avoid real writes
    await page.route('**/contents/TASKS.md', route => {
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ content: { sha: 'abc123' } })
        });
      } else {
        route.continue();
      }
    });
    const firstCard = page.locator('.card').first();
    await firstCard.click();
    await page.waitForSelector('.sheet.open', { timeout: 5000 });
    await page.locator('.do-btn').click();
    // Toast should become visible
    const toast = page.locator('#toast');
    await expect(toast).toHaveCSS('opacity', '1', { timeout: 3000 });
    await expect(toast).toContainText('Sent to AI');
  });
});
