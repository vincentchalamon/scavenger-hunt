import { test, expect } from '@playwright/test';

test.describe('Security', () => {
  test('Cannot access the application without API key', async ({ page }) => {
    await page.goto('/');

    // Verify that the security page is displayed
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();

    // Try to submit without entering a key
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    // The security page should remain visible (or display an error message)
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();
  });

  test('Access the application with API key', async ({ page }) => {
    await page.goto('/');

    // Verify that the security page is displayed
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();

    // Fill in security code
    await page.getByPlaceholder('Clé d\'accès').fill(process.env.GOOGLE_MAPS_API_KEY as string);
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    await expect(page.getByPlaceholder('Clé d\'accès')).not.toBeVisible();
  });
});
