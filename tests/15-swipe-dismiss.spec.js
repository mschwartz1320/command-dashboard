const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToTasksTab } = require('./helpers');

test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14

test.describe('Swipe to dismiss sheets', () => {
  test('swipe down on card sheet closes it', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);
    const firstCard = page.locator('.card').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
    await page.waitForSelector('#card-sheet.open', { timeout: 5000 });
    // Simulate swipe down gesture
    const sheet = page.locator('#card-sheet');
    const box = await sheet.boundingBox();
    if (!box) throw new Error('Sheet not visible');
    await page.touchscreen.tap(box.x + box.width / 2, box.y + 20);
    // Swipe down 120px
    await page.mouse.move(box.x + box.width / 2, box.y + 20);
    await page.dispatchEvent('#card-sheet', 'touchstart', {
      touches: [{ clientX: box.x + box.width / 2, clientY: box.y + 20 }]
    });
    await page.dispatchEvent('#card-sheet', 'touchmove', {
      touches: [{ clientX: box.x + box.width / 2, clientY: box.y + 140 }]
    });
    await page.dispatchEvent('#card-sheet', 'touchend', {
      changedTouches: [{ clientX: box.x + box.width / 2, clientY: box.y + 140 }]
    });
    // Sheet should close
    await expect(page.locator('#card-sheet')).not.toHaveClass(/open/, { timeout: 2000 });
  });
});
