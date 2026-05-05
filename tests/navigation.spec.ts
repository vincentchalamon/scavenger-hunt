import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');
  });

  test('I can navigate using tabs', async ({ page }) => {
    // Manuscript tab is active by default (rules tab removed)
    await expect(page.getByTestId('manuscript-button')).toBeVisible();
    await expect(page.getByTestId('manuscript-button')).toHaveClass(/active/);
    await expect(page.getByTestId('map-button')).toBeVisible();
    await expect(page.getByTestId('map-button')).not.toHaveClass(/active/);
    await expect(page.getByTestId('manuscript')).toBeVisible();

    // Go to map tab
    await page.getByTestId('map-button').click();
    await expect(page.getByTestId('search-field')).toBeVisible();
    await expect(page.getByTestId('manuscript-button')).not.toHaveClass(/active/);
    await expect(page.getByTestId('map-button')).toHaveClass(/active/);
    // First marker is visible
    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(1);
    await expect(page.locator('.leaflet-marker-icon')).toBeVisible();
    await page.locator('.leaflet-marker-icon').first().click();
    await expect(page.locator('.leaflet-popup-content')).toHaveCount(1);
    await expect(page.locator('.leaflet-popup-content')).toBeVisible();

    // Go back to manuscript tab
    await page.getByTestId('manuscript-button').click();
    await expect(page.getByTestId('manuscript')).toBeVisible();
    await expect(page.getByTestId('manuscript-button')).toHaveClass(/active/);
    await expect(page.getByTestId('map-button')).not.toHaveClass(/active/);
  });
});
