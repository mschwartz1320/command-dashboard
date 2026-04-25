const { test, expect } = require('@playwright/test');
const { waitForTasksLoaded, goToTasksTab } = require('./helpers');

test.describe('Column scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);
  });

  test('columns are scroll containers with bounded height (not overflow:visible)', async ({ page }) => {
    // At desktop viewport, column-cards must have a finite scrollHeight that is
    // constrained by the viewport — i.e. they should be scroll containers.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    const result = await page.evaluate(() => {
      const cols = Array.from(document.querySelectorAll('.column-cards'));
      if (cols.length === 0) return { ok: false, reason: 'no .column-cards found' };

      const viewportHeight = window.innerHeight;
      const issues = [];

      for (const col of cols) {
        const style = window.getComputedStyle(col);
        const overflowY = style.overflowY;
        const rect = col.getBoundingClientRect();

        // Column height must be bounded (not taller than viewport)
        if (rect.height > viewportHeight) {
          issues.push(\`column height \${Math.round(rect.height)}px exceeds viewport \${viewportHeight}px — scroll not working\`);
        }

        // overflow-y must be auto or scroll, not visible
        if (overflowY === 'visible') {
          issues.push(\`column overflow-y is visible — scroll container broken\`);
        }
      }

      return issues.length > 0
        ? { ok: false, reason: issues.join('; ') }
        : { ok: true, colCount: cols.length };
    });

    expect(result.ok, result.reason).toBe(true);
  });

  test('board tab panel fills viewport height on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await goToTasksTab(page);
    await waitForTasksLoaded(page);

    const result = await page.evaluate(() => {
      const panel = document.querySelector('.tab-panel.active');
      if (!panel) return { ok: false, reason: 'no active tab panel' };
      const rect = panel.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Panel should be close to viewport height (within 200px for header)
      if (rect.height < viewportHeight - 200) {
        return { ok: false, reason: \`tab panel height \${Math.round(rect.height)}px is too short for viewport \${viewportHeight}px\` };
      }
      return { ok: true };
    });

    expect(result.ok, result.reason).toBe(true);
  });
});
