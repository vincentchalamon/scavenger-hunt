import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

test.describe('Map', () => {
  test.beforeEach(async ({ page }) => {
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');

    // Go to map tab
    await page.getByTestId('map-button').click();
  });

  test('I can search for a destination, the valid ones are shown first', async ({ page }) => {
    // Fill in a destination
    await page.getByTestId('search-field').fill('Hospice');

    // Results are shown, valid results are shown first
    await expect(page.getByTestId('search-results').getByRole('button')).toHaveCount(5);
    await expect(page.getByTestId('search-results').getByRole('button').first()).toHaveText('Hospice Comtesse, Rue de la Monnaie, Lille, France');
  });

  test('I can select a valid destination, its marker is added in the map and saved', async ({ page }) => {
    // Fill in a destination
    await page.getByTestId('search-field').fill('Hospice');
    await expect(page.getByTestId('search-results').getByRole('button').first()).toHaveText('Hospice Comtesse, Rue de la Monnaie, Lille, France');

    // Select first destination
    await page.getByTestId('search-results').getByRole('button').first().click();

    // Results are now hidden
    await expect(page.getByTestId('search-results')).not.toBeVisible();

    // New marker added in the map
    await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(2);
    await expect(page.locator('.gm-style-iw-c')).toHaveCount(1);
    await expect(page.locator('.gm-style-iw-c')).toBeVisible();
    await expect(page.locator('.gm-style-iw-c').locator('h5')).toHaveText('Musée de l\'Hospice Comtesse');
    await expect(page.locator('.gm-style-iw-c').locator('.container a.btn-primary')).toBeVisible();
    await expect(page.locator('.gm-style-iw-c').locator('.container button')).toBeVisible();

    // Reload page, markers are saved
    await page.reload();
    await new HuntApp(page).navigateAndAuthenticate('/le-secret-du-vieux-lille');
    await page.getByTestId('map-button').click();
    await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(2);
  });

  test('I can fill in a wrong destination, an error message is shown', async ({ page }) => {
    // Fill in and select a wrong destination
    await page.getByTestId('search-field').fill('Dilettante');
    await page.getByTestId('search-results').getByRole('button').first().click();

    // Notification is visible
    await expect(page.getByTestId('toast')).toBeVisible();
    await expect(page.getByTestId('toast')).toHaveText(/Ce lieu ne fait pas partie du jeu\.|This place is not part of the game\./);
  });

  test('I can show a destination info window', async ({ page }) => {
    // Fill in and select a destination
    await page.getByTestId('search-field').fill('Hospice');
    await page.getByTestId('search-results').getByRole('button').first().click();

    // Description is visible
    await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(2);
    const infoWindow = page.locator('.gm-style-iw-c');
    await expect(infoWindow).toBeVisible();
    await expect(infoWindow.locator('h5')).toHaveText('Musée de l\'Hospice Comtesse');

    // Verify the InfoWindow contains the expected content
    await expect(infoWindow.locator('.container')).toBeVisible();
    await expect(infoWindow.locator('.container a.btn-primary')).toBeVisible();
    await expect(infoWindow.locator('.container button')).toBeVisible();
  });
});
