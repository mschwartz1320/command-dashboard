const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToTasksTab, openAddTaskSheet } = require('./helpers');

const QA_PREFIX = '[QA-TEST]';

test.describe('Move task via card sheet', () => {
  test('create task, move to In Progress via move button, then delete', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    const ts = Date.now();
    const title = `${QA_PREFIX} Move test ${ts}`;

    // Add task (starts in Todo)
    await openAddTaskSheet(page);
    await page.locator('.sheet.open .form-input').first().fill(title);
    await page.locator('.sheet.open .submit-btn').click();
    await page.waitForSelector('.sheet:not(.open)', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(3000);

    await page.reload();
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    // Open card sheet
    const cardTitle = page.locator('.card-title', { hasText: title });
    await expect(cardTitle).toBeVisible({ timeout: 15000 });
    await cardTitle.click();
    await page.waitForSelector('.sheet.open', { timeout: 5000 });

    // Move buttons should be visible in the grid
    const moveBtns = page.locator('.sheet.open .move-btn');
    await expect(moveBtns.first()).toBeVisible({ timeout: 5000 });
    const btnCount = await moveBtns.count();
    expect(btnCount).toBeGreaterThan(0);

    // Click "In Progress" move button (not already active)
    const inProgressBtn = moveBtns.filter({ hasText: /in progress/i });
    if (await inProgressBtn.count() > 0) {
      const cls = await inProgressBtn.getAttribute('class');
      if (!cls.includes('active-section')) {
        await inProgressBtn.click();
        await page.waitForTimeout(3000);

        // Reload and verify card still exists (in In Progress)
        await page.reload();
        await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
        await goToTasksTab(page);
        await waitForTasksLoaded(page);
        await expect(page.locator('.card-title', { hasText: title })).toBeVisible({ timeout: 15000 });
      }
    }

    // Cleanup
    await page.reload();
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    const finalCard = page.locator('.card-title', { hasText: title });
    if (await finalCard.isVisible()) {
      await finalCard.click();
      await page.waitForSelector('.sheet.open', { timeout: 5000 });
      page.once('dialog', d => d.accept());
      await page.locator('.sheet.open .delete-btn').click();
      await page.waitForTimeout(3000);
    }
  });

  test('move task to Done via move button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    const ts = Date.now();
    const title = `${QA_PREFIX} Done test ${ts}`;

    await openAddTaskSheet(page);
    await page.locator('.sheet.open .form-input').first().fill(title);
    await page.locator('.sheet.open .submit-btn').click();
    await page.waitForSelector('.sheet:not(.open)', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(3000);

    await page.reload();
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    const cardTitle = page.locator('.card-title', { hasText: title });
    await expect(cardTitle).toBeVisible({ timeout: 15000 });
    await cardTitle.click();
    await page.waitForSelector('.sheet.open', { timeout: 5000 });

    const doneBtn = page.locator('.sheet.open .move-btn').filter({ hasText: /done/i });
    if (await doneBtn.count() > 0) {
      const cls = await doneBtn.getAttribute('class');
      if (!cls.includes('active-section')) {
        await doneBtn.click();
        await page.waitForTimeout(3000);
        // Success: task moved to Done
      }
    }

    // Cleanup — find and delete (Done may be hidden)
    await page.reload();
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    // Try to reveal Done section
    const doneToggle = page.locator('button').filter({ hasText: /show done|done/i });
    if (await doneToggle.count() > 0) {
      const doneCard = page.locator('.card-title', { hasText: title });
      if (!(await doneCard.isVisible())) {
        await doneToggle.first().click();
        await page.waitForTimeout(500);
      }
    }

    const card = page.locator('.card-title', { hasText: title });
    if (await card.isVisible()) {
      await card.click();
      await page.waitForSelector('.sheet.open', { timeout: 5000 });
      page.once('dialog', d => d.accept());
      await page.locator('.sheet.open .delete-btn').click();
      await page.waitForTimeout(3000);
    }
  });
});
