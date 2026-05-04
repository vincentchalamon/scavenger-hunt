import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';
import {getConfig} from "@/lib/hunts";

const isEnglish = (locale?: string) => locale?.startsWith('en') ?? false;

test.describe('Map', () => {
  test.beforeEach(async ({ page }) => {
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');

    // Go to map tab
    await page.getByTestId('map-button').click();
  });

  test('I can search for a destination, only the valid ones are shown', async ({ page }) => {
    // Fill in a destination
    await page.getByTestId('search-field').fill('Hospice Comtesse');

    // Wait for search results to appear
    await page.getByTestId('search-results').waitFor({ state: 'visible', timeout: 5000 });

    // Results are shown (OpenStreetMap may return different number of results than Google Maps)
    const resultsCount = await page.getByTestId('search-results').getByRole('button').count();
    expect(resultsCount).toBeGreaterThan(0);
    await expect(page.getByTestId('search-results').getByRole('button').first()).toContainText('Hospice Comtesse', { ignoreCase: true });
  });

  test('I can select a valid destination, its marker is added in the map and saved', async ({ page }) => {
    // Fill in a destination
    await page.getByTestId('search-field').fill('Hospice Comtesse');

    // Wait for search results to appear
    await page.getByTestId('search-results').waitFor({ state: 'visible', timeout: 5000 });

    // Select first destination
    await page.getByTestId('search-results').getByRole('button').first().click();

    // Results are now hidden
    await expect(page.getByTestId('search-results')).not.toBeVisible();

    // New marker added in the map
    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(2);
    await expect(page.locator('.leaflet-popup-content')).toHaveCount(1);
    await expect(page.locator('.leaflet-popup-content')).toBeVisible();
    await expect(page.locator('.leaflet-popup-content').locator('h5')).toHaveText('Musée de l\'Hospice Comtesse');
    await expect(page.locator('.leaflet-popup-content').locator('.container a.btn-primary')).toBeVisible();
    await expect(page.locator('.leaflet-popup-content').locator('.container button')).toBeVisible();

    // Reload page, markers are saved
    await page.reload();
    await new HuntApp(page).navigateAndAuthenticate('/le-secret-du-vieux-lille');
    await page.getByTestId('map-button').click();
    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(2);
  });

  test('I can fill in a wrong destination, an error message is shown', async ({ page }) => {
    // Fill in and select a wrong destination
    await page.getByTestId('search-field').fill('Dilettante');

    // Wait for search results to appear
    await page.getByTestId('search-results').waitFor({ state: 'visible', timeout: 5000 });

    await page.getByTestId('search-results').getByRole('button').first().click();

    // Notification is visible
    await expect(page.getByTestId('toast')).toBeVisible();
    await expect(page.getByTestId('toast')).toHaveText(/Ce lieu ne fait pas partie du jeu\.|This place is not part of the game\./);
  });

  test('I can show a destination popup', async ({ page }) => {
    // Fill in and select a destination
    await page.getByTestId('search-field').fill('Hospice Comtesse');

    // Wait for search results to appear
    await page.getByTestId('search-results').waitFor({ state: 'visible', timeout: 5000 });

    await page.getByTestId('search-results').getByRole('button').first().click();

    // Description is visible
    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(2);
    const popup = page.locator('.leaflet-popup-content');
    await expect(popup).toBeVisible();
    await expect(popup.locator('h5')).toHaveText('Musée de l\'Hospice Comtesse');

    // Verify the popup contains the expected content
    await expect(popup.locator('.container')).toBeVisible();
    await expect(popup.locator('.container a.btn-primary')).toBeVisible();
    await expect(popup.locator('.container button')).toBeVisible();
  });

  test('Closing a puzzle modal hints the search bar', async ({ page }, testInfo) => {
    const en = isEnglish(testInfo.project.use.locale);
    const defaultPlaceholder = en ? 'Search for a place...' : 'Rechercher un lieu...';
    const hintPlaceholder = en ? 'Type the next place name...' : 'Saisissez le nom du prochain lieu...';

    const searchField = page.getByTestId('search-field');
    await expect(searchField).toHaveAttribute('placeholder', defaultPlaceholder);

    // Open the popup of the first marker
    await page.waitForTimeout(2000);
    await page.locator('.leaflet-marker-icon').first().click();
    await expect(page.locator('.leaflet-popup-content')).toBeVisible({ timeout: 10000 });

    // Open the puzzle modal (click parent div due to ModalItem onClick wrapper)
    const showButton = page.locator('.leaflet-popup-content .container button');
    await showButton.evaluate((btn) => (btn.parentElement as HTMLElement | null)?.click());
    await expect(page.getByTestId('modal')).toBeVisible({ timeout: 10000 });

    // Close the modal
    await page.getByTestId('modal').locator('.btn-close').first().click();
    await expect(page.getByTestId('modal')).not.toBeVisible({ timeout: 5000 });

    // Popup is auto-closed and search bar shows the directive placeholder
    await expect(page.locator('.leaflet-popup-content')).not.toBeVisible();
    await expect(searchField).toHaveAttribute('placeholder', hintPlaceholder);

    // Reset on user input
    await searchField.fill('a');
    await expect(searchField).toHaveAttribute('placeholder', defaultPlaceholder);
  });

  test('I can see the places I have already visited after reload', async ({ page }) => {
    // Populate localStorage
    const hunt = getConfig().hunts[0];
    await page.evaluate((hunt) => {
      localStorage.setItem('places_le-secret-du-vieux-lille', JSON.stringify(hunt.places));
    }, hunt);

    // Reload page
    await page.reload();
    await new HuntApp(page).navigateAndAuthenticate('/le-secret-du-vieux-lille');
    await page.getByTestId('map-button').click();

    // Places icons are visible in the map
    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(9);
  });
});
