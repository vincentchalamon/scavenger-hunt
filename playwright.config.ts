import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';

// Only load .env file if not in CI (where env vars are set directly)
if (!process.env.CI) {
  dotenv.config({ path: path.resolve(__dirname, '.env'), debug: false, quiet: true });
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 45000,
  expect: {
    timeout: 10000,
  },
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'line',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    screenshot: 'only-on-failure',

    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  /* Devices available at https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json */
  projects: [
    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome Galaxy S24',
      use: {
        ...devices['Galaxy S24'],
        locale: 'fr-FR'
      },
    },
    {
      name: 'Mobile Firefox Galaxy S24',
      use: {
        ...devices['Galaxy S24'],
        locale: 'fr-FR'
      },
    },
    {
      name: 'Mobile Safari iPhone 15',
      use: {
        ...devices['iPhone 15'],
        locale: 'fr-FR'
      },
    },
    {
      name: 'Mobile Safari iPhone SE',
      use: {
        ...devices['iPhone SE (3rd gen)'],
        locale: 'fr-FR'
      },
    },
    {
      name: 'Mobile Chrome Galaxy S24 (en-US)',
      use: {
        ...devices['Galaxy S24'],
        locale: 'en-US'
      },
    },
    {
      name: 'Mobile Safari iPhone 15 (en-US)',
      use: {
        ...devices['iPhone 15'],
        locale: 'en-US'
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npx serve@latest out',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
