import { test, expect } from '@playwright/test';

test.describe('Security', () => {
  test('Cannot access the hunt list without API key', async ({ page }) => {
    await page.goto('/');

    // Verify that the security page is displayed
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();

    // Try to submit without entering a key
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    // The security page should remain visible (or display an error message)
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();
  });

  test('Cannot access a specific hunt without API key', async ({ page }) => {
    await page.goto('/le-tresor-du-vieux-lille');

    // Verify that the security page is displayed
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();

    // Try to submit without entering a key
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    // The security page should remain visible
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();
  });

  test('Access the hunt list with API key', async ({ page }) => {
    await page.goto('/');

    // Verify that the security page is displayed
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();

    // Fill in security code
    await page.getByPlaceholder('Clé d\'accès').fill(process.env.GOOGLE_MAPS_API_KEY as string);
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    // Should see the hunts list
    await expect(page.getByPlaceholder('Clé d\'accès')).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Chasses au trésor disponibles' })).toBeVisible({ timeout: 10000 });
  });

  test('Access a specific hunt with API key', async ({ page }) => {
    await page.goto('/le-tresor-du-vieux-lille');

    // Verify that the security page is displayed
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();

    // Fill in security code
    await page.getByPlaceholder('Clé d\'accès').fill(process.env.GOOGLE_MAPS_API_KEY as string);
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    // Should see the hunt page
    await expect(page.getByPlaceholder('Clé d\'accès')).not.toBeVisible();
    await expect(page.getByTestId('hunt-title')).toBeVisible({ timeout: 20000 });
    await expect(page.getByTestId('hunt-title')).toContainText('Le Trésor du Vieux-Lille');
  });
});
