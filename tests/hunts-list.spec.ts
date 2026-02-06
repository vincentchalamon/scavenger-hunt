import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

/**
 * Test for the hunts list page
 */
test.describe('Hunts List', () => {

  test('Should display the list of available hunts', async ({ page }) => {
    // Navigate to home page and authenticate
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    // Should see the title (multilingual)
    const title = page.getByRole('heading', { name: /Chasses au trésor disponibles|Available Treasure Hunts|Búsquedas del tesoro disponibles|Verfügbare Schatzsuchen|Beschikbare schattenjachten/ });
    await expect(title).toBeVisible({ timeout: 10000 });

    // Should see "Le Trésor du Vieux-Lille"
    const huntTitle = page.getByText('Le Trésor du Vieux-Lille');
    await expect(huntTitle).toBeVisible();

    // Should see a start button (multilingual)
    const startButton = page.getByRole('link').filter({ hasText: /Commencer|Start|Comenzar|Starten/i }).first();
    await expect(startButton).toBeVisible();
  });

  test('Should navigate to a hunt when clicking "Commencer"', async ({ page }) => {
    // Navigate to home page and authenticate
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    // Click on start button
    const startButton = page.getByRole('link').filter({ hasText: /Commencer|Start|Comenzar|Starten/i }).first();
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
    // Navigate directly to hunt URL and authenticate
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-tresor-du-vieux-lille');

    // Should show the hunt
    const huntTitle = page.getByTestId('hunt-title');
    await expect(huntTitle).toBeVisible({ timeout: 10000 });
    await expect(huntTitle).toHaveText('Le Trésor du Vieux-Lille');
  });

  test('Should show 404 page for invalid hunt url', async ({ page }) => {
    // Navigate to invalid hunt URL and authenticate
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/invalid-hunt-url');

    // Should show 404 page (hunt title won't be visible, but 404 title will)
    const notFoundTitle = page.getByRole('heading', { name: /404 - Jeu introuvable|404 - Hunt Not Found|404 - Búsqueda no encontrada|404 - Schatzsuche nicht gefunden|404 - Schattenjacht niet gevonden/ });
    await expect(notFoundTitle).toBeVisible({ timeout: 10000 });

    // Should have a link back to home
    const backButton = page.getByRole('link').filter({ hasText: /Retour à la liste des jeux|Back to hunts list|Volver a la lista de búsquedas|Zurück zur Schatzsuchen-Liste|Terug naar de schattenjachten lijst/i });
    await expect(backButton).toBeVisible();

    // Click back button
    await backButton.click();

    // Should redirect to home - password should NOT be required again (global context)
    await page.waitForTimeout(2000);
    const huntsListTitle = page.getByRole('heading', { name: /Chasses au trésor disponibles|Available Treasure Hunts/i });
    await expect(huntsListTitle).toBeVisible({ timeout: 15000 });
  });
});
