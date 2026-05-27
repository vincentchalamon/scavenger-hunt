import {expect, test} from '@playwright/test';
import {HuntApp} from './pages';

/**
 * Interface i18n tests — assert UI strings match the browser locale and that
 * a localStorage override wins over navigator.language.
 *
 * Browser locale is controlled per Playwright project (fr-FR or en-US).
 */

const isEnglish = (locale?: string) => locale?.startsWith('en') ?? false;

test.describe('Interface i18n', () => {
  test('Home page UI follows browser locale', async ({page}, testInfo) => {
    const en = isEnglish(testInfo.project.use.locale);
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    const expectedTitle = en ? 'Available Routes' : 'Parcours disponibles';
    const forbiddenTitle = en ? 'Parcours disponibles' : 'Available Routes';
    await expect(page.getByRole('heading', {name: expectedTitle})).toBeVisible({timeout: 10000});
    await expect(page.getByRole('heading', {name: forbiddenTitle})).not.toBeVisible();

    const expectedStart = en ? 'Start' : 'Commencer';
    const startLink = page.getByRole('link', {name: expectedStart}).first();
    await expect(startLink).toBeVisible();
  });

  test('Hunt page tabs follow browser locale', async ({page}, testInfo) => {
    const en = isEnglish(testInfo.project.use.locale);
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');

    const manuscriptLabel = en ? 'Manuscript' : 'Manuscrit';
    const mapLabel = en ? 'Map' : 'Carte';

    await expect(page.getByTestId('manuscript-button')).toContainText(manuscriptLabel);
    await expect(page.getByTestId('map-button')).toContainText(mapLabel);
  });

  test('404 page follows browser locale', async ({page}, testInfo) => {
    const en = isEnglish(testInfo.project.use.locale);
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/invalid-hunt-url');

    const expectedTitle = en ? 'This trail has gone cold.' : 'Cette piste est froide.';
    await expect(page.getByRole('heading', {name: expectedTitle})).toBeVisible({timeout: 10000});

    const expectedBack = en ? 'Back to hunts list' : 'Retour à la liste des jeux';
    await expect(page.getByRole('link', {name: expectedBack})).toBeVisible();
  });

  test('localStorage language preference wins over navigator.language', async ({page}) => {
    // Regardless of project locale, force English via localStorage and assert UI is English.
    await page.addInitScript(() => {
      window.localStorage.setItem('language', 'en');
    });

    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/');

    await expect(page.getByRole('heading', {name: 'Available Routes'})).toBeVisible({timeout: 10000});
    await expect(page.getByRole('heading', {name: 'Parcours disponibles'})).not.toBeVisible();
  });

  test('Map place sheet uses translated strings', async ({page}, testInfo) => {
    const en = isEnglish(testInfo.project.use.locale);
    const app = new HuntApp(page);
    await app.navigateAndAuthenticate('/le-secret-du-vieux-lille');

    await app.map.navigateToMap();
    await page.waitForTimeout(2000);
    await expect(page.locator('.leaflet-marker-icon').first()).toBeVisible({timeout: 10000});
    await page.locator('.leaflet-marker-icon').first().click();

    const sheet = page.getByTestId('place-sheet');
    await expect(sheet).toBeVisible({timeout: 5000});

    const expectedStep = en ? 'Step' : 'Étape';
    const forbiddenStep = en ? 'Étape' : 'Step';
    await expect(sheet).toContainText(expectedStep);
    await expect(sheet).not.toContainText(forbiddenStep);
  });
});
