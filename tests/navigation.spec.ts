import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/le-tresor-du-vieux-lille');

    // Fill in security code
    await page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/).fill(process.env.GOOGLE_MAPS_API_KEY as string);
    await page.getByRole('button', { name: /Enregistrer|Save|Guardar|Speichern|Opslaan/ }).click();

    // Wait for hunt to load
    await expect(page.getByTestId('hunt-title')).toBeVisible({ timeout: 20000 });
  });

  test('I can reload the page, the security code is saved', async ({ page }) => {
    // Ensure hunt is loaded
    await expect(page.getByTestId('hunt-title')).toBeVisible();
    await expect(page.getByTestId('hunt-title')).toContainText('Le Trésor du Vieux-Lille');

    // Refresh page
    await page.reload();
    await expect(page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/)).not.toBeVisible();
    await expect(page.getByTestId('hunt-title')).toBeVisible();
    await expect(page.getByTestId('hunt-title')).toContainText('Le Trésor du Vieux-Lille');
  });

  test('I can navigate using tabs', async ({ page }) => {
    await expect(page.getByTestId('manuscript-button')).toBeVisible();
    await expect(page.getByTestId('manuscript-button')).toHaveClass('nav-link active');
    await expect(page.getByTestId('map-button')).toBeVisible();
    await expect(page.getByTestId('map-button')).not.toHaveClass('nav-link active');

    // Go to map tab
    await page.getByTestId('map-button').click();
    await expect(page.getByTestId('search-field')).toBeVisible();
    await expect(page.getByTestId('manuscript-button')).not.toHaveClass('nav-link active');
    await expect(page.getByTestId('map-button')).toHaveClass('nav-link active');
    // First item must be selected
    await expect(page.locator('.GMAMP-maps-pin-view')).toHaveCount(1);
    await expect(page.locator('.GMAMP-maps-pin-view')).toBeVisible();
    await expect(page.locator('.gm-style-iw-c')).toHaveCount(1);
    await expect(page.locator('.gm-style-iw-c')).toBeVisible();

    // Go to manuscript tab
    await page.getByTestId('manuscript-button').click();
    await expect(page.getByTestId('search-field')).not.toBeVisible();
    await expect(page.getByTestId('manuscript-button')).toHaveClass('nav-link active');
    await expect(page.getByTestId('map-button')).not.toHaveClass('nav-link active');
  });
});
