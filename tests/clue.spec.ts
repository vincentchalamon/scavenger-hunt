import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

test.describe('Clue', () => {
  test.beforeEach(async ({ page }) => {
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');

    // Go to map tab
    await page.getByTestId('map-button').click();
  });

  test('I can show a marker description to display its clue', async ({ page }) => {
    await expect(page.locator('.leaflet-popup-content')).toBeVisible();
    await expect(page.locator('.leaflet-popup-content').locator('.container button')).toBeVisible();

    // Use JavaScript to trigger the click - the parent div has the onClick handler
    await page.locator('.leaflet-popup-content').locator('.container button').evaluate((btn) => {
      // Find the parent div that has the onClick handler
      const parentDiv = btn.parentElement;
      if (parentDiv) {
        parentDiv.click();
      }
    });
    await expect(page.getByTestId('modal')).toBeVisible();

    // Click on the clue to display it
    await page.getByTestId('modal').getByTestId('keyword-button').click();
  });
});
