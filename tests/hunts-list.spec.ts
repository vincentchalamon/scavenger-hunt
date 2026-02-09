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
    const title = page.getByRole('heading', { name: /Parcours disponibles|Available Routes/ });
    await expect(title).toBeVisible({ timeout: 10000 });

    // Should see "Le Secret du Vieux-Lille"
    const huntTitle = page.getByRole('heading', { name: 'Le Secret du Vieux-Lille' });
    await expect(huntTitle).toBeVisible();

    // Should see a "Start/Commencer" button (multilingual) - now it's inside a Link
    const startButton = page.getByRole('link', { name: /Start|Commencer/ });
    await expect(startButton.first()).toBeVisible();
  });

  test('Should navigate to a hunt when clicking "Commencer"', async ({ page }) => {
    // Navigate to home page and authenticate
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    // Click on "Commencer/Start" button - it's now a link
    const startButton = page.getByRole('link', { name: /Start|Commencer/ }).first();
    await startButton.click();

    // Should navigate to the hunt page
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/le-secret-du-vieux-lille/);

    // Should see the hunt title
    const huntTitle = page.getByTestId('hunt-title');
    await expect(huntTitle).toBeVisible({ timeout: 10000 });
    await expect(huntTitle).toHaveText('Le Secret du Vieux-Lille');
  });

  test('Should navigate directly to a hunt by URL', async ({ page }) => {
    // Navigate directly to hunt URL and authenticate
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');

    // Should show the hunt
    const huntTitle = page.getByTestId('hunt-title');
    await expect(huntTitle).toBeVisible({ timeout: 10000 });
    await expect(huntTitle).toHaveText('Le Secret du Vieux-Lille');
  });

  test('Should show 404 page for invalid hunt url', async ({ page }) => {
    // Navigate to invalid hunt URL and authenticate
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/invalid-hunt-url');

    // Should show 404 page (hunt title won't be visible, but 404 title will)
    const notFoundTitle = page.getByRole('heading', { name: /404 - Jeu introuvable|404 - Hunt Not Found/ });
    await expect(notFoundTitle).toBeVisible({ timeout: 10000 });

    // Should have a link back to home
    const backButton = page.getByRole('link', { name: /Retour à la liste des jeux|Back to hunts list/ });
    await expect(backButton).toBeVisible();

    // Click back button
    await backButton.click();

    // Should redirect to home - password should NOT be required again (global context)
    await page.waitForTimeout(2000);
    const huntsListTitle = page.getByRole('heading', { name: /Parcours disponibles|Available Routes/i });
    await expect(huntsListTitle).toBeVisible({ timeout: 15000 });
  });
});
