import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';
import {getConfig} from "@/lib/hunts";

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
    await page.locator('.leaflet-marker-icon').first().click();
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
    await page.locator('.leaflet-marker-icon').first().click();
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
    await page.locator('.leaflet-marker-icon').first().click();
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

  test('I can see the keywords I have already visited after reload', async ({ page }) => {
    // Populate localStorage
    const hunt = getConfig().hunts[0];
    await page.evaluate((hunt) => {
      localStorage.setItem('keywords_le-secret-du-vieux-lille', JSON.stringify(hunt.phrase.split(" ").filter((value, index, self) => self.indexOf(value) === index)));
    }, hunt);

    // Reload page
    await page.reload();
    await new HuntApp(page).navigateAndAuthenticate('/le-secret-du-vieux-lille');
    await page.getByTestId('manuscript-button').click();

    // Keywords are visible in the phrase
    await expect(page.getByTestId('manuscript')).toContainText(hunt.phrase);
  });
});
