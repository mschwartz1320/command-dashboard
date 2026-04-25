const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToTasksTab, openAddTaskSheet } = require('./helpers');

const QA_PREFIX = '[QA-TEST]';

test.describe('Delete task', () => {
  test('add a task and delete it via confirm dialog', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    const ts = Date.now();
    const title = `${QA_PREFIX} Delete test ${ts}`;

    // Add task
    await openAddTaskSheet(page);
    await page.locator('.sheet.open .form-input').first().fill(title);
    await page.locator('.sheet.open .submit-btn').click();
    await page.waitForSelector('.sheet:not(.open)', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(3000);

    await page.reload();
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    // Find and click card
    const card = page.locator('.card-title', { hasText: title });
    await expect(card).toBeVisible({ timeout: 15000 });
    await card.click();
    await page.waitForSelector('.sheet.open', { timeout: 5000 });

    // Delete with dialog
    const deleteBtn = page.locator('.sheet.open .delete-btn');
    await expect(deleteBtn).toBeVisible();

    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    await deleteBtn.click();
    await page.waitForTimeout(3000);

    // Reload and verify gone
    await page.reload();
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    await expect(page.locator('.card-title', { hasText: title })).not.toBeVisible({ timeout: 10000 });
  });
});
