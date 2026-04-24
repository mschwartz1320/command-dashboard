const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 45000,
  globalTimeout: 20 * 60 * 1000, // 20 min total
  retries: process.env.CI ? 1 : 0,
  workers: 1, // serial to avoid GitHub API rate limits
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'https://mschwartz1320.github.io/command-dashboard/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Mobile tests only run locally — skip in CI to keep runtime under control
    ...(process.env.CI ? [] : [{
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    }]),
  ],
});
