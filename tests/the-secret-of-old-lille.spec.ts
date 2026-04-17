import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

/**
 * E2E test for the English version "The Secret of Old Lille".
 *
 * Mirrors le-secret-du-vieux-lille.spec.ts with English assertions.
 * The hunt is the same itinerary; only the content is translated.
 */
test.describe('The Secret of Old Lille', () => {

  test('Complete user journey from start to final place discovery', async ({page}) => {
    test.setTimeout(180000);

    const app = new HuntApp(page);

    await test.step('Initialize application', async () => {
      await app.navigateAndAuthenticate('/the-secret-of-old-lille');
      await app.verifyHuntTitle('The Secret of Old Lille');
    });

    await test.step('Read manuscript and game rules', async () => {
      await app.manuscript.navigateToManuscript();
      await app.manuscript.verifyTabActive();
      await app.manuscript.verifyText('The secret ···· ······ ·········· lies ············ at ······ ········ ···· ······ ·············· ············');
      await app.manuscript.verifyClues('ARMS', 'GOLD');
    });

    await test.step('Navigate to map tab', async () => {
      await app.map.navigateToMap();
      await app.map.verifyTabActive();
      await page.waitForTimeout(2000);
      await expect(app.map.searchField).toBeVisible({timeout: 10000});
      await app.map.verifyMarkerCount(1);
      await page.locator('.leaflet-marker-icon').first().click();
      await expect(app.map.popup).toBeVisible({timeout: 10000});
    });

    await test.step('Place 1: Le Bras d\'Or - Find keyword "foot"', async () => {
      await app.map.closeAllModals();
      await app.map.verifyPopupPlace('Le Bras d\'Or');
      await app.map.showClue();

      const clue = app.createClickableImageClue();
      await clue.viewImageInArea(0.9, 0.5, 'press.jpg');
      await clue.solveAndClose(/Bravo ! Vous avez trouvé un mot-clé vous menant vers le lieu final !|Congratulations! You found a keyword leading to the last place location!/);

      await app.manuscript.navigateToManuscript();
      await app.manuscript.verifyText('The secret ···· ······ ·········· lies ············ at ······ foot ···· ······ ·············· ············');
      await app.map.navigateToMap();
    });

    await test.step('Place 2: Hospice Comtesse - Find keyword "of"', async () => {
      await app.solveClickableImageWithPuzzle(
        'Hospice Comtesse',
        'Hospice Comtesse Museum',
        2,
        0.9,
        0.1,
        'code.jpg',
        'The secret of ······ ·········· lies ············ at ······ foot of ······ ·············· ············'
      );
    });

    await test.step('Place 3: Aux Merveilleux de Fred - Find keyword "Column"', async () => {
      await app.solveScratchCardPlace(
        'Aux Merveilleux de Fred Vieux Lille',
        'Aux Merveilleux de Fred',
        3,
        'Column',
        'The secret of ······ ·········· lies ············ at ······ foot of ······ ·············· Column',
        'Place aux Oignons'
      );
    });

    await test.step('Place 4: Place aux Oignons - Find keyword "hidden"', async () => {
      await app.map.closeAllModals();
      await app.map.findPlace('Place aux Oignons', 'Place aux Oignons', 4);
      await app.map.showClue();

      const clue = app.createClickableImageClue();

      await clue.clickArea(0.1, 0.78);
      await page.waitForTimeout(1000);

      const cardFlipModal = page.locator('[data-testid="modal"]').nth(1);
      await expect(cardFlipModal).toBeVisible({timeout: 5000});
      const cardImage = cardFlipModal.locator('img').first();
      await expect(cardImage).toBeVisible({timeout: 2000});

      const imageBox = await cardImage.boundingBox();
      if (imageBox) {
        const clickX = imageBox.x + imageBox.width * 0.9;
        const clickY = imageBox.y + imageBox.height * 0.1;
        await page.mouse.click(clickX, clickY);
        await page.waitForTimeout(1000);
      }

      const closeButton = cardFlipModal.locator('button.btn-close');
      await closeButton.click();
      await page.waitForTimeout(500);

      await clue.solveAndClose();

      await app.manuscript.navigateToManuscript();
      await app.manuscript.verifyText('The secret of ······ ·········· lies hidden at ······ foot of ······ ·············· Column');
      await app.map.navigateToMap();
    });

    await test.step('Place 5: Notre-Dame-de-la-Treille Cathedral - Find keyword "the"', async () => {
      await app.map.closeAllModals();
      await app.map.findPlace('Notre Dame de la Treille', 'Notre-Dame-de-la-Treille Cathedral', 5);
      await app.map.showClue();

      const clue = app.createClickableImageClue();
      await clue.viewImageInArea(0.95, 0.55, 'letter.png');
      await clue.solveAndClose();

      await app.manuscript.navigateToManuscript();
      await app.manuscript.verifyText('The secret of ······ ·········· lies hidden at the foot of the ·············· Column');
      await app.map.navigateToMap();
    });

    await test.step('Place 6: Maison Méert - Find keyword "Lille" (3D box)', async () => {
      await app.solveBox3DPlace(
        'Maison Meert',
        'Maison Méert',
        6,
        'The secret of ······ Lille lies hidden at the foot of the ·············· Column'
      );
    });

    await test.step('Place 7: Old Stock Exchange - Find keyword "Old" (page flip)', async () => {
      await app.solvePageFlipPlace(
        'Vieille Bourse',
        'Old Stock Exchange',
        7,
        'The secret of Old Lille lies hidden at the foot of the ·············· Column',
        'Lille Opera'
      );
    });

    await test.step('Place 8: Lille Opera - Find keyword "Goddess" (magnifier)', async () => {
      await app.solveMagnifierPlace(
        'Opera de Lille',
        'Lille Opera',
        8,
        'The secret of Old Lille lies hidden at the foot of the Goddess Column',
        'Congratulations! You found all the hidden words. Check the sentence to discover the last place!'
      );
    });

    await test.step('Verify complete phrase is revealed', async () => {
      await app.manuscript.navigateToManuscript();
      await app.manuscript.verifyText('The secret of Old Lille lies hidden at the foot of the Goddess Column');
      await app.manuscript.verifyPhraseComplete();
    });

    await test.step('Final place: Goddess Column - Discover the last place location', async () => {
      await app.verifyTreasureLocation(
        'Colonne de la Deesse',
        'Goddess Column',
        9,
        'CONGRATULATIONS',
        'You have found the secret of Old Lille'
      );
    });

    await test.step('Verify data persistence after reload', async () => {
      await app.verifyPersistence(9, 'The secret of Old Lille lies hidden at the foot of the Goddess Column');
    });
  });
});
