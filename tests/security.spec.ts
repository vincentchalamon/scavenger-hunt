import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

test.describe('Security - Password Authentication', () => {
  test('Cannot access the hunt list without password', async ({ page }) => {
    await page.goto('/');

    // Verify that the password page is displayed
    await expect(page.getByPlaceholder(/Entrez le mot de passe|Enter password|Mot de passe|Password/i)).toBeVisible();

    // The unlock button should be visible
    await expect(page.getByRole('button', { name: /Déverrouiller|Unlock/i })).toBeVisible();
  });

  test('Cannot access with wrong password', async ({ page }) => {
    await page.goto('/');

    // Wait for password input
    const passwordInput = page.getByPlaceholder(/Entrez le mot de passe|Enter password|Mot de passe|Password/i);
    await passwordInput.waitFor({ state: 'visible' });

    // Fill in wrong password
    await passwordInput.fill('WrongPassword123!');
    await page.getByRole('button', { name: /Déverrouiller|Unlock/i }).click();

    // Should show an error message
    await expect(page.getByText(/Mot de passe incorrect|Incorrect password|Invalid password/i)).toBeVisible({ timeout: 10000 });

    // Password input should still be visible
    await expect(passwordInput).toBeVisible();
  });

  test('Can access the hunt list with correct password', async ({ page }) => {
    const app = new HuntApp(page);

    // Unlock with correct password
    await app.navigateAndAuthenticate('/');

    // Should see the hunts list
    await expect(page.getByRole('heading', { name: /Chasses au trésor disponibles|Available Treasure Hunts/i })).toBeVisible({ timeout: 10000 });
  });

  test('Can access a specific hunt with correct password', async ({ page }) => {
    const app = new HuntApp(page);

    // Unlock with correct password
    await app.navigateAndAuthenticate('/le-tresor-du-vieux-lille');

    // Should see the hunt page
    await expect(page.getByTestId('hunt-title')).toBeVisible({ timeout: 20000 });
    await expect(page.getByTestId('hunt-title')).toContainText('Le Trésor du Vieux-Lille');
  });

  test('Password persists in memory during session', async ({ page }) => {
    const app = new HuntApp(page);

    // Unlock with correct password
    await app.navigateAndAuthenticate('/');

    // Wait for hunts list to be visible
    await expect(page.getByRole('heading', { name: /Chasses au trésor disponibles|Available Treasure Hunts/i })).toBeVisible({ timeout: 15000 });

    // Click on first hunt start button
    const firstHuntLink = page.getByRole('link').filter({ hasText: /Commencer|Start|Comenzar|Starten/i }).first();
    await expect(firstHuntLink).toBeVisible({ timeout: 5000 });
    await firstHuntLink.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Should not ask for password again (password persists in memory via global context)
    await expect(page.getByPlaceholder(/Entrez le mot de passe|Enter password/i)).not.toBeVisible();

    // Should eventually see the hunt page (may take time to load)
    await expect(page.getByTestId('hunt-title')).toBeVisible({ timeout: 30000 });
  });

  test('Password is required after page reload', async ({ page }) => {
    const app = new HuntApp(page);

    // Unlock with correct password
    await app.navigateAndAuthenticate('/');

    // Verify we're in
    await expect(page.getByRole('heading', { name: /Chasses au trésor disponibles|Available Treasure Hunts/i })).toBeVisible();

    // Reload the page
    await page.reload();

    // Should ask for password again (not stored in localStorage)
    await expect(page.getByPlaceholder(/Entrez le mot de passe|Enter password/i)).toBeVisible();
  });
});
