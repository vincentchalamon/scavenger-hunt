import { test, expect } from '@playwright/test';

/**
 * Test for the hunts list page
 */
test.describe('Hunts List', () => {

  test('Should display the list of available hunts', async ({ page }) => {
    // Navigate to home page
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });

    // Should require API key first
    const apiKeyInput = page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/);
    await expect(apiKeyInput).toBeVisible({ timeout: 15000 });

    // Enter API key
    await apiKeyInput.fill(process.env.GOOGLE_MAPS_API_KEY as string);
    const saveButton = page.getByRole('button', { name: /Enregistrer|Save|Guardar|Speichern|Opslaan/ });
    await saveButton.click();

    // Wait for hunts list to appear
    await page.waitForTimeout(2000);

    // Should see the title (multilingual)
    const title = page.getByRole('heading', { name: /Chasses au trésor disponibles|Available Treasure Hunts|Búsquedas del tesoro disponibles|Verfügbare Schatzsuchen|Beschikbare schattenjachten/ });
    await expect(title).toBeVisible({ timeout: 10000 });

    // Should see at least one hunt card
    const huntCard = page.locator('.card').first();
    await expect(huntCard).toBeVisible();

    // Should see "Le Trésor du Vieux-Lille"
    const huntTitle = page.getByText('Le Trésor du Vieux-Lille');
    await expect(huntTitle).toBeVisible();

    // Should see a "Commencer" button (multilingual)
    const startButton = page.locator('a.btn-primary').first();
    await expect(startButton).toBeVisible();
    await expect(startButton).toHaveText(/Commencer|Start|Comenzar|Beginnen/);
  });

  test('Should navigate to a hunt when clicking "Commencer"', async ({ page }) => {
    // Navigate to home page
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });

    // Enter API key
    const apiKeyInput = page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/);
    await expect(apiKeyInput).toBeVisible({ timeout: 15000 });
    await apiKeyInput.fill(process.env.GOOGLE_MAPS_API_KEY as string);
    const saveButton = page.getByRole('button', { name: /Enregistrer|Save|Guardar|Speichern|Opslaan/ });
    await saveButton.click();

    // Wait for hunts list to appear
    await page.waitForTimeout(2000);

    // Click on "Commencer" button
    const startButton = page.locator('a.btn-primary').first();
    await startButton.click();

    // Should navigate to the hunt page
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/le-tresor-du-vieux-lille/);

    // Should see the hunt title
    const huntTitle = page.getByTestId('hunt-title');
    await expect(huntTitle).toBeVisible({ timeout: 10000 });
    await expect(huntTitle).toHaveText('Le Trésor du Vieux-Lille');
  });

  test('Should navigate directly to a hunt by URL', async ({ page }) => {
    // Navigate directly to hunt URL
    await page.goto('/le-tresor-du-vieux-lille', { waitUntil: 'networkidle', timeout: 30000 });

    // Should require API key first
    const apiKeyInput = page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/);
    await expect(apiKeyInput).toBeVisible({ timeout: 15000 });

    // Enter API key
    await apiKeyInput.fill(process.env.GOOGLE_MAPS_API_KEY as string);
    const saveButton = page.getByRole('button', { name: /Enregistrer|Save|Guardar|Speichern|Opslaan/ });
    await saveButton.click();

    // Should show the hunt
    await page.waitForTimeout(2000);
    const huntTitle = page.getByTestId('hunt-title');
    await expect(huntTitle).toBeVisible({ timeout: 10000 });
    await expect(huntTitle).toHaveText('Le Trésor du Vieux-Lille');
  });

  test('Should show 404 page for invalid hunt slug', async ({ page }) => {
    // Navigate to invalid hunt URL
    await page.goto('/invalid-hunt-slug', { waitUntil: 'networkidle', timeout: 30000 });

    // Should show 404 page
    await page.waitForTimeout(2000);
    const notFoundTitle = page.getByRole('heading', { name: /404 - Jeu introuvable|404 - Hunt Not Found|404 - Búsqueda no encontrada|404 - Schatzsuche nicht gefunden|404 - Schattenjacht niet gevonden/ });
    await expect(notFoundTitle).toBeVisible({ timeout: 10000 });

    // Should have a link back to home
    const backButton = page.locator('a.btn-primary');
    await expect(backButton).toBeVisible();
    await expect(backButton).toHaveText(/Retour à la liste des jeux|Back to hunts list|Volver a la lista de búsquedas|Zurück zur Schatzsuchen-Liste|Terug naar de schattenjachten lijst/);

    // Click back button
    await backButton.click();

    // Should redirect to home and require API key again
    await page.waitForTimeout(2000);
    const apiKeyInput = page.getByPlaceholder(/Clé d'accès|Access Key|Clave de acceso|Zugriffsschlüssel|Toegangssleutel/);
    await expect(apiKeyInput).toBeVisible({ timeout: 15000 });
  });
});
