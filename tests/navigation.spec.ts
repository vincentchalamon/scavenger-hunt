import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-tresor-du-vieux-lille');
  });

  test('Password is NOT saved after reload (security)', async ({ page }) => {
    // Ensure hunt is loaded
    await expect(page.getByTestId('hunt-title')).toBeVisible();
    await expect(page.getByTestId('hunt-title')).toContainText('Le Trésor du Vieux-Lille');

    // Refresh page
    await page.reload();

    // With new security system, password is NOT saved in localStorage
    // User must re-enter password after reload
    const passwordInput = page.getByPlaceholder(/Entrez le mot de passe|Enter password|Mot de passe|Password/i);

    // Password input should be visible again
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
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
    // First item must be selected
    await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(1);
    await expect(page.locator('.GMAMP-maps-pin-view')).toBeVisible();
    await expect(page.locator('.gm-style-iw-c')).toHaveCount(1);
    await expect(page.locator('.gm-style-iw-c')).toBeVisible();

    // Go back to rules tab
    await page.getByTestId('rules-button').click();
    await expect(page.getByTestId('rules')).toBeVisible();
    await expect(page.getByTestId('rules-button')).toHaveClass(/active/);
    await expect(page.getByTestId('manuscript-button')).not.toHaveClass(/active/);
    await expect(page.getByTestId('map-button')).not.toHaveClass(/active/);
  });
});
