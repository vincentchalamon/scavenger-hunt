import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

test.describe('Keyword', () => {
  test.beforeEach(async ({ page }) => {
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');
  });

  test('I can click on a keyword to fill in the phrase', async ({ page }) => {
    // Verify that the phrase contains "se trouve" (hidden words may be represented differently)
    await expect(page.getByTestId('manuscript')).toContainText('se trouve');

    // Go to map tab
    await page.getByTestId('map-button').click();

    // Show marker description
    await expect(page.locator('.leaflet-popup-content').locator('.container button')).toBeVisible();

    // Use JavaScript to trigger the click - the parent div has the onClick handler
    await page.locator('.leaflet-popup-content').locator('.container button').evaluate((btn) => {
      const parentDiv = btn.parentElement;
      if (parentDiv) {
        parentDiv.click();
      }
    });
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
    await page.locator('.leaflet-popup-content').locator('.container button').evaluate((btn) => {
      const parentDiv = btn.parentElement;
      if (parentDiv) {
        parentDiv.click();
      }
    });
    await page.getByTestId('modal').getByTestId('keyword-button').click();
    await expect(page.getByTestId('toast')).toContainText(/Bravo ! Vous avez trouv|Congratulations! You found|Felicidades! Encontraste|Glckwunsch! Sie haben|Gefeliciteerd! Je hebt/);
    await page.getByTestId('modal').locator('.btn-close').click();
    await page.getByTestId('manuscript-button').click();
    await expect(page.getByTestId('manuscript')).toContainText('pied');

    // Return to the same clue
    await page.getByTestId('map-button').click();
    await page.locator('.leaflet-popup-content').locator('.container button').evaluate((btn) => {
      const parentDiv = btn.parentElement;
      if (parentDiv) {
        parentDiv.click();
      }
    });
    await page.getByTestId('modal').getByTestId('keyword-button').click();

    // Click on keyword doesn't change anything (already found, no toast shown)
    await expect(page.getByTestId('toast')).not.toBeVisible();
    await page.getByTestId('modal').locator('.btn-close').click();
    await page.getByTestId('manuscript-button').click();
    await expect(page.getByTestId('manuscript')).toContainText('pied');
  });

  test('Manuscript button animates when a keyword is found', async ({ page }) => {
    // Go to map tab
    await page.getByTestId('map-button').click();

    // Get the manuscript button to check for animation
    const manuscriptButton = page.getByTestId('manuscript-button');

    // Verify the button doesn't have the animation class initially
    await expect(manuscriptButton).not.toHaveClass(/keywordAnimation/);

    // Show marker description and open modal
    await page.locator('.leaflet-popup-content').locator('.container button').evaluate((btn) => {
      const parentDiv = btn.parentElement;
      if (parentDiv) {
        parentDiv.click();
      }
    });
    await expect(page.getByTestId('modal')).toBeVisible();

    // Click on the hidden keyword
    await page.getByTestId('modal').getByTestId('keyword-button').click();

    // Verify the toast appears
    await expect(page.getByTestId('toast')).toContainText(/Bravo ! Vous avez trouv|Congratulations! You found|Felicidades! Encontraste|Glckwunsch! Sie haben|Gefeliciteerd! Je hebt/);

    // Verify the manuscript button now has the animation class
    await expect(manuscriptButton).toHaveClass(/keywordAnimation/);

    // Close the modal
    await page.getByTestId('modal').locator('.btn-close').click();

    // Verify the animation is still active even after the modal is closed
    await expect(manuscriptButton).toHaveClass(/keywordAnimation/);

    // Click on the manuscript button
    await manuscriptButton.click();

    // Verify the animation class is removed after clicking the manuscript button
    await expect(manuscriptButton).not.toHaveClass(/keywordAnimation/);
  });
});
