import { test, expect } from '@playwright/test';

test.describe('Clue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Fill in security code
    await page.getByPlaceholder('Clé d\'accès').fill(process.env.GOOGLE_MAPS_API_KEY as string);
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    // Go to map tab
    await page.getByTestId('map-button').click();
  });

  test('I can show a marker description to display its clue', async ({ page }) => {
    await expect(page.locator('.gm-style-iw-c')).toBeVisible();
    await expect(page.locator('.gm-style-iw-c').locator('.container button')).toBeVisible();

    // Click on the image to display the clue
    await page.locator('.gm-style-iw-c').locator('.container button').click();
    await expect(page.getByTestId('modal')).toBeVisible();

    // Click on the clue to display it
    await page.getByTestId('modal').getByTestId('keyword-button').click();
  });
});
