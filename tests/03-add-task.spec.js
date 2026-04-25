const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToTasksTab, openAddTaskSheet } = require('./helpers');

const QA_PREFIX = '[QA-TEST]';

test.describe('Add task', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);
  });

  test('FAB click opens add-task sheet', async ({ page }) => {
    await page.locator('.fab').click();
    await expect(page.locator('.sheet')).toHaveClass(/open/, { timeout: 5000 });
    await expect(page.locator('.sheet-title')).toBeVisible();
  });

  test('add task form has title input and submit button', async ({ page }) => {
    await openAddTaskSheet(page);
    await expect(page.locator('.sheet.open .form-input').first()).toBeVisible();
    await expect(page.locator('.sheet.open .submit-btn')).toBeVisible();
  });

  test('add a QA task, verify it appears, then delete it', async ({ page }) => {
    const ts = Date.now();
    const title = `${QA_PREFIX} Add test ${ts}`;

    // Open sheet
    await openAddTaskSheet(page);

    // Fill title (first text input in sheet)
    await page.locator('.sheet.open .form-input').first().fill(title);

    // Pick tag if select exists
    const selects = page.locator('.sheet.open .form-select');
    if (await selects.count() > 0) {
      await selects.first().selectOption({ index: 1 }).catch(() => {});
    }

    // Submit
    await page.locator('.sheet.open .submit-btn').click();
    await page.waitForSelector('.sheet:not(.open)', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // Reload to get fresh state
    await page.reload();
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    // Find the task card
    const taskCard = page.locator('.card-title', { hasText: title });
    await expect(taskCard).toBeVisible({ timeout: 15000 });

    // --- CLEANUP: delete the task ---
    await taskCard.click();
    await page.waitForSelector('.sheet.open', { timeout: 5000 });

    const deleteBtn = page.locator('.sheet.open .delete-btn');
    await expect(deleteBtn).toBeVisible();

    page.once('dialog', dialog => dialog.accept());
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
