import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

test.describe('Keyword', () => {
  test.beforeEach(async ({ page }) => {
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');
  });

  test('I can click on a keyword to fill in the phrase', async ({ page }) => {
    // Vérifier que la phrase contient "se trouve" (les mots cachés peuvent être représentés différemment)
    await expect(page.getByTestId('manuscript')).toContainText('se trouve');

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
    await expect(page.getByTestId('toast')).toContainText(/Bravo ! Vous avez trouv|Congratulations! You found|Felicidades! Encontraste|Glckwunsch! Sie haben|Gefeliciteerd! Je hebt/);

    // Close modal
    await page.getByTestId('modal').locator('.btn-close').click();

    // Return to manuscript - the keyword "pied" should now be visible
    await page.getByTestId('manuscript-button').click();
    await expect(page.getByTestId('manuscript')).toContainText('pied');
  });

  test('I cannot find an already found keyword', async ({ page }) => {
    // Select the keyword
    await page.getByTestId('map-button').click();
    await page.locator('.gm-style-iw-c').locator('.container button').click();
    await page.getByTestId('modal').getByTestId('keyword-button').click();
    await expect(page.getByTestId('toast')).toContainText(/Bravo ! Vous avez trouv|Congratulations! You found|Felicidades! Encontraste|Glckwunsch! Sie haben|Gefeliciteerd! Je hebt/);
    await page.getByTestId('modal').locator('.btn-close').click();
    await page.getByTestId('manuscript-button').click();
    await expect(page.getByTestId('manuscript')).toContainText('pied');

    // Return to the same clue
    await page.getByTestId('map-button').click();
    await page.locator('.gm-style-iw-c').locator('.container button').click();
    await page.getByTestId('modal').getByTestId('keyword-button').click();

    // Click on keyword doesn't change anything (already found, no toast shown)
    await expect(page.getByTestId('toast')).not.toBeVisible();
    await page.getByTestId('modal').locator('.btn-close').click();
    await page.getByTestId('manuscript-button').click();
    await expect(page.getByTestId('manuscript')).toContainText('pied');
  });
});
