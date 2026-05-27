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
    await page.locator('.leaflet-marker-icon').first().click();
    await expect(page.getByTestId('place-sheet')).toBeVisible();
    await expect(page.getByTestId('place-item-trigger')).toBeVisible();

    await page.getByTestId('place-item-trigger').click();
    await expect(page.getByTestId('modal')).toBeVisible();

    // Click on the clue to display it
    await page.getByTestId('modal').getByTestId('keyword-button').click();
  });
});
