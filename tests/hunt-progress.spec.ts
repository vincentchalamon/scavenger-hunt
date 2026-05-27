import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

/**
 * Test for hunt status / progress display on the hunts list.
 * In the redesign, a fresh hunt shows a "NEW" status chip (no percentage),
 * and the percentage appears only once the hunt is started.
 */
test.describe('Hunt Progress', () => {

  test('Should display a status chip for fresh hunts', async ({ page }) => {
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    const title = page.getByRole('heading', { name: /Parcours disponibles|Available Routes/ });
    await expect(title).toBeVisible({ timeout: 10000 });

    // A fresh hunt shows the "NOUVEAU/NEW" status chip
    const statusChip = page.getByText(/^(NOUVEAU|NEW)$/).first();
    await expect(statusChip).toBeVisible({ timeout: 5000 });
  });

  test('Should display a start link for each hunt', async ({ page }) => {
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    const title = page.getByRole('heading', { name: /Parcours disponibles|Available Routes/ });
    await expect(title).toBeVisible({ timeout: 10000 });

    const startLink = page.getByRole('link', { name: /Start|Commencer/ }).first();
    await expect(startLink).toBeVisible();
  });

  test('Should navigate to hunt and back to list', async ({ page }) => {
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    const title = page.getByRole('heading', { name: /Parcours disponibles|Available Routes/ });
    await expect(title).toBeVisible({ timeout: 10000 });

    // Go to the hunt
    const startButton = page.getByRole('link', { name: /Start|Commencer/ }).first();
    await startButton.click();
    await expect(page.getByTestId('hunt-title')).toBeVisible({ timeout: 5000 });

    // Navigate back to home page
    await app.navigateAndAuthenticate('/');

    // The hunts list is shown again
    const huntHeading = page.getByRole('heading', { name: 'Le Secret du Vieux-Lille' });
    await expect(huntHeading).toBeVisible({ timeout: 10000 });
  });
});
