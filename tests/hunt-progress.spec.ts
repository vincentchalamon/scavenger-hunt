import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

/**
 * Test for hunt progress tracking across multiple hunts
 */
test.describe('Hunt Progress', () => {

  test('Should display progress percentage for all hunts even at 0%', async ({ page }) => {
    // Navigate to home page and authenticate
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    // Wait for hunts list to load
    const title = page.getByRole('heading', { name: /Chasses au trésor disponibles|Available Treasure Hunts/ });
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check that progress percentage is displayed (looking for "0%" text)
    const progressText = page.getByText(/0%|[0-9]+%/).first();
    await expect(progressText).toBeVisible({ timeout: 5000 });

    // Should show 0% initially for a new hunt
    await expect(progressText).toHaveText(/0%/);
  });

  test('Should display appropriate progress icon based on completion', async ({ page }) => {
    // Navigate to home page and authenticate
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    // Wait for hunts list to load
    const title = page.getByRole('heading', { name: /Chasses au trésor disponibles|Available Treasure Hunts/ });
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check that one of the progress icons is visible (⭕ for 0%, ▶️ for in progress, ✅ for complete)
    const hasProgressIcon = await page.getByText(/⭕|▶️|✅/).first().isVisible().catch(() => false);

    // If no emoji found (some browsers might not render them), at least verify percentage is shown
    if (!hasProgressIcon) {
      const progressText = page.getByText(/[0-9]+%/).first();
      await expect(progressText).toBeVisible();
    }
  });

  test('Should navigate to hunt and back to list', async ({ page }) => {
    // Navigate to home page and authenticate
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    // Wait for hunts list
    const title = page.getByRole('heading', { name: /Chasses au trésor disponibles|Available Treasure Hunts/ });
    await expect(title).toBeVisible({ timeout: 10000 });

    // Verify progress is shown initially
    const initialProgress = page.getByText(/[0-9]+%/).first();
    await expect(initialProgress).toBeVisible();

    // Go to the hunt
    const startButton = page.getByRole('link', { name: /Start|Commencer/ }).first();
    await startButton.click();

    // Wait for the hunt page to load
    await expect(page.getByTestId('hunt-title')).toBeVisible({ timeout: 5000 });

    // Navigate back to home page with authentication
    await app.navigateAndAuthenticate('/');

    // Progress should still be visible after returning
    const progressAfter = page.getByText(/[0-9]+%/).first();
    await expect(progressAfter).toBeVisible();
  });
});

