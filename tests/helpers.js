/**
 * Shared helpers for command-dashboard Playwright tests.
 */
const { expect } = require('@playwright/test');

/** Wait for the page to finish loading tasks (spinner gone, at least 1 card or empty state) */
async function waitForTasksLoaded(page) {
  await page.waitForFunction(() => {
    const loading = document.querySelector('.loading-screen');
    return !loading || loading.style.display === 'none' || !loading.offsetParent;
  }, { timeout: 30000 });
}

/** Navigate to the Tasks tab and wait for data */
async function goToTasksTab(page) {
  const tasksTab = page.locator('.nav-tab').filter({ hasText: 'Tasks' });
  const cls = await tasksTab.getAttribute('class');
  if (!cls.includes('active')) {
    await tasksTab.click();
  }
  await waitForTasksLoaded(page);
}

/** Navigate to the Memory tab */
async function goToMemoryTab(page) {
  await page.locator('.nav-tab').filter({ hasText: 'Memory' }).click();
  await page.waitForTimeout(1500);
}

/** Navigate to the Insights tab */
async function goToInsightsTab(page) {
  await page.locator('.nav-tab').filter({ hasText: 'Insights' }).click();
  await page.waitForTimeout(1500);
}

/** Open the add-task FAB sheet */
async function openAddTaskSheet(page) {
  await page.locator('.fab').click();
  await page.waitForSelector('.sheet.open', { timeout: 5000 });
}

/** Close any open sheet by clicking the backdrop */
async function closeSheet(page) {
  const backdrop = page.locator('.sheet-backdrop.open');
  if (await backdrop.isVisible()) {
    await backdrop.click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(400);
  }
}

module.exports = {
  waitForTasksLoaded,
  goToTasksTab,
  goToMemoryTab,
  goToInsightsTab,
  openAddTaskSheet,
  closeSheet,
};
