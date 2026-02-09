import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');
  });

  test('I can navigate using tabs', async ({ page }) => {
    // Rules tab is active by default
    await expect(page.getByTestId('rules-button')).toBeVisible();
    await expect(page.getByTestId('rules-button')).toHaveClass(/active/);
    await expect(page.getByTestId('manuscript-button')).toBeVisible();
    await expect(page.getByTestId('manuscript-button')).not.toHaveClass(/active/);
    await expect(page.getByTestId('map-button')).toBeVisible();
    await expect(page.getByTestId('map-button')).not.toHaveClass(/active/);

    // Go to manuscript tab
    await page.getByTestId('manuscript-button').click();
    await expect(page.getByTestId('manuscript')).toBeVisible();
    await expect(page.getByTestId('rules-button')).not.toHaveClass(/active/);
    await expect(page.getByTestId('manuscript-button')).toHaveClass(/active/);
    await expect(page.getByTestId('map-button')).not.toHaveClass(/active/);

    // Go to map tab
    await page.getByTestId('map-button').click();
    await expect(page.getByTestId('search-field')).toBeVisible();
    await expect(page.getByTestId('rules-button')).not.toHaveClass(/active/);
    await expect(page.getByTestId('manuscript-button')).not.toHaveClass(/active/);
    await expect(page.getByTestId('map-button')).toHaveClass(/active/);
    // First item must be selected (Leaflet marker)
    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(1);
    await expect(page.locator('.leaflet-marker-icon')).toBeVisible();
    await expect(page.locator('.leaflet-popup-content')).toHaveCount(1);
    await expect(page.locator('.leaflet-popup-content')).toBeVisible();

    // Go back to rules tab
    await page.getByTestId('rules-button').click();
    await expect(page.getByTestId('rules')).toBeVisible();
    await expect(page.getByTestId('rules-button')).toHaveClass(/active/);
    await expect(page.getByTestId('manuscript-button')).not.toHaveClass(/active/);
    await expect(page.getByTestId('map-button')).not.toHaveClass(/active/);
  });
});
