import { test, expect } from '@playwright/test';

test.describe('Security', () => {
  test('Cannot access the hunt list without API key', async ({ page }) => {
    await page.goto('/');

    // Verify that the security page is displayed
    await expect(page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/)).toBeVisible();

    // Try to submit without entering a key
    await page.getByRole('button', { name: /Enregistrer|Save|Guardar|Speichern|Opslaan/ }).click();

    // The security page should remain visible (or display an error message)
    await expect(page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/)).toBeVisible();
  });

  test('Cannot access a specific hunt without API key', async ({ page }) => {
    await page.goto('/le-tresor-du-vieux-lille');

    // Verify that the security page is displayed
    await expect(page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/)).toBeVisible();

    // Try to submit without entering a key
    await page.getByRole('button', { name: /Enregistrer|Save|Guardar|Speichern|Opslaan/ }).click();

    // The security page should remain visible
    await expect(page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/)).toBeVisible();
  });

  test('Access the hunt list with API key', async ({ page }) => {
    await page.goto('/');

    // Verify that the security page is displayed
    await expect(page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/)).toBeVisible();

    // Fill in security code
    await page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/).fill(process.env.GOOGLE_MAPS_API_KEY as string);
    await page.getByRole('button', { name: /Enregistrer|Save|Guardar|Speichern|Opslaan/ }).click();

    // Should see the hunts list
    await expect(page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/)).not.toBeVisible();
    await expect(page.getByRole('heading', { name: /Chasses au trésor disponibles|Available Treasure Hunts|Búsquedas del tesoro disponibles|Verfügbare Schatzsuchen|Beschikbare schattenjachten/ })).toBeVisible({ timeout: 10000 });
  });

  test('Access a specific hunt with API key', async ({ page }) => {
    await page.goto('/le-tresor-du-vieux-lille');

    // Verify that the security page is displayed
    await expect(page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/)).toBeVisible();

    // Fill in security code
    await page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/).fill(process.env.GOOGLE_MAPS_API_KEY as string);
    await page.getByRole('button', { name: /Enregistrer|Save|Guardar|Speichern|Opslaan/ }).click();

    // Should see the hunt page
    await expect(page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/)).not.toBeVisible();
    await expect(page.getByTestId('hunt-title')).toBeVisible({ timeout: 20000 });
    await expect(page.getByTestId('hunt-title')).toContainText('Le Trésor du Vieux-Lille');
  });
});
