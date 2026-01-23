import { test, expect } from '@playwright/test';

test.describe('Keyword', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/le-tresor-du-vieux-lille');

    // Fill in security code
    await page.getByPlaceholder('Clé d\'accès').fill(process.env.GOOGLE_MAPS_API_KEY as string);
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    // Wait for hunt to load
    await expect(page.getByTestId('hunt-title')).toBeVisible({ timeout: 20000 });
  });

  test('I can click on a keyword to fill in the phrase', async ({ page }) => {
    await expect(page.getByTestId('manuscript')).toContainText('Le trésor .... ...................... se trouve .... ........ .... .... .............. .... .... ............');

    // Go to map tab
    await page.getByTestId('map-button').click();

    // Show marker description
    await expect(page.locator('.gm-style-iw-c').locator('.container button')).toBeVisible();

    // Click on the image to display the clue
    await page.locator('.gm-style-iw-c').locator('.container button').click();
    await expect(page.getByTestId('modal')).toBeVisible();

    // Click on the hidden keyword
    await expect(page.getByTestId('modal').getByTestId('keyword-button')).toBeInViewport();
    await page.getByTestId('modal').getByTestId('keyword-button').click();
    await expect(page.getByTestId('toast')).toHaveText('Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !');

    // Close modal
    await page.getByTestId('modal').locator('.btn-close').click();

    // Return to manuscript
    await page.getByTestId('manuscript-button').click();
    await expect(page.getByTestId('manuscript')).toContainText('Le trésor .... ...................... se trouve .... pied .... .... .............. .... .... ............');
  });

  test('I cannot find an already found keyword', async ({ page }) => {
    // Select the keyword
    await page.getByTestId('map-button').click();
    await page.locator('.gm-style-iw-c').locator('.container button').click();
    await page.getByTestId('modal').getByTestId('keyword-button').click();
    await expect(page.getByTestId('toast')).toHaveText('Bravo ! Vous avez trouvé un mot-clé vous menant vers le trésor !');
    await page.getByTestId('modal').locator('.btn-close').click();
    await page.getByTestId('manuscript-button').click();
    await expect(page.getByTestId('manuscript')).toContainText('Le trésor .... ...................... se trouve .... pied .... .... .............. .... .... ............');

    // Return to the same clue
    await page.getByTestId('map-button').click();
    await page.locator('.gm-style-iw-c').locator('.container button').click();
    await page.getByTestId('modal').getByTestId('keyword-button').click();

    // Click on keyword doesn't change anything
    await expect(page.getByTestId('toast')).not.toBeVisible();
    await page.getByTestId('modal').locator('.btn-close').click();
    await page.getByTestId('manuscript-button').click();
    await expect(page.getByTestId('manuscript')).toContainText('Le trésor .... ...................... se trouve .... pied .... .... .............. .... .... ............');
  });
});
