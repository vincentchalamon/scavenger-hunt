import { test, expect } from '@playwright/test';

test.describe('Security', () => {
  test('Cannot access the application without API key', async ({ page }) => {
    await page.goto('/');

    // Vérifier que la page de sécurité est affichée
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();

    // Essayer de valider sans entrer de clé
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    // La page de sécurité devrait rester visible (ou afficher un message d'erreur)
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();
  });

  test('Access the application with API key', async ({ page }) => {
    await page.goto('/');

    // Vérifier que la page de sécurité est affichée
    await expect(page.getByPlaceholder('Clé d\'accès')).toBeVisible();

    // Fill in security code
    await page.getByPlaceholder('Clé d\'accès').fill(process.env.GOOGLE_MAPS_API_KEY as string);
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();

    await expect(page.getByPlaceholder('Clé d\'accès')).not.toBeVisible();
  });
});
